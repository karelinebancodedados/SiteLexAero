"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { pushLeadGerado } from "@/lib/tracking";

/*
 * Formulário rápido de diagnóstico (captação de leads).
 * Dois passos: 1) qual foi o problema  2) nome + WhatsApp + consentimento.
 * O diagnóstico completo (7 etapas) fica em /diagnostico-completo.
 */

const TOTAL_STEPS = 2;
const WHATSAPP_NUMBER = "5531983259594";

const PROBLEMS = [
  ["atraso_cancel", "Voo atrasado ou cancelado"],
  ["bagagem", "Bagagem extraviada ou danificada"],
  ["overbooking", "Overbooking / embarque negado"],
  ["conexao", "Perdi minha conexão"],
  ["outro", "Outro problema"],
];

const problemText = (value) => PROBLEMS.find(([v]) => v === value)?.[1] ?? "Problema com voo";

const formatPhone = (value) => {
  const phone = value.replace(/\D/g, "").slice(0, 11);
  if (!phone) return "";
  if (phone.length <= 2) return `(${phone}`;
  if (phone.length <= 6) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  if (phone.length <= 10) return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
};

export default function QuickDiagnosticForm({ isEmbedded = false, initialProblem = null }) {
  const [step, setStep] = useState(initialProblem ? 2 : 1);
  const [state, setState] = useState({ tipo: initialProblem, nome: "", whatsapp: "", consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const leadId = useRef(null);
  const pendingSave = useRef(Promise.resolve());

  const phoneDigits = state.whatsapp.replace(/\D/g, "");
  const contactValid = state.nome.trim().length >= 2 && phoneDigits.length >= 10 && state.consent;

  // Nome e telefone só são gravados depois do consentimento (LGPD).
  const saveLead = (answers, currentStep, completed = false) => {
    leadId.current ??= uuidv4();
    const payload = {
      id: leadId.current,
      name: answers.consent ? answers.nome.trim() || null : null,
      phone: answers.consent ? answers.whatsapp || null : null,
      problem_type: answers.tipo || null,
      gclid: new URLSearchParams(window.location.search).get("gclid"),
      last_step_reached: currentStep,
      completed,
      form_data: {
        source: "diagnostico_rapido",
        tipo: answers.tipo,
        term1: answers.consent,
        term2: answers.consent,
        term3: answers.consent,
      },
      updated_at: new Date().toISOString(),
    };
    const save = pendingSave.current.then(async () => {
      const { error } = await supabase.from("leads").upsert(payload, { onConflict: "id" });
      if (error) throw error;
    });
    pendingSave.current = save.catch(err => console.error(err));
    return save;
  };

  const chooseProblem = (tipo) => {
    const answers = { ...state, tipo };
    setState(answers);
    saveLead(answers, 2).catch(() => {});
    setStep(2);
  };

  const setField = (field, value) => setState(s => ({ ...s, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!contactValid || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await saveLead(state, TOTAL_STEPS, true);
      pushLeadGerado("diagnostico_voo");
      setDone(true);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = state.nome.trim().split(/\s+/)[0] || "";
  const waMsg = `Olá! Meu nome é ${state.nome.trim()} e preenchi o formulário no site da LexAero.\n\nProblema: ${problemText(state.tipo)}\n\nGostaria de uma análise do meu caso.`;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  const cardStyle = {
    width: "100%", maxWidth: 500,
    background: isEmbedded ? "transparent" : "var(--lex-white)",
    borderRadius: isEmbedded ? 0 : "20px",
    padding: isEmbedded ? 0 : "2.5rem 2rem",
    boxShadow: isEmbedded ? "none" : "0 20px 40px rgba(0,0,0,0.1)",
    border: isEmbedded ? "none" : "1px solid var(--lex-border-light)",
    color: "#1a1a1a",
    boxSizing: "border-box",
  };
  const titleStyle = { color: "#0f172a", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.35rem" };
  const subStyle = { color: "#64748b", fontSize: "0.875rem", margin: "0 0 1.25rem", lineHeight: 1.5 };
  const inputStyle = { width: "100%", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid var(--lex-border-mid)", fontSize: "1rem", boxSizing: "border-box", marginBottom: "0.6rem", background: "#fff", color: "#1a1a1a" };

  if (done) {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h3 style={titleStyle}>Recebemos{firstName ? `, ${firstName}` : ""}!</h3>
          <p style={subStyle}>Uma especialista vai analisar o seu caso e entrar em contato pelo WhatsApp informado. Se preferir, comece a conversa agora:</p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ width: "100%", padding: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "#25D366", color: "#fff", borderRadius: "9999px", fontWeight: 700, textDecoration: "none", fontSize: "1rem", boxSizing: "border-box" }}>
            Falar agora no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.95rem" }}>Análise gratuita do seu voo</span>
          <span style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>Passo {step} de {TOTAL_STEPS}</span>
        </div>
        <div style={{ width: "100%", height: 4, background: "#e2e8f0", borderRadius: 4, marginBottom: "1.5rem", overflow: "hidden" }}>
          <div style={{ width: `${(step / TOTAL_STEPS) * 100}%`, height: "100%", background: "var(--lex-gold)", transition: "width 0.4s ease" }} />
        </div>

        {step === 1 && (
          <div>
            <h3 style={titleStyle}>O que aconteceu com o seu voo?</h3>
            <p style={subStyle}>Toque na opção que mais se parece com o seu caso.</p>
            {PROBLEMS.map(([value, label]) => {
              const sel = state.tipo === value;
              return (
                <button key={value} type="button" onClick={() => chooseProblem(value)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  padding: "0.9rem 1rem", marginBottom: "0.5rem", borderRadius: "10px", cursor: "pointer", textAlign: "left",
                  border: "1px solid " + (sel ? "var(--lex-gold)" : "var(--lex-border-light)"),
                  background: sel ? "var(--lex-gold-bg)" : "var(--lex-white)",
                  color: "var(--lex-graphite)", fontSize: "0.95rem", fontWeight: 500,
                }}>
                  {label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={submit} noValidate>
            <h3 style={titleStyle}>Para onde enviamos a sua análise?</h3>
            <p style={subStyle}>Problema: <b style={{ color: "#1e293b" }}>{problemText(state.tipo)}</b>{" "}
              <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", padding: 0, color: "#b7860b", textDecoration: "underline", cursor: "pointer", fontSize: "0.85rem" }}>alterar</button>
            </p>
            <input type="text" name="name" autoComplete="name" placeholder="Seu nome" aria-label="Seu nome" value={state.nome}
              onChange={e => setField("nome", e.target.value.replace(/[0-9]/g, ""))} style={inputStyle} />
            <input type="tel" name="tel" autoComplete="tel-national" inputMode="tel" placeholder="Seu WhatsApp com DDD" aria-label="Seu WhatsApp com DDD" value={state.whatsapp}
              onChange={e => setField("whatsapp", formatPhone(e.target.value))} style={inputStyle} />

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", cursor: "pointer", margin: "0.5rem 0 1.25rem" }}>
              <input type="checkbox" checked={state.consent} onChange={e => setField("consent", e.target.checked)}
                style={{ marginTop: 3, accentColor: "var(--lex-gold)", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.45 }}>
                Concordo com a <Link href="/lgpd" target="_blank" style={{ color: "#475569", textDecoration: "underline" }}>Política de Privacidade</Link>, autorizo o contato da LexAero pelo WhatsApp/telefone informado e sei que o envio não garante indenização.
              </span>
            </label>

            {error && <p role="alert" style={{ color: "#b91c1c", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>{error}</p>}

            <button type="submit" disabled={!contactValid || submitting} className="btn btn--primary" style={{
              width: "100%", padding: "1rem", fontSize: "1rem", justifyContent: "center", border: "none",
              background: contactValid ? "var(--lex-gold)" : "#f3f4f6", color: contactValid ? "#111827" : "#9ca3af",
              cursor: contactValid && !submitting ? "pointer" : "not-allowed",
            }}>
              {submitting ? "Enviando..." : "Quero minha análise gratuita"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "var(--lex-text-muted)", fontSize: "0.75rem", margin: "0.85rem 0 0" }}>Leva menos de 30 segundos • Sem compromisso</p>
      </div>
    </div>
  );
}

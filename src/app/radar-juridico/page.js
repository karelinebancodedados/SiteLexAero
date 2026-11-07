import Link from "next/link";
import { RADAR_SLUG_PATTERN } from "@/lib/radarPosts";
import { supabase } from "@/lib/supabaseClient";
import styles from "./updates.module.css";

export const revalidate = 60;
const updateDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
});

function UpdateCard({ update }) {
  const content = update.content?.trim() || "";
  const summary = update.summary?.trim();
  const description = summary || content;
  const needsExpansion = Boolean(content && (description !== content || content.length > 220));
  const preview = needsExpansion && description.length > 220
    ? description.slice(0, 220).replace(/\s+\S*$/, "") + "…"
    : description;

  return (
    <article className={styles.card}>
      <div className={styles.metadata}>
        <span>{update.category || "Jurisprudência"}</span>
        <time dateTime={update.created_at}>{updateDate.format(new Date(update.created_at))}</time>
      </div>
      <h3>{update.title}</h3>
      {preview && <p className={styles.preview}>{preview}</p>}
      {needsExpansion && (
        <details className={styles.details}>
          <summary>
            <span className={styles.read}>Ler atualização</span>
            <span className={styles.close}>Recolher atualização</span>
          </summary>
          <div className={styles.content}>{content}</div>
        </details>
      )}
    </article>
  );
}

export const metadata = {
  title: "Radar Jurídico | LexAero",
  description:
    "Informação técnica, jurisprudência e parâmetros para fortalecer seus direitos como passageiro aéreo.",
};

const IconScale = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/><path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconFile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" x2="12" y1="9" y2="13"/>
    <line x1="12" x2="12.01" y1="17" y2="17"/>
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="12" x="4" y="8"/>
    <path d="M2 22h20"/><path d="M12 2v6"/><path d="m2 8 10-6 10 6"/>
  </svg>
);

export default async function RadarJuridicoPage() {
  const { data: updates, error } = await supabase
    .from("blog_posts")
    .select("id, title, category, summary, content, created_at")
    .like("slug", RADAR_SLUG_PATTERN)
    .order("created_at", { ascending: false });

  if (error) console.error("Erro ao carregar o Radar Jurídico:", error.message);

  return (
    <div style={{ background: "#f8f7f4", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{
        backgroundImage: "linear-gradient(rgba(10, 15, 25, 0.4), rgba(10, 15, 25, 0.8)), url('/background_radar.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "clamp(3rem, 8vw, 5rem) 1.5rem clamp(2.5rem, 6vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(252,189,38,0.07) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "2rem" }}>
            <Link href="/" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Início</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ fontSize: "0.82rem", color: "var(--lex-gold)", fontWeight: 600 }}>Radar Jurídico</span>
          </nav>

          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: "1rem", maxWidth: 600 }}>
            RADAR <span style={{ color: "var(--lex-gold)" }}>JURÍDICO</span>
          </h1>
          <p style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", color: "rgba(255,255,255,0.6)", maxWidth: 500, lineHeight: 1.65, marginBottom: "2rem" }}>
            Base legal, jurisprudência e parâmetros de indenização para você entender e defender seus direitos como passageiro aéreo.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["Base legal", "Jurisprudência STJ/STF", "Direitos do passageiro", "Parâmetros de indenização"].map((t) => (
              <span key={t} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "0.3rem 0.85rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {updates?.length > 0 && (
        <section className="section" aria-labelledby="radar-atualizacoes">
          <div className="container">
            <div className={styles.heading}>
              <span className="eyebrow">Jurisprudência e novidades</span>
              <h2 id="radar-atualizacoes">Últimas atualizações</h2>
            </div>
            <div className={styles.grid}>
              {updates.map(update => <UpdateCard key={update.id} update={update} />)}
            </div>
          </div>
        </section>
      )}

      {/* ALERTA STF */}
      <div style={{ background: "#fffbea", borderBottom: "1px solid #fde68a", marginBottom: "1.5rem" }}>
        <div className="container" style={{ padding: "1.1rem 1.5rem", display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
          <span style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }}><IconAlert /></span>
          <div>
            <strong style={{ fontSize: "0.88rem", color: "#92400e", display: "block", marginBottom: "0.2rem" }}>
              Atenção — Suspensão nacional no STF (Tema 1.417)
            </strong>
            <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.65, color: "#78350f" }}>
              Desde <strong>26/11/2025</strong>, o STF suspendeu processos de responsabilidade civil por <strong>atraso/cancelamento por caso fortuito</strong> (ARE 1.560.244). <strong>Não atinge:</strong> extravio de bagagem, overbooking e falhas internas da operação.
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="container" style={{ padding: "clamp(2rem, 5vw, 3.5rem) 1.5rem" }}>

        {/* Grid 2 colunas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>

          {/* Documentos */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(1.25rem, 4vw, 2rem)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
              <img src="/documentos_pessoais.png" alt="Documentos essenciais" style={{ width: 32, height: 32, objectFit: "contain" }} />
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Documentos essenciais</h2>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.1rem", lineHeight: 1.6 }}>
              Organize sua prova antes de acionar a companhia aérea.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                ["Cartão de embarque", "Comprova que você estava no voo"],
                ["Comprovante de reserva", "Dados da viagem contratada"],
                ["E-mails da companhia", "Registro das comunicações"],
                ["Notas fiscais de gastos", "Base para reembolso material"],
                ["Declaração de atraso/cancel.", "Documento oficial da cia."],
                ["Fotos do painel de partidas", "Situação no aeroporto"],
                ["Protocolo de atendimento", "Registro formal da reclamação"],
              ].map(([doc, uso], i) => (
                <div key={i} style={{ display: "flex", gap: "0.65rem", padding: "0.6rem 0.75rem", background: i % 2 === 0 ? "#f8fafc" : "#fff", borderRadius: 10, border: "1px solid #f1f5f9", alignItems: "flex-start" }}>
                  <span style={{ color: "#16a34a", flexShrink: 0, marginTop: "1px" }}><IconCheck /></span>
                  <div>
                    <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0f172a" }}>{doc}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.1rem" }}>{uso}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prazos */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(1.25rem, 4vw, 2rem)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
              <img src="/prazos.png" alt="Prazos e assistência" style={{ width: 32, height: 32, objectFit: "contain" }} />
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Prazos e assistência</h2>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.1rem", lineHeight: 1.6 }}>
              Agir dentro dos prazos preserva seu direito à reparação.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Prescrição — doméstico (CDC)", value: "5 anos" },
                { label: "Prescrição — internacional (Montreal)", value: "2 anos" },
                { label: "Assistência: comunicação", value: "1h de atraso" },
                { label: "Assistência: alimentação", value: "2h de atraso" },
                { label: "Assistência: hospedagem + transporte", value: "4h de atraso" },
                { label: "Compensação por overbooking", value: "250–500 DES" },
                { label: "Reembolso por cancelamento", value: "Imediato" },
              ].map(({ label, value }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", padding: "0.7rem 0", borderBottom: i < 6 ? "1px solid #f1f5f9" : "none", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.83rem", color: "#334155", lineHeight: 1.4, flex: "1 1 160px" }}>{label}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1c2b48", background: "#f0f4ff", borderRadius: 999, padding: "0.18rem 0.6rem", flexShrink: 0, whiteSpace: "nowrap" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Direitos e Parâmetros */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(1.25rem, 4vw, 2.5rem)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <img src="/Direitos do passageiro.png" alt="Direitos do passageiro" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <h2 style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Direitos do passageiro: parâmetros e bases legais
            </h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Situações comuns, direitos garantidos e faixas de indenização reconhecidas pelos tribunais.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { sit: "Atraso superior a 4h", direito: "Reacomodação, reembolso ou outra modal + assistência", base: "Res. ANAC 400/2016, art. 21; CDC, art. 14", ind: "R$ 3.000 – 15.000" },
              { sit: "Cancelamento de voo", direito: "Reembolso integral, reacomodação + assistência material", base: "Res. ANAC 400/2016, art. 21; CDC, arts. 14 e 20", ind: "R$ 5.000 – 20.000" },
              { sit: "Overbooking", direito: "Compensação imediata (250/500 DES) + reacomodação", base: "Res. ANAC 400/2016, arts. 22 e 24; CDC, art. 6º", ind: "R$ 5.000 – 25.000" },
              { sit: "Extravio de bagagem", direito: "Indenização pelos bens perdidos + danos morais", base: "Dom.: CDC, art. 14 · Int.: Conv. Montreal", ind: "R$ 3.000 – 15.000" },
              { sit: "Bagagem danificada", direito: "Reparo ou indenização do valor da mala e conteúdo", base: "Res. ANAC 400/2016; CDC, art. 14", ind: "R$ 2.000 – 10.000" },
              { sit: "Falta de assistência", direito: "Comunicação, alimentação e hospedagem por lei", base: "Res. ANAC 400/2016, arts. 26 e 27", ind: "Agrava danos morais" },
              { sit: "Downgrade involuntário", direito: "Reembolso da diferença + danos morais", base: "Res. ANAC 400/2016; CDC, arts. 14 e 20", ind: "R$ 3.000 – 10.000" },
              { sit: "Impedimento de embarque", direito: "Reacomodação + indenização moral e material", base: "CDC, art. 14; CC, art. 186", ind: "R$ 5.000 – 20.000" },
            ].map(({ sit, direito, base, ind }, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
                gap: "0.4rem 0.9rem",
                padding: "0.9rem 1rem",
                background: i % 2 === 0 ? "#f8fafc" : "#fff",
                borderRadius: 12,
                border: "1px solid #f1f5f9",
              }}>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.15rem" }}>Situação</div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#1c2b48" }}>{sit}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.15rem" }}>Direito</div>
                  <div style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.45 }}>{direito}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.15rem" }}>Base legal</div>
                  <div style={{ fontSize: "0.76rem", color: "#64748b", lineHeight: 1.45 }}>{base}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.15rem" }}>Estimativa</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: ind.startsWith("R$") ? "#1c2b48" : "#64748b" }}>{ind}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.73rem", color: "#94a3b8", marginTop: "0.9rem", fontStyle: "italic" }}>
            * Estimativas com base em jurisprudência. Valores variam conforme as circunstâncias do caso.
          </p>
        </div>

        {/* STF em Foco */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(1.25rem, 4vw, 2.5rem)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
            <img src="/Stf_foco.png" alt="STF em foco" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <h2 style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)", fontWeight: 800, color: "#0f172a", margin: 0 }}>STF em foco: Tema 1.417 e Tema 210</h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Dois temas de repercussão geral que moldam o contencioso aéreo atual.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1rem" }}>
            <div style={{ border: "2px solid #fbbf24", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: "#fffbea", padding: "1rem 1.25rem", borderBottom: "1px solid #fde68a" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#d97706", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>TEMA 1.417 · ARE 1.560.244</div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.2rem" }}>Regime aéreo x CDC no caso fortuito</h3>
                <p style={{ fontSize: "0.76rem", color: "#92400e", margin: 0 }}>Rel. Min. Dias Toffoli · Mérito pendente</p>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <p style={{ fontSize: "0.82rem", color: "#334155", lineHeight: 1.6, marginBottom: "1rem" }}>
                  Discute se as normas do transporte aéreo prevalecem sobre o CDC em casos de <strong>atraso/cancelamento por caso fortuito ou força maior</strong>.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                  {[
                    ["23/08/2025", "Repercussão geral reconhecida."],
                    ["26/11/2025", "Suspensão nacional dos processos."],
                    ["10/03/2026", "EDs acolhidos — restringe ao fortuito externo."],
                    ["Mérito", "Pendente de julgamento definitivo."],
                  ].map(([d, t], i) => (
                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fbbf24", marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: "0.8rem" }}>
                        <strong style={{ color: "#1e293b" }}>{d} </strong>
                        <span style={{ color: "#64748b" }}>{t}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#1c2b48", borderRadius: 10, padding: "0.8rem 1rem" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fde68a", marginBottom: "0.3rem" }}>O que a suspensão NÃO alcança</div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.55 }}>
                    Falhas internas (manutenção), extravio de bagagem, overbooking e casos sem força maior <strong style={{ color: "#fff" }}>seguem normalmente</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: "#f8fafc", padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#d97706", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>TEMA 210 · RE 636.331</div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.2rem" }}>Tratados internacionais x CDC na bagagem</h3>
                <p style={{ fontSize: "0.76rem", color: "#64748b", margin: 0 }}>Rel. Min. Gilmar Mendes · Julgado em 25/05/2017</p>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <p style={{ fontSize: "0.82rem", color: "#334155", lineHeight: 1.6, marginBottom: "1rem" }}>
                  <strong>Tese fixada:</strong> As Convenções de Varsóvia e Montreal prevalecem sobre o CDC para limitar a responsabilidade por danos materiais em voos internacionais.
                </p>
                <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "0.8rem 1rem", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c2410c", marginBottom: "0.3rem" }}>Alcance restrito</div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#7c2d12", lineHeight: 1.55 }}>
                    Aplica-se <strong>apenas</strong> a danos materiais em voos internacionais. Danos morais e voos domésticos seguem o CDC integralmente.
                  </p>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  <strong>Doméstico:</strong> reparação integral (CDC). <strong>Internacional:</strong> dano material limitado; dano moral sem teto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jurisprudência */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(1.25rem, 4vw, 2.5rem)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
            <img src="/entendimentos.png" alt="Entendimentos e jurisprudência" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <h2 style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)", fontWeight: 800, color: "#0f172a", margin: 0 }}>Entendimentos e jurisprudência</h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6 }}>Teses consolidadas dos tribunais superiores.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { title: "Responsabilidade objetiva das companhias aéreas", body: "As companhias respondem pelos danos independentemente de culpa, por falha na prestação do serviço e em razão do risco da atividade.", base: "CDC, art. 14; CC, art. 927, parágrafo único." },
              { title: "Dano moral: análise caso a caso", body: "O STJ divide-se: uma corrente exige prova de sofrimento concreto; outra reconhece dano presumido em cancelamento, atraso relevante e preterição.", base: "Divergência na 3ª e 4ª Turmas do STJ.", highlight: true },
              { title: "Overbooking: compensação garantida", body: "A recusa de embarque configura preterição, gerando compensação tarifada (250 DES doméstico; 500 DES internacional) mais eventuais danos morais.", base: "Res. ANAC 400/2016, arts. 22 e 24." },
              { title: "Extravio: regime diferente por tipo de voo", body: "Doméstico: reparação integral (CDC). Internacional: limite tarifado da Conv. de Montreal para dano material; dano moral sem limitação (Tema 210).", base: "STF, RE 636.331, Rel. Min. Gilmar Mendes, j. 25/05/2017." },
              { title: "Assistência material é obrigação legal", body: "A ausência de comunicação, alimentação e hospedagem conforme o tempo de espera configura falha autônoma e reforça o pedido de danos morais.", base: "Res. ANAC 400/2016, arts. 26 e 27; CDC, art. 14." },
              { title: "Fortuito externo x interno (Tema 1.417)", body: "Fortuito externo (meteorologia) pode afastar a responsabilidade. Fortuito interno (falha mecânica) não afasta. Essa distinção delimita a suspensão nacional.", base: "STF, Tema 1.417 (ARE 1.560.244), art. 178 da CF." },
            ].map(({ title, body, base, highlight }, i) => (
              <div key={i} style={{ display: "flex", gap: "0.8rem", padding: "0.9rem 1rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
                <span style={{ color: "var(--lex-gold)", flexShrink: 0, fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>✓</span>
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "#0f172a", display: "block", marginBottom: "0.25rem" }}>{title}</strong>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.81rem", color: "#475569", lineHeight: 1.6 }}>
                    {highlight && <span style={{ color: "#d97706", fontWeight: 700 }}>Atenção: </span>}{body}
                  </p>
                  <span style={{ fontSize: "0.73rem", color: "#94a3b8", fontStyle: "italic" }}>{base}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #0a0f19, #1c2b48)", borderRadius: 20, padding: "clamp(1.75rem, 5vw, 2.5rem)", textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--lex-gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.65rem" }}>Análise Gratuita</div>
          <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "0.65rem" }}>
            Passou por algum problema em seu voo?
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", maxWidth: 440, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            Nossa análise é gratuita, leva menos de 2 minutos e não exige nenhum compromisso.
          </p>
          <Link href="/diagnostico" className="btn btn--primary btn--lg" style={{ color: "var(--lex-black)" }}>
            Analisar meu caso
            <span className="btn__icon-circle" aria-hidden="true">
              <img src="/aviao.svg" width="18" height="18" alt="" />
            </span>
          </Link>
        </div>

        {/* Disclaimer */}
        <div style={{ textAlign: "center", padding: "0.75rem 0 1rem" }}>
          <p style={{ fontSize: "0.73rem", color: "#94a3b8", margin: "0 0 0.35rem", lineHeight: 1.6 }}>
            Fontes: STF — Tema 1.417 (ARE 1.560.244) e Tema 210 (RE 636.331); Res. ANAC 400/2016; Lei 8.078/1990 (CDC); Conv. de Montreal (Dec. 5.910/2006).
          </p>
          <p style={{ fontSize: "0.73rem", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
            Conteúdo informativo. Não substitui a análise jurídica do caso concreto.
          </p>
        </div>

      </div>
    </div>
  );
}

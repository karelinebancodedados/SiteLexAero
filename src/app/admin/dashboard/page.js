"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./lead-details.module.css";

const answerLabels = {
  sub: ["Ocorrência", { atraso: "Voo atrasado", cancelamento: "Voo cancelado", alteracao: "Alteração sem acordo", extravio_def: "Extravio definitivo", extravio_temp: "Extravio temporário", avaria: "Dano, violação ou furto" }],
  atrasoDur: ["Tempo de atraso", { lt4: "Menos de 4 horas", "4a8": "Entre 4 e 8 horas", "8a12": "Entre 8 e 12 horas", gt12: "Mais de 12 horas" }],
  tempDur: ["Tempo sem a bagagem", { ate24: "Até 24 horas", "24a72": "De 24 a 72 horas", "72a168": "De 3 a 7 dias", gt168: "Mais de 7 dias" }],
  reacomodado: ["Reacomodação rápida", { sim: "Sim", nao: "Não" }],
  ambito: ["Tipo de voo", { domestico: "Doméstico", internacional: "Internacional" }],
  assist: ["Assistência material", { sim: "Adequada", parcial: "Parcial", nao: "Não prestada" }],
  agravantes: ["Agravantes", { perda_compromisso: "Perda de compromisso importante", hipervulnerabilidade: "Passageiro em situação de vulnerabilidade", despesas: "Despesas extras comprovadas" }],
  causa: ["Motivo alegado pela companhia", { interno: "Falha da companhia", externo: "Força maior / fortuito externo", nao_informado: "Não sei / não foi informado" }],
  culpa: ["Companhia alegou culpa exclusiva do passageiro", { sim: "Sim", nao: "Não" }],
  docs: ["Documentos marcados", { bilhete: "Bilhete / e-ticket", embarque: "Cartão de embarque", protocolo: "Protocolo de reclamação", prints: "Prints / e-mails da companhia", rib: "RIB", fotos: "Fotos / vídeos", notas: "Notas fiscais", despesasdoc: "Comprovantes de despesas extras", compromisso: "Comprovante do compromisso perdido" }],
  term1: ["Política de privacidade e consentimento"],
  term2: ["Autorização de contato por WhatsApp ou telefone"],
  term3: ["Ciência de que o envio não garante indenização"],
};

const answerSections = [
  ["Ocorrência e voo", ["sub", "atrasoDur", "tempDur", "reacomodado", "ambito"]],
  ["Assistência e circunstâncias", ["assist", "causa", "culpa", "agravantes"]],
  ["Documentos", ["docs"]],
  ["Consentimentos", ["term1", "term2", "term3"]],
];

const demoLeads = [
  {
    id: "demo-atraso",
    name: "Marina Costa (teste)",
    phone: "(00) 90000-0001",
    problem_type: "atraso_cancel",
    created_at: "2026-11-05T14:30:00-03:00",
    completed: true,
    last_step_reached: 7,
    form_data: {
      tipo: "atraso_cancel", sub: "atraso", atrasoDur: "4a8", ambito: "domestico",
      assist: "parcial", causa: "interno", culpa: "nao", culpaRespondida: true,
      agravantes: ["perda_compromisso", "despesas"], docs: ["bilhete", "prints", "despesasdoc"],
      term1: true, term2: true, term3: true,
    },
  },
  {
    id: "demo-bagagem",
    name: "Rafael Lima (teste)",
    phone: "(00) 90000-0002",
    problem_type: "bagagem",
    created_at: "2026-11-05T13:15:00-03:00",
    completed: false,
    last_step_reached: 4,
    form_data: {
      tipo: "bagagem", sub: "extravio_temp", tempDur: "24a72", ambito: "internacional",
      assist: null, causa: null, agravantes: [], docs: [],
      term1: false, term2: false, term3: false,
    },
  },
];

function LeadAnswers({ lead }) {
  const answers = lead.form_data;
  if (!answers || typeof answers !== "object" || !Object.keys(answers).length) {
    return <p className={styles.empty}>Este lead não tem respostas detalhadas registradas.</p>;
  }

  const problem = answers.tipo || lead.problem_type;
  const sections = answers.source === "contato"
    ? [["Contato", ["email"]], answerSections[3]]
    : answerSections;
  const conditionalFields = {
    sub: problem === "atraso_cancel" || problem === "bagagem",
    atrasoDur: problem === "conexao" || (problem === "atraso_cancel" && answers.sub === "atraso"),
    tempDur: problem === "bagagem" && answers.sub === "extravio_temp",
    reacomodado: problem === "overbooking",
  };

  return (
    <div className={styles.sections}>
      {sections.map(([title, fields]) => (
        <section className={styles.section} key={title}>
          <h4>{title}</h4>
          <dl>
            {fields.filter(field => conditionalFields[field] ?? true).map(field => {
              const [label, options] = answerLabels[field] ?? ["E-mail"];
              const value = answers[field];
              let answer = <span className={styles.muted}>Sem resposta registrada</span>;
              if (Array.isArray(value)) {
                answer = value.length ? (
                  <ul className={styles.selections}>
                    {value.map(option => <li key={option}>{options?.[option] ?? option}</li>)}
                  </ul>
                ) : <span className={styles.muted}>Nenhuma opção marcada</span>;
              } else if (typeof value === "boolean") {
                answer = (
                  <span className={value ? styles.checked : styles.unchecked}>
                    {value ? "Marcado" : "Não marcado"}
                  </span>
                );
              } else if (field === "culpa" && value === "nao" && answers.culpaRespondida !== true) {
                answer = <span className={styles.muted}>Sem seleção confirmada (padrão: Não)</span>;
              } else if (typeof value === "string" && value) {
                answer = options?.[value] ?? value;
              }
              return <div key={field}><dt>{label}</dt><dd>{answer}</dd></div>;
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}

// ── Leads Tab ─────────────────────────────────────────────────
function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [demo, setDemo] = useState(false);
  const detailsDialog = useRef(null);

  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("demo") === "1") {
      setDemo(true);
      setLeads(demoLeads);
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      console.error("Supabase error:", err);
      setError(err.message);
    }
    setLeads(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter(l => {
    const matchFilter = filter === "all" || (filter === "completed" ? l.completed : !l.completed);
    const matchSearch = !search || 
      (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || "").includes(search);
    return matchFilter && matchSearch;
  });

  const exportCSV = () => {
    const headers = ["Nome", "WhatsApp", "Problema", "Etapa", "Status", "GCLID", "Data"];
    const rows = filtered.map(l => [
      l.name || "-", l.phone || "-", l.problem_type || "-",
      l.last_step_reached || 1, l.completed ? "Finalizado" : "Incompleto",
      l.gclid || "-", new Date(l.created_at).toLocaleString("pt-BR")
    ]);
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads_lexaero.csv"; a.click();
  };

  const problemLabel = (p) => ({
    atraso_cancel: "Atraso/Cancel.", overbooking: "Overbooking",
    bagagem: "Bagagem", conexao: "Conexão"
  }[p] || p || "-");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>{demo ? "Leads de demonstração" : "Leads capturados"}</h2>
          <p style={{ color: "#666", fontSize: "0.8rem", margin: 0 }}>{leads.length} total • {leads.filter(l => l.completed).length} finalizados</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className={styles.detailsButton} onClick={fetchLeads}>Atualizar lista</button>
          <button onClick={exportCSV} style={{
          background: "#FCBD26", color: "#111", fontWeight: 700, padding: "0.6rem 1.2rem",
          borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.85rem"
          }}>⬇ Exportar CSV</button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[["all","Todos"], ["completed","✅ Finalizou"], ["abandoned","⏳ Incompletos"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: "0.4rem 1rem", borderRadius: "99px", border: "1px solid",
            borderColor: filter === v ? "#FCBD26" : "#2E2E2E",
            background: filter === v ? "rgba(252,189,38,0.15)" : "transparent",
            color: filter === v ? "#FCBD26" : "#aaa", fontSize: "0.8rem", cursor: "pointer"
          }}>{l}</button>
        ))}
        <input
          type="text" placeholder="Buscar nome ou WhatsApp..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            marginLeft: "auto", padding: "0.4rem 0.9rem", borderRadius: "8px",
            border: "1px solid #2E2E2E", background: "#0A0A0A", color: "#fff",
            fontSize: "0.8rem", outline: "none", minWidth: "200px"
          }}
        />
      </div>

      {/* Tabela */}
      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #2E2E2E" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#111", borderBottom: "1px solid #2E2E2E" }}>
              {["Nome","WhatsApp","Problema","Detalhes","Etapa","Status","GCLID","Data"].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#aaa", fontWeight: 600, fontSize: "0.75rem", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Carregando...</td></tr>
            ) : error ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
                ⚠️ Erro ao carregar leads: <strong>{error}</strong>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Nenhum lead encontrado</td></tr>
            ) : filtered.map((lead, i) => (
              <tr key={lead.id} style={{ borderBottom: "1px solid #1a1a1a", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#fff", fontWeight: 500 }}>{lead.name || <span style={{color:"#aaa"}}>Sem nome informado</span>}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ccc" }}>{lead.phone || <span style={{color:"#555"}}>—</span>}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ccc" }}>{problemLabel(lead.problem_type)}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <button
                    type="button"
                    className={styles.detailsButton}
                    aria-haspopup="dialog"
                    aria-label={`Ver detalhes de ${lead.name || lead.phone || "lead sem identificação"}`}
                    onClick={() => {
                      setSelectedLead(lead);
                      detailsDialog.current.showModal();
                    }}
                  >
                    Ver detalhes
                  </button>
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#FCBD26", fontWeight: 700, textAlign: "center" }}>{lead.form_data?.source === "contato" ? "Contato" : `${lead.last_step_reached || 1}/7`}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{
                    padding: "0.2rem 0.7rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600,
                    background: lead.completed ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                    color: lead.completed ? "#4ade80" : "#fb923c"
                  }}>
                    {lead.completed ? "✅ Finalizou" : "⏳ Incompleto"}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#555", fontSize: "0.75rem", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.gclid || "—"}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#666", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                  {new Date(lead.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog
        ref={detailsDialog}
        className={styles.dialog}
        aria-labelledby="lead-details-title"
        onClose={() => setSelectedLead(null)}
      >
        <header className={styles.dialogHeader}>
          <h3 id="lead-details-title">Detalhes do lead</h3>
          <form method="dialog">
            <button type="submit" className={styles.detailsButton}>Fechar</button>
          </form>
        </header>
        {selectedLead && (
          <div className={styles.body}>
            <dl className={styles.contact}>
              <div><dt>Nome</dt><dd>{selectedLead.name || "Não informado"}</dd></div>
              <div><dt>WhatsApp</dt><dd>{selectedLead.phone || "Não informado"}</dd></div>
              <div><dt>Problema</dt><dd>{problemLabel(selectedLead.problem_type || selectedLead.form_data?.tipo)}</dd></div>
              <div>
                <dt>{selectedLead.form_data?.source === "contato" ? "Formulário de contato" : "Diagnóstico"}</dt>
                <dd>
                  {selectedLead.completed ? "Finalizado" : "Incompleto"}
                  {selectedLead.form_data?.source !== "contato" && ` · Etapa ${selectedLead.last_step_reached || 1}/7`}
                </dd>
              </div>
            </dl>
            <LeadAnswers lead={selectedLead} />
          </div>
        )}
      </dialog>
    </div>
  );
}

// ── Blog Tab ───────────────────────────────────────────────────
function BlogTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, {} = new, post = editing
  const [form, setForm] = useState({ title: "", slug: "", category: "", summary: "", content: "", coverImage: "", readTime: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const startNew = () => {
    setForm({ title: "", slug: "", category: "", summary: "", content: "", coverImage: "", readTime: "5 min de leitura" });
    setImageFile(null);
    setEditing({});
    setMsg("");
  };

  const startEdit = (post) => {
    setForm({ title: post.title, slug: post.slug, category: post.category, summary: post.summary, content: post.content, coverImage: post.cover_image || "", readTime: post.read_time || "" });
    setImageFile(null);
    setEditing(post);
    setMsg("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    
    let uploadedImageUrl = form.coverImage;
    
    if (imageFile) {
      setMsg("⏳ Enviando imagem...");
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        // Não bloqueia — salva o post sem imagem e avisa
        setMsg("⚠️ Imagem não enviada (bucket não configurado). Salvando post sem imagem...");
        await new Promise(r => setTimeout(r, 1500));
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('blog_images')
          .getPublicUrl(filePath);
        uploadedImageUrl = publicUrl;
      }
    }
    
    setMsg("⏳ Salvando conteúdo...");
    const payload = { title: form.title, slug: form.slug, category: form.category, summary: form.summary, content: form.content, cover_image: uploadedImageUrl, read_time: form.readTime, updated_at: new Date().toISOString() };

    let error;
    if (editing && editing.id) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert({ ...payload, created_at: new Date().toISOString() }));
    }

    setSaving(false);
    if (error) { setMsg("❌ Erro: " + error.message); }
    else { setMsg("✅ Salvo com sucesso!"); fetchPosts(); setTimeout(() => { setEditing(null); setMsg(""); }, 1200); }
  };

  const [postToDelete, setPostToDelete] = useState(null);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    setLoading(true);
    const { data, error } = await supabase.from("blog_posts").delete().eq("id", postToDelete.id).select();
    
    if (error) {
      alert("Erro do Supabase ao excluir: " + error.message);
    } else if (!data || data.length === 0) {
      alert("O Supabase retornou sucesso, mas NENHUMA linha foi excluída (Verifique a política RLS).");
    }
    
    setPostToDelete(null);
    fetchPosts();
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem", background: "#0A0A0A",
    border: "1px solid #2E2E2E", borderRadius: "8px", color: "#fff",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box", marginBottom: "0.75rem"
  };

  if (editing !== null) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={() => { setEditing(null); setMsg(""); }} style={{ color: "#FCBD26", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>← Voltar</button>
          <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
            {editing.id ? "Editar post" : "Novo post"}
          </h2>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>TÍTULO</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Título do post" />
            </div>
            <div>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>SLUG (URL)</label>
              <input style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required placeholder="ex: voo-atrasado-direitos" />
            </div>
            <div>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>CATEGORIA</label>
              <input style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="ex: Direitos do Passageiro" />
            </div>
            <div>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>IMAGEM DE CAPA</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "0.75rem" }}>
                {(form.coverImage || imageFile) && (
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : form.coverImage} 
                    alt="Capa" 
                    style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px", border: "1px solid #333" }} 
                  />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }} 
                  style={{ ...inputStyle, marginBottom: 0, flex: 1, padding: "0.5rem" }} 
                />
              </div>
            </div>
            <div>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>TEMPO DE LEITURA</label>
              <input style={inputStyle} value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} placeholder="5 min de leitura" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>RESUMO</label>
              <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="Resumo exibido no card do blog" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>CONTEÚDO</label>
              <textarea 
                style={{ ...inputStyle, height: "400px", resize: "vertical", fontFamily: "sans-serif", fontSize: "0.95rem", lineHeight: "1.6" }} 
                value={form.content} 
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))} 
                placeholder="Escreva seu texto aqui..." 
              />
            </div>
          </div>
          {msg && <p style={{ color: msg.startsWith("✅") ? "#4ade80" : "#ef4444", marginBottom: "1rem" }}>{msg}</p>}
          <button type="submit" disabled={saving} style={{
            background: saving ? "#7a6010" : "#FCBD26", color: "#111", fontWeight: 700,
            padding: "0.85rem 2rem", borderRadius: "8px", border: "none", cursor: saving ? "not-allowed" : "pointer"
          }}>
            {saving ? "Salvando..." : "💾 Salvar post"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Posts do blog</h2>
          <p style={{ color: "#666", fontSize: "0.8rem", margin: 0 }}>{posts.length} artigos publicados</p>
        </div>
        <button onClick={startNew} style={{
          background: "#FCBD26", color: "#111", fontWeight: 700, padding: "0.6rem 1.2rem",
          borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.85rem"
        }}>+ Novo post</button>
      </div>

      {loading ? (
        <p style={{ color: "#666", textAlign: "center", padding: "2rem" }}>Carregando posts...</p>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
          <p>Nenhum post no banco. Clique em "+ Novo post" para criar.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {posts.map(post => (
            <div key={post.id} style={{
              background: "#111", border: "1px solid #2E2E2E", borderRadius: "12px",
              padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap"
            }}>
              {post.cover_image && (
                <img src={post.cover_image} alt="" style={{ width: 60, height: 45, objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <p style={{ color: "#FCBD26", fontSize: "0.7rem", fontWeight: 700, margin: 0, letterSpacing: "0.1em" }}>{post.category}</p>
                <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", margin: "0.1rem 0" }}>{post.title}</p>
                <p style={{ color: "#555", fontSize: "0.75rem", margin: 0 }}>/{post.slug} • {new Date(post.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => startEdit(post)} style={{ padding: "0.45rem 0.9rem", borderRadius: "6px", border: "1px solid #2E2E2E", background: "transparent", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}>✏️ Editar</button>
                <button onClick={() => handleDeleteClick(post)} style={{ padding: "0.45rem 0.9rem", borderRadius: "6px", border: "1px solid #2E2E2E", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" }}>🗑️ Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Exclusão customizado */}
      {postToDelete && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#111", border: "1px solid #2E2E2E", padding: "2rem", borderRadius: "12px", width: "90%", maxWidth: "400px", textAlign: "center" }}>
            <h3 style={{ color: "#fff", marginTop: 0 }}>Excluir post?</h3>
            <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Tem certeza que deseja apagar "{postToDelete.title}"? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={() => setPostToDelete(null)} style={{ padding: "0.6rem 1.2rem", background: "transparent", border: "1px solid #555", color: "#fff", borderRadius: "6px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={confirmDelete} style={{ padding: "0.6rem 1.2rem", background: "#ef4444", border: "none", color: "#fff", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Dashboard Principal ────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("leads");
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ok = sessionStorage.getItem("lexaero_admin");
      if (!ok) router.replace("/admin");
      else setAuthed(true);
    }
  }, [router]);

  const logout = () => { sessionStorage.removeItem("lexaero_admin"); router.replace("/admin"); };

  if (!authed) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", fontFamily: "'Poppins', sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#111", borderRight: "1px solid #2E2E2E", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: 36, height: 36, background: "#FCBD26", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>⚖️</div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>LexAero</p>
          <p style={{ color: "#555", fontSize: "0.7rem", margin: 0 }}>Painel Admin</p>
        </div>
        <nav style={{ flex: 1 }}>
          {[["leads","📋","Leads"],["blog","📝","Blog"]].map(([v, icon, label]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              display: "flex", alignItems: "center", gap: "0.6rem", width: "100%",
              padding: "0.65rem 0.75rem", borderRadius: "8px", border: "none",
              background: tab === v ? "rgba(252,189,38,0.1)" : "transparent",
              color: tab === v ? "#FCBD26" : "#aaa", fontWeight: tab === v ? 600 : 400,
              fontSize: "0.85rem", cursor: "pointer", textAlign: "left", marginBottom: "0.25rem",
              borderLeft: tab === v ? "2px solid #FCBD26" : "2px solid transparent"
            }}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <button onClick={logout} style={{ color: "#555", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", textAlign: "left", padding: "0.5rem 0.75rem" }}>
          🚪 Sair
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {tab === "leads" && <LeadsTab />}
        {tab === "blog" && <BlogTab />}
      </div>
    </div>
  );
}

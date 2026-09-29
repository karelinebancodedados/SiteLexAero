"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// ── Leads Tab ─────────────────────────────────────────────────
function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
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
      l.last_step_reached || 1, l.completed ? "Finalizado" : "Abandonou",
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
          <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Leads capturados</h2>
          <p style={{ color: "#666", fontSize: "0.8rem", margin: 0 }}>{leads.length} total • {leads.filter(l => l.completed).length} finalizados</p>
        </div>
        <button onClick={exportCSV} style={{
          background: "#FCBD26", color: "#111", fontWeight: 700, padding: "0.6rem 1.2rem",
          borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.85rem"
        }}>⬇ Exportar CSV</button>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[["all","Todos"], ["completed","✅ Finalizou"], ["abandoned","⏳ Abandonou"]].map(([v, l]) => (
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
              {["Nome","WhatsApp","Problema","Etapa","Status","GCLID","Data"].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#aaa", fontWeight: 600, fontSize: "0.75rem", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Carregando...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
                ⚠️ Erro ao carregar leads: <strong>{error}</strong>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Nenhum lead encontrado</td></tr>
            ) : filtered.map((lead, i) => (
              <tr key={lead.id} style={{ borderBottom: "1px solid #1a1a1a", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#fff", fontWeight: 500 }}>{lead.name || <span style={{color:"#555"}}>—</span>}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ccc" }}>{lead.phone || <span style={{color:"#555"}}>—</span>}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ccc" }}>{problemLabel(lead.problem_type)}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#FCBD26", fontWeight: 700, textAlign: "center" }}>{lead.last_step_reached || 1}/7</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{
                    padding: "0.2rem 0.7rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600,
                    background: lead.completed ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                    color: lead.completed ? "#4ade80" : "#fb923c"
                  }}>
                    {lead.completed ? "✅ Finalizou" : "⏳ Abandonou"}
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

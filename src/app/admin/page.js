"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "lexaero2026";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("lexaero_admin", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Senha incorreta. Tente novamente.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        background: "#171717", border: "1px solid #2E2E2E", borderRadius: "16px",
        padding: "2.5rem 2rem", width: "100%", maxWidth: "400px"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <img src="/logo_lexaero.png" alt="LexAero" style={{ height: 64, width: "auto", objectFit: "contain" }} />
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>LexAero Admin</h1>
          <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.25rem" }}>Área restrita</p>
        </div>

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", color: "#aaa", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
            SENHA
          </label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            placeholder="Digite a senha de acesso"
            required
            style={{
              width: "100%", padding: "0.85rem 1rem", background: "#0A0A0A",
              border: `1px solid ${error ? "#ef4444" : "#2E2E2E"}`, borderRadius: "8px",
              color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
            }}
          />
          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", marginTop: "1.25rem", padding: "0.9rem",
              background: loading ? "#7a6010" : "#FCBD26", color: "#111",
              fontWeight: 700, fontSize: "1rem", border: "none", borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s"
            }}
          >
            {loading ? "Verificando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    </div>
  );
}

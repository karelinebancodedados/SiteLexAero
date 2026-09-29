"use client";
import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  "Voo Atrasado",
  "Voo Cancelado",
  "Overbooking",
  "Bagagem Extraviada / Danificada",
  "Conexão Perdida",
  "Outro",
];

const formatPhone = (value) => {
  if (!value) return "";
  const phone = value.replace(/\D/g, "");
  if (phone.length <= 2) return `(${phone}`;
  if (phone.length <= 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
};

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    problem: "",
    term1: false,
    term2: false,
    term3: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef(null);

  // Load partial lead from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lexaero_partial_lead");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save partial lead when field loses focus (abandoned form tracking)
  const savePartialLead = () => {
    if (formData.name || formData.phone || formData.email) {
      localStorage.setItem("lexaero_partial_lead", JSON.stringify(formData));
      console.log("Lead parcial salvo (preparado para integração futura com Sheets/Drive):", formData);
      // Aqui entrará a integração futura com a planilha/Google Drive
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneChange = (e) => {
    setFormData({ ...formData, phone: formatPhone(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.problem || !formData.term1 || !formData.term2 || !formData.term3) return;
    
    setSubmitting(true);
    
    const msg = `Olá, gostaria de falar sobre um problema com meu voo.\n\n*Dados do Lead:*\n- Nome: ${formData.name}\n- WhatsApp: ${formData.phone}\n- E-mail: ${formData.email || "Não informado"}\n- Problema: ${formData.problem}`;
    
    setTimeout(() => {
      setSubmitting(false);
      window.open(
        `https://wa.me/553183259594?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    }, 600);
  };

  return (
    <form className="lead-capture-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nome completo *</label>
        <input
          type="text"
          id="name"
          placeholder="Seu nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onBlur={savePartialLead}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">WhatsApp *</label>
          <input
            type="tel"
            id="phone"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={handlePhoneChange}
            onBlur={savePartialLead}
            maxLength={15}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail (Opcional)</label>
          <input
            type="email"
            id="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={savePartialLead}
          />
        </div>
      </div>

      <div className="form-group">
        <label>O que aconteceu? *</label>
        <div className="custom-select" ref={selectRef} style={{ position: "relative" }}>
          <div 
            className="custom-select-trigger" 
            style={{ 
              width: "100%", padding: "12px 16px", background: "var(--lex-dark-gray)", 
              border: `1px solid ${isSelectOpen ? "var(--lex-gold)" : "var(--lex-border-dark)"}`,
              borderRadius: "var(--radius-md)", color: formData.problem ? "var(--lex-white)" : "var(--lex-text-dark-muted)",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: isSelectOpen ? "0 0 0 2px rgba(252, 189, 38, 0.2)" : "none",
              transition: "all 0.3s ease"
            }}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            {formData.problem || "Selecione uma opção"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isSelectOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          {isSelectOpen && (
            <ul 
              style={{ 
                position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px",
                background: "var(--lex-dark-gray)", border: "1px solid var(--lex-border-dark)",
                borderRadius: "var(--radius-md)", overflow: "hidden", zIndex: 50, listStyle: "none", padding: 0,
                boxShadow: "var(--shadow-md)"
              }}
            >
              {OPTIONS.map((opt, idx) => (
                <li 
                  key={opt}
                  onClick={() => { setFormData({ ...formData, problem: opt }); setIsSelectOpen(false); }}
                  style={{ 
                    padding: "10px 16px", cursor: "pointer", color: "var(--lex-white)", 
                    borderBottom: idx === OPTIONS.length - 1 ? "none" : "1px solid var(--lex-border-dark)",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "var(--lex-graphite)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        <label className="checkbox-label" style={{ marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={formData.term1}
            onChange={(e) => setFormData({ ...formData, term1: e.target.checked })}
            required
          />
          <span className="checkbox-custom"></span>
          <span style={{ fontSize: "0.85rem", color: "var(--lex-text-dark-muted)", lineHeight: 1.4 }}>
            Li e concordo com a Política de Privacidade e o Termo de Consentimento.
          </span>
        </label>
        
        <label className="checkbox-label" style={{ marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={formData.term2}
            onChange={(e) => setFormData({ ...formData, term2: e.target.checked })}
            required
          />
          <span className="checkbox-custom"></span>
          <span style={{ fontSize: "0.85rem", color: "var(--lex-text-dark-muted)", lineHeight: 1.4 }}>
            Autorizo a LexAero a entrar em contato comigo pelo WhatsApp e/ou telefone informado neste formulário para tratar da solicitação enviada.
          </span>
        </label>

        <label className="checkbox-label" style={{ marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={formData.term3}
            onChange={(e) => setFormData({ ...formData, term3: e.target.checked })}
            required
          />
          <span className="checkbox-custom"></span>
          <span style={{ fontSize: "0.85rem", color: "var(--lex-text-dark-muted)", lineHeight: 1.4 }}>
            Estou ciente de que o envio das informações não garante a existência de direito à indenização ou qualquer resultado jurídico.
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--lg"
        style={{ alignSelf: "center", padding: "12px 32px", marginTop: "1rem" }}
        disabled={submitting || !formData.problem}
      >
        {submitting ? "Processando..." : "Falar com especialista agora"}
        <span className="btn__icon-circle" aria-hidden="true" style={{ marginLeft: "12px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1281 1920" preserveAspectRatio="xMidYMid meet" version="1.0" style={{ width: '20px', height: '20px' }}>
            <defs><clipPath id="aviao-form"><path d="M 100 386 L 1182 386 L 1182 1465.921875 L 100 1465.921875 Z M 100 386 " clipRule="nonzero" /></clipPath></defs>
            <g clipPath="url(#aviao-form)"><path fill="currentColor" d="M 1170.144531 397.558594 C 1129.84375 357.300781 969.78125 435.792969 916.152344 489.46875 L 777.460938 628.160156 L 174.851562 521.820312 C 170.257812 520.992188 165.523438 522.460938 162.214844 525.769531 L 104.957031 583.078125 C 101.691406 586.339844 100.175781 590.980469 100.910156 595.53125 C 101.648438 600.082031 104.496094 603.988281 108.632812 606.054688 L 580.222656 841.847656 L 380.5 1097.40625 L 203.484375 1066.15625 C 198.84375 1065.421875 194.15625 1066.796875 190.847656 1070.109375 L 147.878906 1113.074219 C 144.707031 1116.246094 143.144531 1120.796875 143.789062 1125.253906 C 144.523438 1129.804688 147.1875 1133.710938 151.1875 1135.777344 L 296.957031 1214.269531 L 259.730469 1288.667969 C 256.976562 1294.183594 258.078125 1300.847656 262.445312 1305.167969 C 265.246094 1307.925781 268.878906 1309.304688 272.597656 1309.304688 C 274.757812 1309.304688 276.964844 1308.84375 278.988281 1307.832031 L 353.386719 1270.609375 L 431.878906 1416.378906 C 434.039062 1420.328125 437.945312 1423.085938 442.402344 1423.824219 C 443.09375 1423.914062 443.734375 1423.914062 444.472656 1423.914062 C 448.238281 1423.914062 451.871094 1422.488281 454.628906 1419.777344 L 497.59375 1376.765625 C 500.902344 1373.457031 502.375 1368.769531 501.59375 1364.21875 L 470.34375 1187.109375 L 725.898438 987.386719 L 961.695312 1458.976562 C 963.761719 1463.113281 967.714844 1465.964844 972.21875 1466.699219 C 973 1466.835938 973.734375 1466.882812 974.605469 1466.882812 C 978.375 1466.882812 981.914062 1465.410156 984.671875 1462.699219 L 1042.023438 1405.394531 C 1045.238281 1402.085938 1046.800781 1397.398438 1045.976562 1392.757812 L 939.636719 790.148438 L 1078.328125 651.457031 C 1132.003906 597.828125 1210.449219 437.859375 1170.144531 397.558594 Z M 1170.144531 397.558594 " fillOpacity="1" fillRule="nonzero" /></g>
          </svg>
        </span>
      </button>
    </form>
  );
}

import Link from "next/link";
import Image from "next/image";
const SOCIAL = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
};

const FOOTER_LINKS = {
  "Direito do Passageiro": [
    { label: "Voo atrasado", href: "/voo-atrasado" },
    { label: "Voo cancelado", href: "/voo-cancelado" },
    { label: "Perda de conexão", href: "/conexao-perdida" },
    { label: "Overbooking", href: "/overbooking" },
    { label: "Bagagem", href: "/bagagem" },
    { label: "Alteração de voo", href: "/outros-problemas" },
    { label: "Outros problemas com voo", href: "/outros-problemas" },
  ],
  "Institucional": [
    { label: "Kareline Staut", href: "/kareline-staut" },
    { label: "Sobre a LexAero", href: "/kareline-staut" },
    { label: "Como funciona", href: "/#how-heading" },
    { label: "Radar Jurídico", href: "/radar-juridico" },
    { label: "Conteúdos", href: "/blog" },
    { label: "Perguntas frequentes", href: "/#faq-heading" },
  ],
  "Informação Legal": [
    { label: "Política de Privacidade", href: "/lgpd" },
    { label: "Termos de Uso", href: "/lgpd" },
    { label: "Aviso Legal", href: "/lgpd" },
  ],
};

const CONTACT_ITEMS = [
  {
    icon: (
      <img src="/icon_tel.png" alt="Telefone" style={{ width: 22, height: 22, objectFit: "contain" }} />
    ),
    label: "Atendimento digital via WhatsApp",
    value: "(31) 98325-9594",
    href: "https://wa.me/5531983259594",
  },
  {
    icon: (
      <img src="/icon_Mail.png" alt="E-mail" style={{ width: 22, height: 22, objectFit: "contain" }} />
    ),
    label: "E-mail",
    value: "contato@lexaero.com.br",
    href: "mailto:contato@lexaero.com.br",
  },
  {
    icon: (
      <img src="/icon_hour.png" alt="Horário" style={{ width: 22, height: 22, objectFit: "contain" }} />
    ),
    label: "Segunda a sexta-feira",
    value: "8h às 18h (atendimento digital)",
    href: null,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" style={{ borderTop: "1px solid var(--lex-border-dark)" }}>
      <div className="container">
        <div className="footer__grid">

          {/* Col 1: Brand & Desc */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <Image
                src="/logo_lexaero.png"
                alt="LexAero — Boutique Jurídica em Direito do Passageiro Aéreo"
                width={180}
                height={48}
                style={{ height: "48px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p style={{ color: "var(--lex-text-dark-muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
              Boutique jurídica especializada em Direito do Passageiro Aéreo. Atuamos com técnica, estratégia e atenção aos detalhes para defender os direitos dos passageiros no transporte aéreo.
            </p>
            {/* Redes Sociais */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <a
                href="https://www.instagram.com/lex_aero/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram LexAero"
                style={{ color: "var(--lex-text-dark-muted)", transition: "color 0.2s", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1px solid var(--lex-border-dark)" }}
                onMouseOver={e => e.currentTarget.style.color = "var(--lex-gold)"}
                onMouseOut={e => e.currentTarget.style.color = "var(--lex-text-dark-muted)"}
              >
                {SOCIAL.instagram}
              </a>
              <a
                href="https://www.google.com/goto?url=CAESYQHrOzAVaDu3KZiSOXnhTxbH_fprA9hUunkASYBl-S4usX0PT8qHSyJcV3zsjrVhf9jvw5MxU_FTjgXwfgmMnEyOpiGQywGUzJvz6mKOw0HnWFYGRHQ3qwhWj1HJqq91Rfs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn LexAero"
                style={{ color: "var(--lex-text-dark-muted)", transition: "color 0.2s", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1px solid var(--lex-border-dark)" }}
                onMouseOver={e => e.currentTarget.style.color = "var(--lex-gold)"}
                onMouseOut={e => e.currentTarget.style.color = "var(--lex-text-dark-muted)"}
              >
                {SOCIAL.linkedin}
              </a>
              <a
                href="https://wa.me/553183259594"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp LexAero"
                style={{ color: "var(--lex-text-dark-muted)", transition: "color 0.2s", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1px solid var(--lex-border-dark)" }}
                onMouseOver={e => e.currentTarget.style.color = "#25D366"}
                onMouseOut={e => e.currentTarget.style.color = "var(--lex-text-dark-muted)"}
              >
                {SOCIAL.whatsapp}
              </a>
            </div>
          </div>

          {/* Cols 2, 3, 4: Link groups */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p className="footer__col-title" style={{ color: "var(--lex-white)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{section}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="footer__link"
                      style={{ color: "var(--lex-text-dark-muted)", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <span style={{ color: "var(--lex-gold)", fontSize: "0.6rem" }}>›</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 5: Fale Conosco */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ color: "var(--lex-white)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Fale Conosco</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {CONTACT_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--lex-gold)", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                  <div>
                    <div style={{ color: "var(--lex-text-dark-muted)", fontSize: "0.75rem", marginBottom: "2px" }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ color: "var(--lex-text-dark-muted)", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none" }}
                        onMouseOver={e => e.currentTarget.style.color = "var(--lex-gold)"}
                        onMouseOut={e => e.currentTarget.style.color = "var(--lex-text-dark-muted)"}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ color: "var(--lex-text-dark-muted)", fontSize: "0.85rem" }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--lex-border-dark)", margin: "2rem 0" }}></div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p style={{ margin: 0, color: "var(--lex-text-dark-muted)", fontSize: "0.85rem" }}>
            © {year} LexAero. Todos os direitos reservados.
          </p>
          <p style={{ margin: 0, color: "var(--lex-text-dark-muted)", fontSize: "0.85rem" }}>
            Kareline Staut — Advogada | OAB/RO 10.067
          </p>
        </div>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--lex-text-dark-muted)", fontSize: "0.75rem", lineHeight: 1.6, opacity: 0.65 }}>
            As informações deste site são de natureza geral e não constituem parecer jurídico, consultoria ou promessa de resultado. Ferramenta orientativa e educativa — não constitui promessa de indenização. Este site não é afiliado às companhias aéreas citadas.
          </p>
        </div>
      </div>
    </footer>
  );
}

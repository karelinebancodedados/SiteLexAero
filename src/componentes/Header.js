"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
const NAV_LINKS = [
  { label: "Início", href: "/" },
  { 
    label: "Problemas com Voo", 
    dropdown: [
      { label: "Voo Atrasado", href: "/voo-atrasado" },
      { label: "Voo Cancelado", href: "/voo-cancelado" },
      { label: "Overbooking", href: "/overbooking" },
      { label: "Extravio de Bagagem", href: "/bagagem" },
      { label: "Conexão Perdida", href: "/conexao-perdida" },
    ]
  },
  { label: "Como Funciona", href: "/#how-heading" },
  { label: "Custas", href: "/#custas-heading" },
  { label: "A especialista", href: "/kareline-staut" },
  { label: "Dúvidas", href: "/#faq-heading" },
  { label: "Radar jurídico", href: "/radar-juridico" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("pt");
  const [dropdownPos, setDropdownPos] = useState({ top: 72, right: 16 });
  const langBtnRef = useRef(null);
  const problemsRef = useRef(null);

  const openDropdown = (e) => {
    e.stopPropagation();
    if (langBtnRef.current) {
      const rect = langBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setLangDropdownOpen((v) => !v);
  };

  const changeLanguage = (langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
    setCurrentLang(langCode);
    setLangDropdownOpen(false);
  };

  // Fechar dropdown de idioma ao clicar fora
  useEffect(() => {
    if (!langDropdownOpen) return;
    const close = () => setLangDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [langDropdownOpen]);

  // Fechar menu de problemas ao clicar fora
  useEffect(() => {
    const close = (e) => {
      const dropdown = problemsRef.current;
      if (dropdown?.open && !dropdown.contains(e.target)) {
        dropdown.open = false;
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container header__inner">
          {/* Logo */}
          <Link href="/" className="header__logo" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo_lexaero_dark.png"
              alt="LexAero Logo"
              width={200}
              height={54}
              className="logo-desktop"
              style={{ height: "54px", width: "auto", objectFit: "contain", transform: "translateY(2px)" }}
              priority
            />
            <Image
              src="/logo_lexaero.png"
              alt="LexAero Logo Branca"
              width={180}
              height={48}
              className="logo-mobile"
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="header__nav" aria-label="Navegação principal">
            {NAV_LINKS.map(l => (
              l.dropdown ? (
                <details
                  key={l.label}
                  ref={problemsRef}
                  className="header__dropdown-container"
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && e.currentTarget.open) {
                      e.currentTarget.open = false;
                      e.currentTarget.querySelector("summary").focus();
                    }
                  }}
                >
                  <summary className="header__link header__dropdown-trigger">
                    {l.label}
                    <svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </summary>
                  <div className="header__dropdown-menu">
                    {l.dropdown.map(d => (
                      <Link key={d.href} href={d.href} className="header__dropdown-item" onClick={() => { problemsRef.current.open = false; }}>
                        {d.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={l.href || l.label} href={l.href} className="header__link">
                  {l.label}
                </Link>
              )
            ))}
          </nav>

          {/* Actions: Idioma + Hambúrguer */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "auto" }}>

            {/* Language Button */}
            <button
              ref={langBtnRef}
              onClick={openDropdown}
              aria-label="Selecionar idioma"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            >
              <Image
                src={currentLang === "pt" ? "/bandeira_brasil.webp" : "/eua.svg"}
                alt={currentLang === "pt" ? "Brasil" : "EUA"}
                width={24}
                height={16}
                style={{ width: "24px", height: "16px", objectFit: "cover", borderRadius: "2px", display: "block" }}
              />
              <svg
                width="10" height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: langDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Mobile Toggle */}
            <button
              className={`header__mobile-toggle ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
            >
              <span className="header__bar"></span>
              <span className="header__bar"></span>
              <span className="header__bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown — renderizado fora do header via position:fixed para nunca ser cortado */}
      {langDropdownOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: dropdownPos.top,
            right: dropdownPos.right,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            zIndex: 9999,
            minWidth: "90px",
          }}
        >
          {currentLang !== "pt" && (
            <button
              onClick={() => changeLanguage("pt")}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 12px", background: "transparent", border: "none", cursor: "pointer", width: "100%", borderRadius: "6px" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Image src="/bandeira_brasil.webp" alt="Brasil" width={22} height={15} style={{ width: "22px", height: "15px", objectFit: "cover", borderRadius: "2px" }} />
              <span style={{ fontSize: "0.85rem", color: "#111", fontWeight: 500 }}>PT</span>
            </button>
          )}
          {currentLang !== "en" && (
            <button
              onClick={() => changeLanguage("en")}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 12px", background: "transparent", border: "none", cursor: "pointer", width: "100%", borderRadius: "6px" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Image src="/eua.svg" alt="EUA" width={22} height={15} style={{ width: "22px", height: "15px", objectFit: "cover", borderRadius: "2px" }} />
              <span style={{ fontSize: "0.85rem", color: "#111", fontWeight: 500 }}>EN</span>
            </button>
          )}
        </div>
      )}

      {/* Menu Mobile */}
      <nav className={`header__mobile-nav ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        {NAV_LINKS.map((l, i) => (
          l.dropdown ? (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <span className="header__mobile-link" style={{ opacity: 0.5, pointerEvents: 'none' }}>{l.label}</span>
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: '1rem', marginTop: '0.5rem', gap: '0.5rem' }}>
                {l.dropdown.map(d => (
                  <Link
                    key={d.href}
                    href={d.href}
                    className="header__mobile-link"
                    style={{ fontSize: '1rem', padding: '0.5rem 0' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={l.href || l.label + "-mobile"}
              href={l.href}
              className="header__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          )
        ))}
        {/* CTAs no mobile */}
        <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href="/diagnostico"
            className="btn btn--primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.85rem 1.5rem", fontSize: "0.95rem", textDecoration: "none" }}
            onClick={() => setMobileOpen(false)}
          >
            Avaliar meu caso grátis
          </Link>
          <a
            href="https://wa.me/553183259594"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.85rem 1.5rem", background: "#25D366", color: "#fff", borderRadius: "9999px", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}
            onClick={() => setMobileOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
        </div>
      </nav>
    </>
  );
}

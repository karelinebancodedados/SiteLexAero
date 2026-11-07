import Link from "next/link";

export const metadata = {
  title: "Kareline Staut | Advogada Especialista em Direito do Passageiro Aéreo",
  description:
    "Conheça a trajetória, formação e filosofia de atuação de Kareline Staut, Mestra em Direito e fundadora da LexAero — boutique jurídica especializada em Direito do Passageiro Aéreo.",
};

export default function KarelinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Kareline Staut",
            "jobTitle": "Advogada",
            "description": "Mestra em Direito, especialista em Direito do Passageiro Aéreo e Direito do Consumidor. Fundadora da LexAero.",
            "url": "https://www.lexaero.com.br/kareline-staut",
            "worksFor": {
              "@type": "LegalService",
              "name": "LexAero",
              "url": "https://www.lexaero.com.br",
            },
            "knowsAbout": ["Direito do Passageiro Aéreo","Direito do Consumidor","Transporte Aéreo"],
            "alumniOf": { "@type": "CollegeOrUniversity", "name": "[Instituição — preencher]" },
          }),
        }}
      />

       <section style={{ backgroundColor: "var(--lex-black)", padding: "5rem 0", color: "var(--lex-white)", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <style dangerouslySetInnerHTML={{__html: `
          .kareline-hero-container {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            align-items: center;
            gap: 4rem;
            max-width: 1100px;
          }
          .kareline-hero-photo {
            position: relative;
            width: 100%;
          }
          .kareline-hero-content {
            display: flex;
            flex-direction: column;
          }
          .kareline-hero-header {
            text-align: left;
            margin-bottom: 2rem;
          }
          .kareline-hero-tags {
            justify-content: flex-start;
          }
          .kareline-hero-bio {
            text-align: left;
          }
          @media (max-width: 768px) {
            .kareline-hero-container {
              display: flex;
              flex-direction: column;
              gap: 2rem;
            }
            .kareline-hero-content {
              display: contents;
            }
            .kareline-hero-header {
              order: 1;
              text-align: center;
              margin-bottom: 0;
            }
            .kareline-hero-photo {
              order: 2;
            }
            .kareline-hero-bio {
              order: 3;
              text-align: center;
            }
            .kareline-hero-tags {
              justify-content: center;
            }
            .kareline-btn {
              margin: 2rem auto 0 auto;
            }
          }
        `}} />
        <div className="container kareline-hero-container">
          
          <div className="kareline-hero-photo">
            <img src="/kareline-hero-confianca.png" alt="Kareline Staut" style={{ width: "100%", height: "auto", display: "block", maxWidth: "450px", margin: "0 auto" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, var(--lex-black), transparent)", pointerEvents: "none" }}></div>
          </div>

          <div className="kareline-hero-content">
            <div className="kareline-hero-header">
              <span className="eyebrow" style={{ color: "var(--lex-gold-dark)", display: "block", marginBottom: "0.5rem" }}>Fundadora da LexAero</span>
              <h1 itemProp="name" style={{ fontSize: "clamp(2rem, 3.5vw, 2.5rem)", margin: "0 0 0.5rem", color: "var(--lex-white)" }}>Kareline Staut</h1>
            </div>

            <div className="kareline-hero-bio">
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ lineHeight: 1.6, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0, fontWeight: 300 }}>
                  Kareline Staut é advogada e fundadora da Lex Aero, boutique jurídica dedicada à proteção dos direitos dos passageiros e à atuação estratégica em conflitos envolvendo o transporte aéreo.
                </p>
                <p style={{ lineHeight: 1.6, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0, fontWeight: 300 }}>
                  Sua atuação é direcionada à análise jurídica de situações como atrasos e cancelamentos de voos, perda de conexão, preterição de embarque, ausência ou inadequação de assistência material, problemas de reacomodação, extravio e avaria de bagagem e falhas na prestação do serviço de transporte aéreo.
                </p>
                <p style={{ lineHeight: 1.6, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0, fontWeight: 300 }}>
                  Com formação acadêmica em Direito e vasta experiência na área jurídica, Kareline combina conhecimento técnico, análise estratégica do caso concreto e comunicação jurídica clara e acessível, buscando transformar situações complexas enfrentadas pelos passageiros em estratégias jurídicas objetivas e fundamentadas.
                </p>
                <p style={{ lineHeight: 1.6, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0, fontWeight: 300 }}>
                  Na Lex Aero, cada caso é analisado a partir das circunstâncias específicas da viagem, da documentação disponível, da legislação aplicável e do entendimento dos tribunais, evitando soluções padronizadas para problemas que podem apresentar fundamentos jurídicos distintos.
                </p>
                <p style={{ lineHeight: 1.6, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0, fontWeight: 300 }}>
                  Sua abordagem parte de uma premissa simples: direito do passageiro não é apenas saber que existe um direito. É compreender quando ele se aplica, quais provas são relevantes e qual estratégia jurídica é adequada para defendê-lo.
                </p>
                <p style={{ lineHeight: 1.6, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0, fontWeight: 300 }}>
                  A Lex Aero nasce dessa visão: oferecer uma atuação especializada, técnica e estratégica na defesa do passageiro aéreo, aproximando direito, tecnologia, análise de dados e comunicação jurídica para tornar a proteção do viajante mais eficiente e compreensível.
                </p>
              </div>
              
              <a href="https://wa.me/553183259594" target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--lg kareline-btn" style={{ marginTop: "2rem" }}>
                Solicitar análise
                <span className="btn__icon-circle" aria-hidden="true">
                  <img src="/aviao.svg" width="20" height="20" alt="" aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}

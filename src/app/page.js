import Link from "next/link";
import Image from "next/image";
import Testimonials from "@/componentes/Testimonials";
import StepsWrapper from "@/componentes/StepsWrapper";
import AnimatedNumber from "@/componentes/AnimatedNumber";
import AnimatedPlane from "@/componentes/AnimatedPlane";
import { blogPosts } from "@/dados/blogData";
import LeadCaptureForm from "@/componentes/LeadCaptureForm";
import DiagnosticForm from "@/componentes/DiagnosticForm";
import FaqAccordion from "@/componentes/FaqAccordion";

export const metadata = {
  title: "LexAero | Voo Atrasado ou Cancelado? Conheça Seus Direitos",
  description: "Boutique jurídica especializada em Direito do Passageiro Aéreo. Análise individualizada para problemas com voos e bagagem.",
};

const PROBLEMS = [
  {
    title: "Voo atrasado",
    desc: "Atrasos superiores a 4 horas podem gerar direitos ao passageiro. Avaliamos a documentação do seu voo e orientamos os próximos passos.",
    href: "/voo-atrasado",
    icon: (<img src="/icone-voo-atrasado.png" alt="Voo atrasado" style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-6px', marginTop: '-6px' }} />),
  },
  {
    title: "Voo cancelado",
    desc: "Cancelamentos sem assistência adequada podem ensejar medidas. Entenda o que a companhia deveria ter feito e como proceder.",
    href: "/voo-cancelado",
    icon: (<img src="/icone-voo-cancelado.png" alt="Voo cancelado" style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-6px', marginTop: '-6px' }} />),
  },
  {
    title: "Overbooking",
    desc: "Embarque negado por excesso de passageiros? Verificamos sua elegibilidade a reparação e medidas cabíveis.",
    href: "/overbooking",
    icon: (<img src="/icone-overbooking.png" alt="Overbooking" style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-6px', marginTop: '-6px' }} />),
  },
  {
    title: "Extravio ou dano de bagagem",
    desc: "Orientamos a abertura de protocolos, prazos e medidas legais caso sua bagagem seja perdida ou chegue danificada.",
    href: "/bagagem",
    icon: (<img src="/icone-bagagem.png" alt="Bagagem" style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-6px', marginTop: '-6px' }} />),
  },
  {
    title: "Conexão perdida / Reacomodação",
    desc: "Acompanhe seus direitos a assistência material e opções oferecidas pela companhia ao perder uma conexão.",
    href: "/conexao-perdida",
    icon: (<img src="/icone-perda-conexao.png" alt="Conexão perdida" style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-6px', marginTop: '-6px' }} />),
  },
];

const FAQS = [
  {
    q: "Quais problemas com voos podem gerar direitos ao passageiro?",
    a: "Atrasos superiores a certas horas, cancelamentos, overbooking (preterição de embarque), extravio ou dano de bagagem e ausência de assistência material são as situações mais comuns. A análise de cada caso considera as circunstâncias específicas, os documentos disponíveis e a legislação aplicável.",
  },
  {
    q: "O que devo guardar após um problema com voo?",
    a: "Guarde o cartão de embarque, o comprovante de reserva, e-mails e mensagens da companhia, protocolos de atendimento, declaração de atraso ou cancelamento, comprovantes de gastos extras e fotografias do painel de chegadas e partidas.",
  },
  {
    q: "O que acontece quando perco uma conexão por atraso?",
    a: 'Quando os trechos fazem parte do mesmo bilhete (localizador único), a companhia responsável pelo voo que atrasou deve garantir a chegada ao destino final e fornecer assistência material. A situação pode ser diferente quando os bilhetes foram adquiridos separadamente.',
  },
  {
    q: "Como funciona a assistência material?",
    a: "A Resolução nº 400 da ANAC determina que a companhia deve oferecer, progressivamente: comunicação a partir de 1 hora de atraso, alimentação a partir de 2 horas, e acomodação e transporte a partir de 4 horas — ou na interrupção da viagem com pernoite.",
  },
  {
    q: "O atendimento da LexAero é realizado online?",
    a: "Sim. A LexAero possui estrutura para atendimento digital e análise de situações envolvendo passageiros de qualquer parte do Brasil.",
  },
  {
    q: "Como funciona o diagnóstico preliminar?",
    a: "O diagnóstico é uma ferramenta informativa. Você responde perguntas sobre sua situação e, ao final, pode solicitar uma análise jurídica individualizada. Não constitui parecer jurídico.",
  },
];

const CONTENT_CARDS = [
  { tag: "Atraso", title: "Atraso de voo", desc: "Saiba seus direitos em casos de atraso.", href: "/voo-atrasado", icon: <img src="/icone-voo-atrasado.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /> },
  { tag: "Cancelamento", title: "Voo cancelado", desc: "Entenda quando cabe indenização.", href: "/voo-cancelado", icon: <img src="/icone-voo-cancelado.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /> },
  { tag: "Overbooking", title: "Overbooking", desc: "Embarque negado por excesso de passageiros.", href: "/overbooking", icon: <img src="/icone-overbooking.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /> },
  { tag: "Bagagem", title: "Extravio de bagagem", desc: "Conheça seus direitos sobre bagagem.", href: "/bagagem", icon: <img src="/icone-bagagem.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /> },
  { tag: "Conexão", title: "Conexão perdida", desc: "Veja o que fazer em voos com conexão.", href: "/conexao-perdida", icon: <img src="/icone-perda-conexao.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /> },
];

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ── HERO: Founder-Led ─────────────────────────── */}
      <section className="hero" aria-label="Hero principal" style={{ position: 'relative' }}>
        <AnimatedPlane />
        <div className="container">
          <div className="hero__inner">

            <div className="hero__left">
              <span className="hero__eyebrow">PROBLEMA COM VOO?</span>
              <h1 className="hero__headline">
                Voo atrasado ou cancelado? Você pode ter direito a ganhar <span className="hero-mobile-nowrap"><span style={{ color: 'var(--lex-gold)' }}>indenização aérea!</span></span>
              </h1>
              <p className="hero__sub">
                Atrasos longos, cancelamentos, perda de conexão, overbooking, ausência de assistência material ou problemas com a bagagem podem gerar compensações.
                <br /><br />
                Verifique seu caso em poucos minutos.
              </p>

              <div className="hero__ctas">
                <Link href="/diagnostico" className="btn btn--primary">
                  Diagnóstico inicial em 2 minutos
                  <span className="btn__icon-circle" aria-hidden="true"><img src="/aviao.svg" width="20" height="20" alt="" aria-hidden="true" /></span>
                </Link>
              </div>

              <div className="hero__trust">
                <div className="hero__trust-item">
                  <img src="/bandeira_brasil.webp" alt="Bandeira do Brasil" style={{ width: '16px', height: '11px', objectFit: 'cover', borderRadius: '2px' }} />
                  Atendimento em todo o Brasil
                </div>

              </div>
            </div>

            {/* Direita — Foto da Kareline Staut */}
            <div className="hero__photo-wrap" aria-hidden="true">
              <Image
                src="/kareline-hero-confianca.png"
                alt="Kareline Staut — Fundadora da LexAero, advogada especialista em Direito do Passageiro Aéreo"
                className="hero__photo"
                width={800}
                height={900}
                style={{ width: "100%", height: "auto" }}
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS (SOCIAL PROOF RÁPIDO) ──────────────────────────────── */}
      <Testimonials />



      {/* ── O QUE ACONTECEU — FUNDO BRANCO ─────────────── */}
      <section className="section" style={{ backgroundColor: '#ffffff' }} aria-labelledby="problems-heading">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            
            {/* ── COLUNA ESQUERDA: Banner Escuro ── */}
            <div className="problems-banner-escuro hide-on-mobile" style={{ 
              flex: '1 1 300px', 
              backgroundColor: '#0a0f19', 
              borderRadius: '24px',
              padding: '2.5rem 2rem 0 2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ color: 'var(--lex-gold)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
                Entenda o seu caso
              </span>
              <h2 id="problems-heading" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: '#ffffff' }}>
                Qual foi o problema<br/>com o seu voo?
              </h2>
              <img 
                src="/kareline-central-direitos-apontando.png" 
                alt="Kareline apontando para os problemas" 
                style={{ 
                  marginTop: 'auto',
                  width: '100%', 
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                  display: 'block',
                  transform: 'scale(1.1)',
                  transformOrigin: 'bottom center'
                }} 
              />
            </div>

            {/* ── COLUNA DIREITA: Grid de Cards ── */}
            <div style={{ flex: '2 1 650px' }}>
              <div className="problems-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {PROBLEMS.map((p) => (
                  <Link key={p.href + p.title} href={p.href} className="card card--problem" style={{ padding: '1.25rem' }}>
                    <div className="card__icon" aria-hidden="true" style={{ transform: 'scale(0.8)', transformOrigin: 'left center', marginBottom: '-10px' }}>{p.icon}</div>
                    <h3 className="card__title" style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{p.title}</h3>
                    <p className="card__desc" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>{p.desc}</p>
                    <span className="btn btn--primary btn--sm" style={{ marginTop: 'auto', alignSelf: 'center', fontSize: '0.85rem', padding: '0.6rem 1.2rem', width: '100%' }}>
                      Conhecer direitos
                      <span className="btn__icon-circle" aria-hidden="true" style={{ width: '24px', height: '24px' }}><img src="/aviao.svg" width="14" height="14" alt="" aria-hidden="true" /></span>
                    </span>
                  </Link>
                ))}
                
                {/* CTA Extra Card */}
                <div className="card" style={{ background: 'var(--lex-gold-bg)', borderColor: 'var(--lex-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.25rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="card__title" style={{ fontSize: '1.15rem', color: 'var(--lex-gold-dark)', marginBottom: '0.5rem', fontWeight: 600 }}>Análise</h3>
                  <p className="card__desc" style={{ fontSize: '0.85rem', color: 'var(--lex-text)', marginBottom: '1rem', fontWeight: 500, lineHeight: 1.3 }}>
                    <span style={{ color: 'var(--lex-gold-dark)' }}>Seus direitos dependem dos detalhes do caso</span><br/><br/>
                    Cada situação envolvendo transporte aéreo deve ser analisada de acordo com os fatos, documentos e normas aplicáveis.
                  </p>
                  <a href="https://wa.me/5531983259594?text=Olá, gostaria de falar com um especialista sobre uma análise do meu caso." target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm" style={{ marginTop: 'auto', alignSelf: 'center', fontSize: '0.85rem', padding: '0.6rem 1.2rem', width: '100%', background: '#25D366', borderColor: '#25D366', color: '#fff' }}>
                    Falar no WhatsApp
                    <span className="btn__icon-circle" aria-hidden="true" style={{ width: '24px', height: '24px', background: '#25D366' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── DIAGNÓSTICO CTA — VIDEO BACKGROUND PREMIUM ───── */}
      <section className="section video-cta-section" aria-labelledby="diag-heading" style={{ position: "relative", overflow: "hidden", minHeight: "700px", display: "flex", alignItems: "center", padding: "var(--space-12) 0" }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="diag-video-bg"
          style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", objectFit: "cover", zIndex: 0, transform: "scale(1.05)" }}
        >
          <source src="/video_aviao.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10, 15, 25, 0.45)", zIndex: 1 }}></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="diag-cols">
            
            {/* Coluna Esquerda: Conteúdo */}
            <div className="diag-col-left" style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                <Image src="/logo_lexaero_dark.png" alt="LexAero" width={140} height={28} style={{ height: '28px', width: "auto", filter: 'brightness(0) invert(1)' }} />
              </div>
              <span style={{ color: "var(--lex-gold)", fontSize: "0.72rem", letterSpacing: "0.15em", fontWeight: 700, display: "block", marginBottom: "1rem", textTransform: 'uppercase', textAlign: "left" }}>
                Ferramenta de análise
              </span>
              <h2 id="diag-heading" style={{ color: "var(--lex-white)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem', textAlign: "left" }}>
                Descubra seus direitos e a faixa de indenização para o seu caso
              </h2>
              <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.65, marginBottom: '2rem', textAlign: "left" }}>
                Responda a algumas perguntas sobre o que aconteceu no seu voo. A ferramenta indica uma faixa praticada pelos tribunais e explica, de forma transparente, o que pesa a favor e o que merece atenção.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.82rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Leva menos de 2 minutos
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.82rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Análise inicial gratuita
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.82rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Base: ANAC 400, CDC e STF
                </span>
              </div>
            </div>

            {/* Coluna Direita: Diagnóstico Embutido */}
            <div className="diag-col-right">
              <div className="diag-form-card" style={{ 
                background: "#ffffff", 
                borderRadius: "24px", 
                padding: "2.5rem 2rem", 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}>
                <DiagnosticForm isEmbedded={true} />
              </div>
            </div>

          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .diag-video-bg {
            object-position: 35% center !important;
          }
          @media (min-width: 992px) {
            .diag-video-bg {
              object-position: 75% center !important;
            }
          }
          .diag-option-card:hover {
            border-color: var(--lex-gold) !important;
            background: var(--lex-gold-bg) !important;
          }
          .diag-radio:checked + .diag-option-card {
            border-color: var(--lex-gold) !important;
            background: var(--lex-gold-bg) !important;
          }
          .diag-radio:checked + .diag-option-card .diag-radio-inner {
            border-color: var(--lex-gold) !important;
          }
          .diag-radio:checked + .diag-option-card .diag-radio-inner::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background-color: var(--lex-gold);
            border-radius: 50%;
          }
        `}} />
      </section>

      {/* ── COMO FUNCIONA — FUNDO IVORY ──────────────── */}
      <section className="section bg-ivory" aria-labelledby="how-heading">
        <div className="container">
          <div className="text-center" style={{ maxWidth: 600, margin: "0 auto 4rem" }}>
            <span className="eyebrow">ATENDIMENTO ESPECIALIZADO</span>
            <h2 id="how-heading" style={{ marginTop: "0.5rem" }}>Entenda as etapas da análise do seu caso</h2>
          </div>
          <StepsWrapper>
            <div className="steps-container">

              <div className="steps-grid">
                {[
                  { n: "01", icon: "/analise2.png", title: "Diagnóstico em 2 minutos", desc: "Use nosso diagnóstico online para nos contar o problema do seu voo. É rápido, intuitivo e sem custos." },
                  { n: "02", icon: "/avaliação2.png", title: "Nossa equipe jurídica avalia o caso", desc: "Analisamos as circunstâncias da viagem, os documentos disponíveis e as normas aplicáveis para identificar os direitos que podem estar envolvidos." },
                  { n: "03", icon: "/burocracia3.png", title: "Orientação em cada etapa", desc: "Você recebe orientação sobre as providências cabíveis, os caminhos e a melhor estratégia jurídica disponível para o seu caso. Simples, profissional e muito mais alinhado ao posicionamento que estamos construindo." },
            ].map((s) => (
              <div key={s.n} className="step" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: "var(--space-5)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px" }}>
                  {s.icon ? (
                    <img src={s.icon} alt="" style={{ height: "100px", width: "auto", objectFit: "contain", display: "block" }} />
                  ) : (
                    <div className="step__number" style={{ marginBottom: 0 }}>{s.n}</div>
                  )}
                </div>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__desc">{s.desc}</p>
              </div>
            ))}
              </div>
            </div>
          </StepsWrapper>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
            <a href="https://wa.me/5531983259594?text=Olá, gostaria de analisar meu caso com um especialista no WhatsApp." target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--lg" style={{ background: '#25D366', borderColor: '#25D366', color: '#fff' }}>
              Falar direto no WhatsApp
              <span className="btn__icon-circle" aria-hidden="true" style={{ background: '#1da851' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></span>
            </a>
          </div>

        </div>
      </section>

      
      {/* ── CUSTOS (Novo Pricing) — FUNDO BRANCO ──────────────── */}
      <section className="section bg-white" aria-labelledby="custas-heading">
        <div className="container" style={{ maxWidth: 1000 }}>
          
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ flex: "1 1 400px", textAlign: 'left' }}>
              <h2 id="custas-heading" style={{ fontSize: "clamp(2.5rem, 4vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--lex-black)", letterSpacing: "-0.03em", textAlign: "left" }}>
                Quanto custa<br/>processar uma<br/><span style={{ color: "var(--lex-gold)", whiteSpace: "nowrap" }}>companhia aérea?</span>
              </h2>
              <p style={{ fontSize: "1.15rem", color: "var(--lex-text-muted)", fontWeight: 500, maxWidth: "450px", textAlign: "left", marginLeft: 0, marginRight: 0, lineHeight: 1.6 }}>
                Entenda os custos envolvidos e como funciona a Justiça para proteger seus direitos.
              </p>
              <div style={{ width: "60px", height: "3px", background: "var(--lex-gold)", marginTop: "1.5rem", marginLeft: 0 }}></div>
            </div>
            <div style={{ flex: "1 1 300px", display: "flex", justify: "center", position: "relative" }}>
              <img src="/img_hero_aviao.png" alt="Custos" style={{ maxWidth: "100%", height: "auto", transform: "scale(1.1)" }} />
            </div>
          </div>

          <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            {/* Black bar */}
            <div style={{ background: "var(--lex-black)", color: "var(--lex-white)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ background: "var(--lex-gold)", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--lex-white)", fontWeight: "bold", fontSize: "0.9rem", flexShrink: 0 }}>i</div>
              <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>O custo para processar uma companhia aérea <span style={{ color: "var(--lex-gold)" }}>pode variar:</span></span>
            </div>

            {/* Content Area */}
            <div style={{ background: "#FDFDFD", padding: "2rem", display: "flex", position: "relative" }}>
              
              {/* Progress Line */}
              <div className="hidden-mobile" style={{ position: "absolute", left: "2rem", top: "4rem", bottom: "12rem", width: "2px", background: "#f0f0f0", zIndex: 0 }}></div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
                
                {/* Row 1 */}
                <div className="cost-row" style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", position: "relative", zIndex: 1 }}>
                  <div className="cost-num hidden-mobile" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--lex-gold)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", position: "absolute", left: "-56px", top: "50%", transform: "translateY(-50%)" }}>1</div>
                  <div className="cost-icon-card">
                    <img src="/icon1.png" width="100" height="100" alt="Juizado Especial Cível" style={{ objectFit: 'contain' }} />
                    <span className="cost-icon-title">Juizado Especial<br/>Cível (JEC)</span>
                  </div>
                  <div className="cost-desc-card">
                    <ul className="cost-list">
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>Em regra, podem tramitar no JEC causas de <strong>até 40 salários mínimos</strong>, observados os requisitos legais de competência e menor complexidade.</span>
                      </li>
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span><strong>Até 20 salários mínimos</strong>, a parte pode comparecer pessoalmente; <strong>acima desse valor</strong>, a assistência de advogado é obrigatória.</span>
                      </li>
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>Em primeiro grau, o acesso <strong>independe do pagamento de custas</strong>, taxas ou despesas, ressalvadas as hipóteses previstas em lei.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="cost-row" style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", position: "relative", zIndex: 1 }}>
                  <div className="cost-num hidden-mobile" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--lex-gold)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", position: "absolute", left: "-56px", top: "50%", transform: "translateY(-50%)" }}>2</div>
                  <div className="cost-icon-card">
                    <img src="/icon2.png" width="100" height="100" alt="Justiça Comum" style={{ objectFit: 'contain' }} />
                    <span className="cost-icon-title">Justiça Comum</span>
                  </div>
                  <div className="cost-desc-card">
                    <ul className="cost-list">
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>Quando a demanda não puder tramitar no Juizado Especial, <strong>poderão existir custas e despesas processuais</strong>, conforme as <strong>regras do tribunal competente</strong> e o tipo de demanda.</span>
                      </li>
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>A porcentagem das custas iniciais varia de acordo com o tribunal, girando em torno de <strong>1% a 2% do valor da causa</strong>, mas com regras próprias em cada órgão.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="cost-row" style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", position: "relative", zIndex: 1 }}>
                  <div className="cost-num hidden-mobile" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--lex-gold)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", position: "absolute", left: "-56px", top: "50%", transform: "translateY(-50%)" }}>3</div>
                  <div className="cost-icon-card">
                    <img src="/icon3.png" width="100" height="100" alt="Honorários Advocatícios" style={{ objectFit: 'contain' }} />
                    <span className="cost-icon-title">Honorários<br/>Advocatícios</span>
                  </div>
                  <div className="cost-desc-card">
                    <ul className="cost-list">
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>Os honorários são definidos entre advogado e cliente e formalizados em contrato, que deve estabelecer com clareza o objeto da contratação, os honorários, a forma de pagamento e a extensão da atuação profissional.</span>
                      </li>
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>Muitos <strong>escritórios trabalham com contrato de êxito (30% de honorários</strong> sobre o valor recebido ao final da ação), o que significa que o passageiro praticamente <strong>não precisaria desembolsar</strong> valores no início.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="cost-row" style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", position: "relative", zIndex: 1 }}>
                  <div className="cost-num hidden-mobile" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--lex-gold)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", position: "absolute", left: "-56px", top: "50%", transform: "translateY(-50%)" }}>4</div>
                  <div className="cost-icon-card">
                    <img src="/icon4.png" width="100" height="100" alt="Justiça Gratuita" style={{ objectFit: 'contain' }} />
                    <span className="cost-icon-title">Justiça<br/>Gratuita</span>
                  </div>
                  <div className="cost-desc-card">
                    <ul className="cost-list">
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lex-gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                        <span>Quem comprovar que não pode arcar com as custas sem prejuízo do sustento pode solicitar o benefício da justiça gratuita, ficando <strong>isento de custas e honorários</strong>.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Info box bottom */}
                <div className="cost-info-box">
                  <img src="/iconicon.png" width="56" height="56" alt="Informação" style={{ flexShrink: 0, objectFit: 'contain' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--lex-black)" }}>
                      <strong>Na prática, a maioria das ações contra companhias aéreas é ajuizada no Juizado Especial Cível (para valores de até 40 salários mínimos)</strong>, onde o processo é gratuito em primeira instância e tende a ser mais rápido — em média, <strong>de 2 a 9 meses</strong> até a sentença.
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "var(--lex-text-muted)", display: "block", marginTop: "0.5rem" }}>Fonte: Portal CNJ</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .cost-row { flex-direction: column; }
          .cost-icon-card { width: 100%; background: #F7F5F0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
          .cost-icon-title { margin-top: 0.75rem; font-weight: 700; font-size: 0.95rem; color: var(--lex-black); }
          .cost-desc-card { flex: 1; border: 1px solid #EAEAEA; border-radius: 12px; padding: 1.5rem; background: #fff; }
          .cost-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
          .cost-list li { display: flex; gap: 0.75rem; align-items: flex-start; }
          .cost-list svg { width: 20px; height: 20px; flex-shrink: 0; margin-top: 2px; }
          .cost-list span { font-size: 0.95rem; color: var(--lex-text-muted); line-height: 1.5; }
          .cost-list strong { color: var(--lex-black); font-weight: 600; }
          .cost-info-box { background: #FFFBF2; border: 1px solid #F3E8CB; border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; align-items: flex-start; margin-top: 1rem; }
          .hidden-mobile { display: none !important; }

          @media (min-width: 768px) {
            .cost-row { flex-direction: row; margin-left: 2.5rem; }
            .cost-icon-card { width: 180px; padding: 1rem; }
            .hidden-mobile { display: flex !important; }
            .cost-info-box { flex-direction: row; align-items: center; margin-left: 2.5rem; }
          }
        `}} />
      </section>

      

      {/* ── KARELINE — FUNDO ESCURO CINEMATOGRÁFICO ────── */}
      <section className="section bg-dark" aria-labelledby="kareline-heading" style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
        <div className="container">
          <div className="kareline-section">
            {/* Foto editorial */}
            <div className="kareline__mobile-header">
              <span className="eyebrow" style={{ color: "var(--lex-gold)" }}>À FRENTE DA LEXAERO</span>
              <h2 id="kareline-heading-mobile" style={{ marginTop: "0.5rem" }}>
                Quem irá cuidar do seu <span style={{ color: "var(--lex-gold)" }}>processo?</span>
              </h2>
            </div>
            <div className="kareline__photo-editorial">
              <img
                src="/kareline-founder-autoridade-vermelho.png"
                alt="Kareline Staut, advogada especialista em Direito do Passageiro Aéreo e fundadora da LexAero"
                className="kareline-editorial-img"
                loading="lazy"
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "25%", background: "linear-gradient(to top, var(--lex-black) 0%, transparent 100%)", pointerEvents: "none" }}></div>
            </div>

            {/* Conteúdo */}
            <div className="kareline__content" style={{ position: "relative" }}>
              <div className="kareline__desktop-header" style={{ position: "relative", zIndex: 2, textAlign: "left" }}>
                <h2 id="kareline-heading" style={{ marginTop: "0.5rem", marginBottom: "1.5rem", whiteSpace: "nowrap" }}>
                  Quem irá cuidar do seu <span style={{ color: "var(--lex-gold)" }}>processo?</span>
                </h2>
              </div>
              
              <div style={{ textAlign: "justify", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "0" }}>
                <p style={{ lineHeight: 1.5, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0 }}>
                  Kareline Staut é advogada e fundadora da Lex Aero, boutique jurídica dedicada à proteção dos direitos dos passageiros e à atuação estratégica em conflitos envolvendo o transporte aéreo.
                </p>
                <p style={{ lineHeight: 1.5, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0 }}>
                  Sua atuação é direcionada à análise jurídica de situações como atrasos e cancelamentos de voos, perda de conexão, preterição de embarque, ausência ou inadequação de assistência material, problemas de reacomodação, extravio e avaria de bagagem e falhas na prestação do serviço de transporte aéreo.
                </p>
                <p style={{ lineHeight: 1.5, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0 }}>
                  Com formação acadêmica em Direito e vasta experiência na área jurídica, Kareline combina conhecimento técnico, análise estratégica do caso concreto e comunicação jurídica clara e acessível, buscando transformar situações complexas enfrentadas pelos passageiros em estratégias jurídicas objetivas e fundamentadas.
                </p>
                <p style={{ lineHeight: 1.5, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0 }}>
                  Na Lex Aero, cada caso é analisado a partir das circunstâncias específicas da viagem, da documentação disponível, da legislação aplicável e do entendimento dos tribunais, evitando soluções padronizadas para problemas que podem apresentar fundamentos jurídicos distintos.
                </p>
                <p style={{ lineHeight: 1.5, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0 }}>
                  Sua abordagem parte de uma premissa simples: direito do passageiro não é apenas saber que existe um direito. É compreender quando ele se aplica, quais provas são relevantes e qual estratégia jurídica é adequada para defendê-lo.
                </p>
                <p style={{ lineHeight: 1.5, color: "var(--lex-text-dark-muted)", fontSize: "0.95rem", margin: 0 }}>
                  A Lex Aero nasce dessa visão: oferecer uma atuação especializada, técnica e estratégica na defesa do passageiro aéreo, aproximando direito, tecnologia, análise de dados e comunicação jurídica para tornar a proteção do viajante mais eficiente e compreensível.
                </p>
                
                <div style={{ marginTop: "1.25rem" }}>
                  <p style={{ fontSize: "1.05rem", margin: 0, color: "var(--lex-gold)", fontWeight: 600 }}>
                    Kareline Staut <span style={{ color: "var(--lex-white)", fontWeight: 400 }}>| Fundadora da LexAero</span>
                  </p>
                  <p style={{ fontSize: "0.9rem", margin: 0, color: "var(--lex-white)", opacity: 0.8, marginTop: "0.25rem" }}>
                    Mestra em Direito • Advogada • Especialista em Direito do Consumidor e Direito do Passageiro Aéreo
                  </p>
                </div>
              </div>
            </div>
</div>
        </div>
      </section>

      {/* ── CAPTURA DE LEADS (Substitui Metodologia) ───────── */}
      <section className="section bg-dark" aria-labelledby="diff-heading" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div className="metodologia-section">
            {/* Texto */}
            <div className="metodologia__text" style={{ textAlign: "center" }}>
              <span className="eyebrow">FALE COM UM ESPECIALISTA</span>
              <h2 id="diff-heading" style={{ marginTop: "0.5rem", marginBottom: "1.25rem", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                Saiba seus direitos,{" "}
                <span style={{ whiteSpace: "nowrap" }}>passageiro.</span><br />
                A cia aérea pode sofrer consequências por suas falhas.
              </h2>
              <p style={{ marginBottom: 0, fontSize: "0.875rem", lineHeight: "1.5" }}>
                Eles já tomaram o seu tempo e esgotaram sua paciência. Agora é hora de buscar a sua compensação justa.
              </p>
            </div>

            {/* Foto */}
            <div className="metodologia__photo-wrap" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", position: "relative" }}>
              <img
                src="/kareline-metodologia-seriedade.png"
                alt="Kareline Staut — Análise técnica e individualizada"
                className="metodologia__photo"
                loading="lazy"
                style={{ width: "100%", maxWidth: "550px", objectFit: "contain", objectPosition: "bottom center", transform: "scale(1.35)", transformOrigin: "bottom center" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "40%", background: "linear-gradient(to top, var(--lex-black) 0%, transparent 100%)", pointerEvents: "none" }}></div>
            </div>

            {/* Formulário */}
            <div className="metodologia__form">
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ — PERGUNTAS FREQUENTES ───────────────────────── */}
      <FaqAccordion />



      {/* ── CTA FINAL — FUNDO DOURADO ────────────────────── */}
      <section className="section" aria-labelledby="cta-heading" style={{ background: "var(--lex-gold)", padding: "var(--space-20) 0" }}>
        <div className="container">
          <div className="cta-banner" style={{ background: "transparent", border: "none", padding: 0 }}>
            <h2 id="cta-heading" className="cta-banner__title" style={{ color: "var(--lex-black)", maxWidth: 800, margin: "0 auto var(--space-8)", fontWeight: 300 }}>
              Quer buscar seus direitos por problema com voo sem sair de casa? É só verificar grátis!
            </h2>
            <div className="cta-banner__btns">
              <Link href="/diagnostico" className="btn btn--primary btn--lg" style={{ background: "var(--lex-black)", color: "var(--lex-white)", border: "none", borderRadius: "9999px" }}>
                Verificar grátis
                <span className="btn__icon-circle" aria-hidden="true">
                  <img src="/aviao.svg" alt="" style={{ width: '1.2em', height: '1.2em', objectFit: 'contain' }} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

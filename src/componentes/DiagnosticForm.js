"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const TOTAL_STEPS = 7;

/* ── colour tokens ── */
const LIGHT = {
  gold:        "#FCBD26",
  goldHover:   "#e0a820",
  goldBg:      "#FFFBEE",
  goldBorder:  "rgba(252,189,38,0.4)",
  text:        "#1a1a1a",
  textMuted:   "#6b7280",
  surface:     "#ffffff",
  bg:          "#f8f7f4",
  border:      "#e5e7eb",
  green:       "#16a34a",
  greenBg:     "#dcfce7",
};

export default function DiagnosticForm({ isEmbedded = false }) {
  const C = LIGHT;
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    nome: '', whatsapp: '',
    tipo: null, sub: null, atrasoDur: null, tempDur: null, reacomodado: null,
    ambito: null, assist: null, agravantes: [], causa: null, culpa: 'nao', docs: [],
    term1: false, term2: false, term3: false
  });
  
  const [leadId, setLeadId] = useState(null);
  const [gclid, setGclid] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Generate UUID on mount if not exists
    let currentId = sessionStorage.getItem('lexaero_lead_id');
    if (!currentId) {
      currentId = uuidv4();
      sessionStorage.setItem('lexaero_lead_id', currentId);
    }
    setLeadId(currentId);
    
    // Get gclid
    const urlParams = new URLSearchParams(window.location.search);
    const g = urlParams.get('gclid');
    if (g) setGclid(g);
  }, []);
  
  useEffect(() => {
    if (step > TOTAL_STEPS && !showResult) {
      setIsAnalyzing(true);
      const t = setInterval(() => {
        setLoadPct(p => {
          const n = p + 2;
          if (n >= 100) { clearInterval(t); setIsAnalyzing(false); setShowResult(true); upsertLead(TOTAL_STEPS, true); return 100; }
          return n;
        });
      }, 30);
      return () => clearInterval(t);
    }
  }, [step, showResult]);

  const money = (n) => { const x = Math.round(Number(n)).toString(); return 'R$ ' + x.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  const faixaTxt = (min, max) => {
    if(min===0 && max===0) return 'Tende a mero dissabor';
    return money(min) + ' – ' + money(max);
  };

  const setField = (f, v) => {
    setState(d => {
      const nd = { ...d, [f]: v };
      if(f==='sub'){ nd.atrasoDur = null; nd.tempDur = null; }
      // Upsert after state update for name/whatsapp capture
      if (f === 'nome' || f === 'whatsapp') {
        setTimeout(() => {
          if (leadId) {
            supabase.from('leads').upsert({
              id: leadId,
              name: f === 'nome' ? v : d.nome || null,
              phone: f === 'whatsapp' ? v : d.whatsapp || null,
              problem_type: d.tipo || null,
              gclid: gclid,
              last_step_reached: step,
              completed: false,
              form_data: nd,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' }).then(({ error }) => { if (error) console.error(error); });
          }
        }, 800);
      }
      return nd;
    });
  };
  const toggleMulti = (f, v) => {
    setState(d => {
      let arr = d[f] || [];
      if(arr.includes(v)) return { ...d, [f]: arr.filter(x => x!==v) };
      return { ...d, [f]: [...arr, v] };
    });
  };

  const stepValid = () => {
    const s = state;
    if(step === 1) return !!s.nome && !!s.whatsapp && !!s.tipo;
    if(step === 2) {
      if(s.tipo === 'atraso_cancel') return !!s.sub && (s.sub!=='atraso' || !!s.atrasoDur);
      if(s.tipo === 'bagagem') return !!s.sub && (s.sub!=='extravio_temp' || !!s.tempDur);
      if(s.tipo === 'overbooking') return !!s.reacomodado;
      if(s.tipo === 'conexao') return !!s.atrasoDur;
      return false;
    }
    if(step === 3) return !!s.ambito;
    if(step === 4) return !!s.assist;
    if(step === 5) return true;
    if(step === 6) return !!s.causa;
    if(step === 7) return !!s.term1 && !!s.term2 && !!s.term3;
    return false;
  };

  const upsertLead = async (currentStep, completed = false) => {
    if (!leadId) return;
    try {
      await supabase.from('leads').upsert({
        id: leadId,
        name: state.nome || null,
        phone: state.whatsapp || null,
        problem_type: state.tipo || null,
        gclid: gclid,
        last_step_reached: currentStep,
        completed: completed,
        form_data: state,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch(e) {
      console.error(e);
    }
  };

  const goNext = () => {
    if(!stepValid()) return;
    upsertLead(step + 1);
    setStep(s => s + 1);
    if(containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  const goBack = () => { if(step > 1) setStep(s => s - 1); };

  const restart = () => {
    setState({nome: '', whatsapp: '', tipo: null, sub: null, atrasoDur: null, tempDur: null, reacomodado: null, ambito: null, assist: null, agravantes: [], causa: null, culpa: 'nao', docs: [], term1: false, term2: false, term3: false});
    setStep(1);
    setShowResult(false);
    setLoadPct(0);
    // Generate fresh lead ID for new analysis
    const newId = uuidv4();
    sessionStorage.setItem('lexaero_lead_id', newId);
    setLeadId(newId);
  };

  const computeResult = () => {
    let s = state;
    let out = { sit:'', min:0, max:0, materiais:'', base:'', compensacao:'', forca:'media', factors:[], stf:null, disc:'', docsRec:'', pos:'' };

    if(s.culpa==='sim'){
      out.sit = situacaoLabel();
      out.forca = 'baixa';
      out.factors.push({t:'gate', txt:'Culpa exclusiva do consumidor — em regra, afasta a responsabilidade da companhia'});
      out.base = baseLegal();
      out.disc = 'A alegação de culpa exclusiva do consumidor, se confirmada, tende a afastar o dever de indenizar. Ainda assim, a análise individual pode revelar nuances. Vale conferir os fatos em detalhe.';
      out.docsRec = docsRecTxt();
      return out;
    }

    let min=0, max=0, sit='';
    if(s.tipo==='atraso_cancel'){
      if(s.sub==='atraso'){
        sit='Atraso de voo';
        if(s.atrasoDur==='lt4'){ min=0; max=0; }
        else if(s.atrasoDur==='4a8'){ min=3000; max=8000; }
        else if(s.atrasoDur==='8a12'){ min=5000; max=12000; }
        else { min=8000; max=15000; }
      } else if(s.sub==='cancelamento'){
        sit='Cancelamento de voo'; min=5000; max=20000;
        if(s.agravantes.includes('perda_compromisso')){ sit='Cancelamento + perda de compromisso'; min=10000; max=30000; }
      } else {
        sit='Alteração unilateral de voo'; min=5000; max=20000;
      }
    } else if(s.tipo==='conexao'){
      sit='Conexão perdida / reacomodação';
      if(s.atrasoDur==='lt4'){ min=3000; max=8000; }
      else if(s.atrasoDur==='4a8'){ min=3000; max=10000; }
      else if(s.atrasoDur==='8a12'){ min=5000; max=12000; }
      else { min=8000; max=15000; }
    } else if(s.tipo==='overbooking'){
      sit='Overbooking (preterição)'; min=5000; max=25000;
      out.compensacao = 'Além do dano moral, há direito à compensação financeira imediata da Res. ANAC 400 (250 DES em voo doméstico / 500 DES em voo internacional), acumulável com reacomodação ou reembolso.';
    } else if(s.tipo==='bagagem'){
      if(s.sub==='extravio_def'){ sit='Extravio definitivo de bagagem'; min=5000; max=15000; }
      else if(s.sub==='extravio_temp'){
        sit='Extravio temporário de bagagem'; min=3000; max=10000;
        if(s.tempDur==='gt168'){ min=5000; max=15000; sit='Extravio temporário prolongado de bagagem'; }
      } else { sit='Dano, violação ou avaria de bagagem'; min=2000; max=10000; }
      if(s.ambito==='internacional'){
        out.materiais = 'Danos materiais (bens): em voo internacional, a reparação segue o limite tarifado da Convenção de Montreal (Decreto 5.910/2006), conforme o STF (Tema 210). O dano moral, por sua vez, é regido pelo CDC.';
      } else {
        out.materiais = 'Danos materiais (bens): em voo doméstico, a reparação segue o valor integral comprovado (CDC). Guarde notas fiscais dos bens e das compras emergenciais.';
      }
    }
    out.sit = sit; out.min = min; out.max = max;

    let score = 0; let F = out.factors;
    if(s.tipo==='overbooking'){ score+=3; F.push({t:'pos', txt:'Overbooking (preterição) é hipótese de responsabilidade objetiva com previsão expressa na ANAC 400'}); }
    if(s.tipo==='atraso_cancel'){
      if(s.sub==='cancelamento'){ score+=3; F.push({t:'pos', txt:'Cancelamento sem alternativa adequada tende a configurar falha na prestação do serviço'}); }
      else if(s.sub==='alteracao'){ score+=2; F.push({t:'pos', txt:'Alteração unilateral relevante pode configurar falha do serviço'}); }
      else if(s.sub==='atraso'){
        if(s.atrasoDur==='lt4'){ F.push({t:'neg', txt:'Atraso inferior a 4h, isoladamente, costuma ser tratado como mero dissabor'}); }
        else if(s.atrasoDur==='4a8'){ score+=2; F.push({t:'pos', txt:'Atraso de 4 a 8 horas costuma superar o mero dissabor'}); }
        else if(s.atrasoDur==='8a12'){ score+=3; F.push({t:'pos', txt:'Atraso de 8 a 12 horas reforça o pedido de dano moral'}); }
        else { score+=4; F.push({t:'pos', txt:'Atraso superior a 12 horas é fator relevante de dano moral'}); }
      }
    }
    if(s.tipo==='conexao'){
      if(s.atrasoDur==='lt4'){ score+=1; } else if(s.atrasoDur==='4a8'){ score+=2; } else if(s.atrasoDur==='8a12'){ score+=3; } else { score+=4; }
      F.push({t:'pos', txt:'Perda de conexão por malha/atraso da companhia atrai o dever de reacomodação e assistência'});
    }
    if(s.tipo==='bagagem'){
      if(s.sub==='extravio_def'){ score+=3; F.push({t:'pos', txt:'Extravio definitivo é dano presumido (in re ipsa) na maior parte da jurisprudência'}); }
      else if(s.sub==='extravio_temp'){ score+=2; if(s.tempDur==='72a168'||s.tempDur==='gt168'){ score+=1; } F.push({t:'pos', txt:'Privação prolongada da bagagem reforça o dano moral'}); }
      else { score+=2; F.push({t:'pos', txt:'Dano, violação ou furto de bagagem configura falha na guarda (CDC)'}); }
    }

    if(s.assist==='nao'){ score+=2; F.push({t:'pos', txt:'Ausência de assistência material (arts. 26 e 27 da ANAC 400) agrava o dano moral'}); }
    else if(s.assist==='parcial'){ score+=1; F.push({t:'pos', txt:'Assistência apenas parcial pesa a favor do passageiro'}); }
    else { score-=1; F.push({t:'neg', txt:'Assistência prestada adequadamente pode reduzir o valor do dano moral'}); }

    if(s.agravantes.includes('hipervulnerabilidade')){ score+=2; F.push({t:'pos', txt:'Passageiro em situação de vulnerabilidade — fator de agravamento reconhecido'}); }
    if(s.agravantes.includes('perda_compromisso')){ score+=2; F.push({t:'pos', txt:'Perda de compromisso relevante reforça o dano e pode elevar o valor'}); }
    if(s.agravantes.includes('despesas')){ score+=1; F.push({t:'pos', txt:'Despesas extras comprovadas sustentam também o pedido de dano material'}); }

    let nDocs = s.docs.length;
    if(nDocs>=4){ score+=2; F.push({t:'pos', txt:'Boa documentação disponível — fortalece a prova do caso'}); }
    else if(nDocs>=2){ score+=1; F.push({t:'pos', txt:'Documentação parcial disponível'}); }
    else { F.push({t:'neg', txt:'Pouca documentação reunida — vale guardar comprovantes o quanto antes'}); }

    if(s.reacomodado==='nao'){ score+=1; F.push({t:'pos', txt:'Demora na reacomodação agrava a situação'}); }

    let tipoSujeitoSuspensao = (s.tipo==='atraso_cancel' || s.tipo==='conexao');
    if(s.causa==='externo'){
      score-=2;
      F.push({t:'neg', txt:'Alegação de força maior / fortuito externo pode reduzir ou afastar a responsabilidade (é controvertida)'});
      if(tipoSujeitoSuspensao){
        out.stf = {tipo:'stf', txt:'Atenção — STF Tema 1.417: desde 26/11/2025, estão suspensas nacionalmente as ações sobre responsabilidade por atraso, cancelamento ou alteração de voo por caso fortuito ou força maior (fortuito externo), até o julgamento do mérito (ARE 1.560.244, Rel. Min. Dias Toffoli). A suspensão não impede reunir provas e preparar o caso — apenas o julgamento fica sobrestado.'};
      } else {
        out.stf = {tipo:'ok', txt:'Bagagem e overbooking não são alcançados pela suspensão nacional do STF (Tema 1.417), que se restringe a atraso/cancelamento por força maior. O seu caso segue tramitação normal.'};
      }
    } else if(s.causa==='interno'){
      score+=1;
      F.push({t:'pos', txt:'Falha operacional da companhia (fortuito interno — manutenção, tripulação, malha) mantém a responsabilidade'});
      out.stf = {tipo:'ok', txt:'A causa alegada é falha interna da companhia (fortuito interno). Esse cenário não é alcançado pela suspensão do STF (Tema 1.417), que trata apenas de força maior / fortuito externo.'};
    }

    let forca = 'media';
    if(min===0 && max===0 && score<2){ forca='baixa'; }
    else if(score<=1){ forca='baixa'; }
    else if(score<=4){ forca='media'; }
    else { forca='alta'; }
    out.forca = forca;

    if(s.tipo==='atraso_cancel' && s.sub==='atraso' && s.atrasoDur==='lt4'){
      if(score>=3){ out.min=3000; out.max=8000; out.sit='Atraso de voo (agravado por outros fatores)'; }
    }

    if(out.max>out.min){
      if(forca==='alta') out.pos='Com os fatores assinalados, o caso tende ao topo da faixa.';
      else if(forca==='baixa') out.pos='Com os fatores assinalados, o caso tende ao piso da faixa (ou à improcedência).';
      else out.pos='Com os fatores assinalados, o caso tende à porção intermediária da faixa.';
    }

    out.base = baseLegal();
    out.docsRec = docsRecTxt();
    out.disc = 'Estimativa por regras orientativas, apenas para uma primeira leitura do caso. As faixas refletem valores praticados pelos tribunais (2025/2026) e não são garantidas: o valor efetivo depende das provas e das circunstâncias, e será sempre objeto de análise individual.';
    return out;
  };

  const situacaoLabel = () => {
    let s=state;
    if(s.tipo==='atraso_cancel') return s.sub==='cancelamento'?'Cancelamento de voo':(s.sub==='alteracao'?'Alteração unilateral de voo':'Atraso de voo');
    if(s.tipo==='conexao') return 'Conexão perdida / reacomodação';
    if(s.tipo==='overbooking') return 'Overbooking (preterição)';
    if(s.tipo==='bagagem') return s.sub==='extravio_def'?'Extravio definitivo de bagagem':(s.sub==='avaria'?'Dano/violação de bagagem':'Extravio temporário de bagagem');
    return 'Problema com voo';
  };

  const baseLegal = () => {
    let s=state;
    if(s.tipo==='atraso_cancel'){
      if(s.sub==='cancelamento') return 'Res. ANAC 400/2016, art. 21; CDC, arts. 14 e 20.';
      return 'Res. ANAC 400/2016, art. 21; CDC, art. 14.';
    }
    if(s.tipo==='conexao') return 'Res. ANAC 400/2016, art. 21; CDC, art. 14.';
    if(s.tipo==='overbooking') return 'Res. ANAC 400/2016, arts. 22 e 24; CDC, art. 6º.';
    if(s.tipo==='bagagem'){
      if(s.ambito==='internacional') return 'Voo internacional: Convenção de Montreal (Decreto 5.910/2006) para o dano material; CDC para o dano moral (STF, Tema 210). Res. ANAC 400/2016.';
      return 'CDC, art. 14; Res. ANAC 400/2016.';
    }
    return 'Res. ANAC 400/2016; CDC.';
  };

  const docsForTipo = () => {
    let common = [
      ['bilhete','Bilhete / e-ticket',''],
      ['embarque','Cartão de embarque',''],
      ['protocolo','Protocolo de reclamação','SAC, ouvidoria ou consumidor.gov'],
      ['prints','Prints / e-mails da companhia','']
    ];
    if(state.tipo==='bagagem'){
      return common.concat([
        ['rib','RIB — Registro de Irregularidade de Bagagem',''],
        ['fotos','Fotos da mala e dos itens',''],
        ['notas','Notas fiscais dos bens e das compras emergenciais','']
      ]);
    }
    return common.concat([
      ['despesasdoc','Comprovantes de despesas extras',''],
      ['fotos','Fotos / vídeos (painéis, filas)',''],
      ['compromisso','Comprovante do compromisso perdido','']
    ]);
  };
  const docsRecTxt = () => docsForTipo().map(d => d[1]).join(' · ');

  const DUR_ATRASO = [
    ['lt4','Menos de 4 horas','Em regra, tratado como mero dissabor'],
    ['4a8','Entre 4 e 8 horas',''],
    ['8a12','Entre 8 e 12 horas',''],
    ['gt12','Mais de 12 horas','']
  ];
  const DUR_TEMP = [
    ['ate24','Até 24 horas',''],
    ['24a72','De 24 a 72 horas',''],
    ['72a168','De 3 a 7 dias',''],
    ['gt168','Mais de 7 dias','Aproxima-se do extravio definitivo']
  ];

  const Opt = ({ label, sub, onClick, sel }) => (
    <button onClick={onClick} className={`diag-opt ${sel ? 'sel' : ''}`} style={{
      display: "flex", alignItems: "center", padding: "0.75rem 1rem",
      border: "1px solid " + (sel ? "var(--lex-gold)" : "var(--lex-border-light)"),
      borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease",
      background: sel ? "var(--lex-gold-bg)" : "var(--lex-white)", margin: 0, width: "100%", textAlign: "left", marginBottom: "0.5rem"
    }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid " + (sel ? "var(--lex-gold)" : "var(--lex-border-mid)"), marginRight: "0.75rem", position: "relative", flexShrink: 0 }}>
        {sel && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "8px", height: "8px", background: "var(--lex-gold)", borderRadius: "50%" }}></div>}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ color: "var(--lex-graphite)", fontSize: "0.95rem", fontWeight: 500 }}>{label}</span>
        {sub && <span style={{ color: "var(--lex-text-muted)", fontSize: "0.75rem", marginTop: "2px" }}>{sub}</span>}
      </div>
    </button>
  );

  const ChkOpt = ({ label, sub, checked, onClick }) => (
    <button onClick={onClick} className={`diag-opt ${checked ? 'sel' : ''}`} style={{
      display: "flex", alignItems: "center", padding: "0.75rem 1rem",
      border: "1px solid " + (checked ? "var(--lex-gold)" : "var(--lex-border-light)"),
      borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease",
      background: checked ? "var(--lex-gold-bg)" : "var(--lex-white)", margin: 0, width: "100%", textAlign: "left", marginBottom: "0.5rem"
    }}>
      <div style={{ width: 18, height: 18, borderRadius: "4px", border: "2px solid " + (checked ? "var(--lex-gold)" : "var(--lex-border-mid)"), background: checked ? "var(--lex-gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "0.75rem", flexShrink: 0 }}>
        {checked && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ color: "var(--lex-graphite)", fontSize: "0.95rem", fontWeight: 500 }}>{label}</span>
        {sub && <span style={{ color: "var(--lex-text-muted)", fontSize: "0.75rem", marginTop: "2px" }}>{sub}</span>}
      </div>
    </button>
  );

  const BackBtn = () => (
    <button onClick={goBack} style={{ background: "transparent", border: "none", color: "var(--lex-text-muted)", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", padding: 0 }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Voltar
    </button>
  );

  const StepFooter = () => (
    <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
      <span style={{ color: "var(--lex-text-muted)", fontSize: "0.75rem", display: "block" }}>Leva menos de 2 minutos • Análise inicial gratuita</span>
    </div>
  );

  const GoldBtn = ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="btn btn--primary" style={{ width: "100%", padding: "1rem", fontSize: "1rem", justifyContent: "center", background: disabled ? "#f3f4f6" : "var(--lex-gold)", color: disabled ? "#9ca3af" : "#111827", cursor: disabled ? "not-allowed" : "pointer", border: "none" }}>
      {children}
    </button>
  );

  const cardStyle = {
    width: "100%", maxWidth: 500,
    background: isEmbedded ? "transparent" : "var(--lex-white)",
    borderRadius: isEmbedded ? "0" : "20px", 
    padding: isEmbedded ? "0" : "2.5rem 2rem", 
    boxShadow: isEmbedded ? "none" : "0 20px 40px rgba(0,0,0,0.1)",
    border: isEmbedded ? "none" : "1px solid var(--lex-border-light)",
    color: "#1a1a1a"
  };

  const resultCardStyle = {
    ...cardStyle,
    maxHeight: "80vh",
    overflowY: "auto",
    overscrollBehavior: "contain",
  };

  if (showResult) {
    let r = computeResult();
    let waMsg = 'Olá! Usei a ferramenta de análise no site da LexAero e gostaria de falar sobre o meu caso.\n\nSituação: '+r.sit+'\nFaixa orientativa: '+(r.min===0&&r.max===0?'Tende a mero dissabor':faixaTxt(r.min,r.max))+'\nForça do caso: '+(r.forca==='alta'?'Força alta':r.forca==='media'?'Força média':'Força baixa')+'\n\n(Resultado orientativo — não é promessa de resultado.)';
    let waHref = 'https://wa.me/5531983259594?text='+encodeURIComponent(waMsg);

    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {/* Card externo: altura máxima + flex coluna */}
        <div ref={containerRef} style={{
          ...cardStyle,
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
          overflow: "hidden",
        }}>

          {/* ── Zona scrollável: tudo exceto os botões ── */}
          <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", paddingRight: "2px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ color: "var(--lex-gold)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Resultado Orientativo</span>
              <span style={{ padding: "0.2rem 0.65rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 700, background: r.forca==='alta'?'#dcfce7':r.forca==='media'?'#fef08a':'#fee2e2', color: r.forca==='alta'?'#166534':r.forca==='media'?'#854d0e':'#991b1b' }}>
                {r.forca==='alta'?'Força alta':r.forca==='media'?'Força média':'Força baixa'}
              </span>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.2rem" }}>{r.min===0&&r.max===0?'Orientação':'Faixa orientativa de dano moral'}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>{r.min===0&&r.max===0?'Tende a mero dissabor':faixaTxt(r.min,r.max)}</div>
              <div style={{ fontSize: "0.875rem", color: "#334155", fontWeight: 500 }}>{r.sit}</div>
              {r.pos && <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem" }}>{r.pos}</div>}
            </div>

            {r.stf && (
              <div style={{ background: r.stf.tipo==='stf'?'#fef2f2':'#f0fdf4', border: '1px solid', borderColor: r.stf.tipo==='stf'?'#fecaca':'#bbf7d0', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', color: r.stf.tipo==='stf'?'#991b1b':'#166534', lineHeight: 1.5 }} dangerouslySetInnerHTML={{__html: r.stf.txt}} />
            )}

            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem" }}>O que pesa no seu caso</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {r.factors.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.4rem", fontSize: "0.8rem", color: "#475569", lineHeight: 1.4 }}>
                    <div style={{ color: f.t==='pos'?'#16a34a':f.t==='neg'?'#dc2626':'#eab308', flexShrink: 0 }}>•</div>
                    <div>{f.txt}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>Base legal aplicável</h4>
              <div style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.5 }}>{r.base}</div>
              {r.compensacao && <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "0.4rem" }}><b>Compensação ANAC:</b> {r.compensacao}</div>}
              {r.materiais && <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "0.4rem" }}><b>Danos materiais:</b> {r.materiais}</div>}
            </div>

            <p style={{ fontSize: "0.7rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "0.5rem" }}>
              {r.disc}
            </p>

          </div>
          {/* ── Fim da zona scrollável ── */}

          {/* ── CTAs fixos no rodapé — sempre visíveis ── */}
          <div style={{ paddingTop: "0.875rem", borderTop: "1px solid #f1f5f9", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem", background: "#fff" }}>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => { if(typeof window !== 'undefined' && window.dataLayer) window.dataLayer.push({event: 'form_lead_gerado'}); }} style={{ width: "100%", padding: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "#25D366", color: "#fff", border: "none", borderRadius: "9999px", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Falar com especialista no WhatsApp
            </a>
            <button onClick={restart} style={{ width: "100%", padding: "0.6rem", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "9999px", color: "#94a3b8", cursor: "pointer", fontWeight: 500, fontSize: "0.8rem" }}>
              Refazer análise
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: 48, height: 48, border: "4px solid #f1f5f9", borderTopColor: "var(--lex-gold)", borderRadius: "50%", animation: "diag-spin 1s linear infinite" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>Analisando caso...</h2>
          <p style={{ color: "#64748b", textAlign: "center", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Cruzando informações com a jurisprudência atual.</p>
          <div style={{ background: "#e2e8f0", borderRadius: 8, height: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--lex-gold)", width: loadPct + "%", transition: "width 0.1s linear" }} />
          </div>
          <style dangerouslySetInnerHTML={{ __html: "@keyframes diag-spin { to { transform: rotate(360deg); } }" }} />
        </div>
      </div>
    );
  }

  const stepPct = ((step - 1) / TOTAL_STEPS) * 100;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {/* Card: altura máxima + flex coluna = conteúdo rola, botão fica fixo */}
      <div ref={containerRef} style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        overflow: "hidden",
      }}>

        {/* ── Cabeçalho fixo: título + barra de progresso ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.95rem" }}>Análise do seu voo</span>
            <span style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>Etapa {step} de {TOTAL_STEPS}</span>
          </div>
          <div style={{ width: "100%", height: "4px", background: "#e2e8f0", borderRadius: "4px", marginBottom: "1.25rem", overflow: "hidden" }}>
            <div style={{ width: stepPct + "%", height: "100%", background: "var(--lex-gold)", transition: "width 0.4s ease" }}></div>
          </div>
        </div>

        {/* ── Zona scrollável: perguntas e opções ── */}
        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", paddingRight: "2px" }}>

          {step === 1 && (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Seus dados</h3>
              <div style={{ marginBottom: "1rem" }}>
                <input type="text" placeholder="Seu nome" value={state.nome || ''} onChange={e => setField('nome', e.target.value.replace(/[0-9]/g, ''))} onBlur={() => upsertLead(step)} style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--lex-border-mid)", marginBottom: "0.5rem", fontSize: "1rem" }} />
                <input type="text" placeholder="Seu WhatsApp" value={state.whatsapp || ''} onChange={e => setField('whatsapp', e.target.value.replace(/[^0-9+\-() ]/g, ''))} onBlur={() => upsertLead(step)} style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--lex-border-mid)", fontSize: "1rem" }} />
              </div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Qual problema você enfrentou com o voo?</h3>
              <Opt label="Voo Atrasado ou Cancelado" sub="Atraso, cancelamento ou alteração unilateral" sel={state.tipo==='atraso_cancel'} onClick={() => setField("tipo", "atraso_cancel")} />
              <Opt label="Bagagem Extraviada ou avariada" sub="Extravio, dano, violação ou furto" sel={state.tipo==='bagagem'} onClick={() => setField("tipo", "bagagem")} />
              <Opt label="Overbooking" sub="Embarque negado por excesso de passageiros" sel={state.tipo==='overbooking'} onClick={() => setField("tipo", "overbooking")} />
              <Opt label="Conexão Perdida" sub="Perda de conexão por atraso/malha da companhia" sel={state.tipo==='conexao'} onClick={() => setField("tipo", "conexao")} />
            </div>
          )}

          {step === 2 && (
            <div>
              {state.tipo === 'atraso_cancel' && (
                <>
                  <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>O que aconteceu, exatamente?</h3>
                  <Opt label="Meu voo atrasou" sel={state.sub==='atraso'} onClick={() => setField("sub", "atraso")} />
                  <Opt label="Meu voo foi cancelado" sel={state.sub==='cancelamento'} onClick={() => setField("sub", "cancelamento")} />
                  <Opt label="A companhia alterou o voo sem meu acordo" sub="Mudança de horário, rota ou data" sel={state.sub==='alteracao'} onClick={() => setField("sub", "alteracao")} />
                  {state.sub === 'atraso' && (
                    <div style={{ marginTop: "1.25rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem", color: "#1e293b" }}>Quanto tempo de atraso até chegar ao destino final?</h4>
                      {DUR_ATRASO.map(d => <Opt key={d[0]} label={d[1]} sub={d[2]} sel={state.atrasoDur===d[0]} onClick={() => setField("atrasoDur", d[0])} />)}
                    </div>
                  )}
                </>
              )}
              {state.tipo === 'bagagem' && (
                <>
                  <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Qual foi o problema com a bagagem?</h3>
                  <Opt label="Extravio definitivo" sub="A bagagem não foi localizada / não voltou" sel={state.sub==='extravio_def'} onClick={() => setField("sub", "extravio_def")} />
                  <Opt label="Extravio temporário" sub="A bagagem atrasou, mas foi devolvida" sel={state.sub==='extravio_temp'} onClick={() => setField("sub", "extravio_temp")} />
                  <Opt label="Dano, violação ou furto" sub="Mala danificada ou itens subtraídos" sel={state.sub==='avaria'} onClick={() => setField("sub", "avaria")} />
                  {state.sub === 'extravio_temp' && (
                    <div style={{ marginTop: "1.25rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem", color: "#1e293b" }}>Por quanto tempo você ficou sem a bagagem?</h4>
                      {DUR_TEMP.map(d => <Opt key={d[0]} label={d[1]} sub={d[2]} sel={state.tempDur===d[0]} onClick={() => setField("tempDur", d[0])} />)}
                    </div>
                  )}
                </>
              )}
              {state.tipo === 'overbooking' && (
                <>
                  <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>Sobre o embarque negado</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>O overbooking (preterição) ocorre quando a companhia nega o embarque por excesso de passageiros.</p>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem", color: "#1e293b" }}>Você foi reacomodado(a) em outro voo em prazo razoável?</h4>
                  <Opt label="Sim, fui reacomodado(a) rapidamente" sel={state.reacomodado==='sim'} onClick={() => setField("reacomodado", "sim")} />
                  <Opt label="Não, fiquei muito tempo sem solução" sel={state.reacomodado==='nao'} onClick={() => setField("reacomodado", "nao")} />
                </>
              )}
              {state.tipo === 'conexao' && (
                <>
                  <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>Quanto tempo de atraso até chegar ao destino final?</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>Considere o tempo total de atraso causado pela perda da conexão.</p>
                  {DUR_ATRASO.map(d => <Opt key={d[0]} label={d[1]} sub={d[2]} sel={state.atrasoDur===d[0]} onClick={() => setField("atrasoDur", d[0])} />)}
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>O voo era doméstico ou internacional?</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>Isso define a base legal aplicável (CDC e/ou Convenção de Montreal).</p>
              <Opt label="Doméstico" sub="Trechos dentro do Brasil" sel={state.ambito==='domestico'} onClick={() => setField("ambito", "domestico")} />
              <Opt label="Internacional" sub="Origem ou destino no exterior" sel={state.ambito==='internacional'} onClick={() => setField("ambito", "internacional")} />
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>A companhia prestou assistência material?</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>Comunicação, alimentação e hospedagem conforme o tempo de espera (Res. ANAC 400).</p>
              <Opt label="Sim, prestou adequadamente" sel={state.assist==='sim'} onClick={() => setField("assist", "sim")} />
              <Opt label="Prestou apenas em parte" sel={state.assist==='parcial'} onClick={() => setField("assist", "parcial")} />
              <Opt label="Não prestou assistência" sub="Costuma agravar o dano moral" sel={state.assist==='nao'} onClick={() => setField("assist", "nao")} />
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>Algum destes fatores esteve presente?</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>Pode marcar mais de um, ou nenhum.</p>
              <ChkOpt label="Perda de compromisso importante" sub="Reunião, prova, evento, cruzeiro, conexão internacional" checked={state.agravantes.includes('perda_compromisso')} onClick={() => toggleMulti("agravantes", "perda_compromisso")} />
              <ChkOpt label="Passageiro em situação de vulnerabilidade" sub="Idoso, criança, gestante, PcD ou pessoa enferma" checked={state.agravantes.includes('hipervulnerabilidade')} onClick={() => toggleMulti("agravantes", "hipervulnerabilidade")} />
              <ChkOpt label="Tive despesas extras comprovadas" sub="Hospedagem, transporte, alimentação, compras" checked={state.agravantes.includes('despesas')} onClick={() => toggleMulti("agravantes", "despesas")} />
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Qual motivo a companhia alegou?</h3>
              <Opt label="Falha da própria companhia" sub="Manutenção, tripulação, malha aérea, problema operacional" sel={state.causa==='interno'} onClick={() => setField("causa", "interno")} />
              <Opt label="Força maior / fortuito externo" sub="Clima, fechamento de aeroporto, causas alheias à empresa" sel={state.causa==='externo'} onClick={() => setField("causa", "externo")} />
              <Opt label="Não sei / não foi informado" sel={state.causa==='nao_informado'} onClick={() => setField("causa", "nao_informado")} />
              <div style={{ marginTop: "1.25rem" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem", color: "#1e293b" }}>A companhia alegou que a culpa foi exclusivamente sua?</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>Ex.: chegada após o fechamento do check-in.</p>
                <Opt label="Não" sel={state.culpa==='nao'} onClick={() => setField("culpa", "nao")} />
                <Opt label="Sim" sel={state.culpa==='sim'} onClick={() => setField("culpa", "sim")} />
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>Quais documentos você já tem?</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>Não é obrigatório ter todos agora — isso ajuda a medir a força do caso. Marque o que possui.</p>
              {docsForTipo().map(d => (
                <ChkOpt key={d[0]} label={d[1]} sub={d[2]} checked={state.docs.includes(d[0])} onClick={() => toggleMulti("docs", d[0])} />
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={state.term1}
                    onChange={(e) => setField("term1", e.target.checked)}
                    style={{ marginTop: "4px", accentColor: "var(--lex-gold)", width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.4 }}>
                    Li e concordo com a Política de Privacidade e o Termo de Consentimento.
                  </span>
                </label>
                
                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={state.term2}
                    onChange={(e) => setField("term2", e.target.checked)}
                    style={{ marginTop: "4px", accentColor: "var(--lex-gold)", width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.4 }}>
                    Autorizo a LexAero a entrar em contato comigo pelo WhatsApp e/ou telefone informado neste formulário para tratar da solicitação enviada.
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={state.term3}
                    onChange={(e) => setField("term3", e.target.checked)}
                    style={{ marginTop: "4px", accentColor: "var(--lex-gold)", width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.4 }}>
                    Estou ciente de que o envio das informações não garante a existência de direito à indenização ou qualquer resultado jurídico.
                  </span>
                </label>
              </div>
            </div>
          )}

        </div>
        {/* ── Fim da zona scrollável ── */}

        {/* ── Botão fixo no rodapé — sempre visível ── */}
        <div style={{ flexShrink: 0, paddingTop: "0.875rem", borderTop: "1px solid #f1f5f9", background: "#fff" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {step > 1 && <div style={{ flexShrink: 0 }}><BackBtn /></div>}
            <div style={{ flex: 1 }}><GoldBtn onClick={goNext} disabled={!stepValid()}>{step === TOTAL_STEPS ? 'Ver resultado' : 'Continuar'}</GoldBtn></div>
          </div>
          <StepFooter />
        </div>

      </div>
    </div>
  );
}

import QuickDiagnosticForm from "@/componentes/QuickDiagnosticForm";

export const metadata = {
  title: "Calcule Sua Indenização de Voo | Análise Gratuita LexAero",
  description: "Teve voo cancelado, atrasado ou bagagem extraviada? Descubra em 2 minutos se você tem direito a compensação financeira. Faça sua análise online agora mesmo.",
};

export default function DiagnosticoPage() {
  return (
    <main style={{
      width: "100%",
      minHeight: "100dvh",
      background: "#f8f7f4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      boxSizing: "border-box",
    }}>
      <QuickDiagnosticForm />
    </main>
  );
}

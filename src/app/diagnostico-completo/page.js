import DiagnosticForm from "@/componentes/DiagnosticForm";

// Diagnóstico completo (7 etapas) — link enviado pela Dra. Kareline aos clientes.
// Fora do menu e dos buscadores.
export const metadata = {
  title: "Diagnóstico Completo do Seu Caso | LexAero",
  description: "Questionário completo para análise do seu caso de direito do passageiro aéreo.",
  robots: { index: false, follow: false },
};

export default function DiagnosticoCompletoPage() {
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
      <DiagnosticForm />
    </main>
  );
}

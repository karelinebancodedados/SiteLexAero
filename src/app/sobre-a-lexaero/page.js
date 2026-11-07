import Link from "next/link";

export const metadata = {
  title: "Sobre a LexAero | Direito do Passageiro Aéreo",
  description: "Conheça a LexAero, boutique jurídica fundada por Kareline Staut e dedicada à defesa dos direitos dos passageiros aéreos.",
  alternates: { canonical: "/sobre-a-lexaero" },
};

export default function SobreLexAeroPage() {
  return (
    <main className="section bg-ivory" style={{ paddingTop: "7rem" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <span className="eyebrow">Direito do passageiro aéreo</span>
        <h1>Sobre a LexAero</h1>
        <p>
          Fundada por Kareline Staut, a LexAero é uma boutique jurídica dedicada à proteção dos direitos dos passageiros e à atuação em conflitos envolvendo o transporte aéreo.
        </p>

        <h2>Em quais situações atuamos</h2>
        <p>
          Avaliamos casos de atraso ou cancelamento de voo, perda de conexão, embarque negado, problemas de reacomodação, falta de assistência material, extravio e avaria de bagagem.
        </p>

        <h2>Como avaliamos cada caso</h2>
        <p>
          Reunimos os detalhes da viagem, os documentos disponíveis e as respostas da companhia aérea. A partir disso, explicamos quais direitos podem se aplicar, quais provas ajudam a esclarecer o ocorrido e quais próximos passos fazem sentido para o passageiro.
        </p>

        <Link href="/diagnostico" className="btn btn--primary">
          Iniciar diagnóstico
        </Link>
      </div>
    </main>
  );
}

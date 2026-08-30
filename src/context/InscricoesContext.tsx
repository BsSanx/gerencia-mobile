import { createContext, useContext, useState, ReactNode } from "react";
import eventosData from "../data/eventos.json";

export type StatusInscricao = "confirmada" | "espera" | "cancelada";

export type Inscricao = {
  id: string;
  eventoId: string;
  status: StatusInscricao;
  dataInscricao: string;
  posicaoFila?: number;
};

type InscricoesContextType = {
  inscricoes: Inscricao[];
  inscrever: (eventoId: string) => void;
  cancelar: (inscricaoId: string) => void;
  getInscricaoDoEvento: (eventoId: string) => Inscricao | undefined;
  getVagasOcupadas: (eventoId: string) => number;
};

const InscricoesContext = createContext<InscricoesContextType | undefined>(undefined);

export function InscricoesProvider({ children }: { children: ReactNode }) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  function getVagasOcupadas(eventoId: string) {
    const evento = eventosData.find((e) => e.id === eventoId);
    const baseInscritos = evento ? evento.inscritos : 0;
    const confirmadasNoApp = inscricoes.filter(
      (i) => i.eventoId === eventoId && i.status === "confirmada"
    ).length;
    return baseInscritos + confirmadasNoApp;
  }

  function inscrever(eventoId: string) {
    const evento = eventosData.find((e) => e.id === eventoId);
    if (!evento) return;

    const jaInscrito = inscricoes.find((i) => i.eventoId === eventoId && i.status !== "cancelada");
    if (jaInscrito) return;

    const vagasOcupadas = getVagasOcupadas(eventoId);
    const temVaga = vagasOcupadas < evento.capacidade;

    const novaInscricao: Inscricao = {
      id: Date.now().toString(),
      eventoId,
      status: temVaga ? "confirmada" : "espera",
      dataInscricao: new Date().toISOString(),
      posicaoFila: temVaga
        ? undefined
        : inscricoes.filter((i) => i.eventoId === eventoId && i.status === "espera").length + 1,
    };

    setInscricoes((prev) => [...prev, novaInscricao]);
  }

  function cancelar(inscricaoId: string) {
    setInscricoes((prev) => {
      const alvo = prev.find((i) => i.id === inscricaoId);
      if (!alvo) return prev;

      const atualizadas = prev.map((i) =>
        i.id === inscricaoId ? { ...i, status: "cancelada" as StatusInscricao } : i
      );

      if (alvo.status === "confirmada") {
        const fila = atualizadas
          .filter((i) => i.eventoId === alvo.eventoId && i.status === "espera")
          .sort((a, b) => (a.posicaoFila ?? 0) - (b.posicaoFila ?? 0));

        if (fila.length > 0) {
          const proximo = fila[0];
          return atualizadas.map((i) =>
            i.id === proximo.id ? { ...i, status: "confirmada", posicaoFila: undefined } : i
          );
        }
      }

      return atualizadas;
    });
  }

  function getInscricaoDoEvento(eventoId: string) {
    return inscricoes.find((i) => i.eventoId === eventoId && i.status !== "cancelada");
  }

  return (
    <InscricoesContext.Provider value={{ inscricoes, inscrever, cancelar, getInscricaoDoEvento, getVagasOcupadas }}>
      {children}
    </InscricoesContext.Provider>
  );
}

export function useInscricoes() {
  const context = useContext(InscricoesContext);
  if (!context) {
    throw new Error("useInscricoes precisa ser usado dentro de um InscricoesProvider");
  }
  return context;
}
import { createContext, useContext, useState, ReactNode } from "react";
import eventosIniciais from "../data/eventos.json";

export type Evento = {
  id: string;
  nome: string;
  categoria: string;
  tipoEvento: string;
  dataInicio: string;
  dataFim: string;
  horario: string;
  local: string;
  capacidade: number;
  inscritos: number;
  codigo: string;
  descricao: string;
  status: string;
  valor: number;
};

type NovoEvento = Omit<Evento, "id" | "inscritos" | "codigo" | "status">;

type EventosContextType = {
  eventos: Evento[];
  criarEvento: (dados: NovoEvento) => void;
};

const EventosContext = createContext<EventosContextType | undefined>(undefined);

export function EventosProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>(eventosIniciais as Evento[]);

  function criarEvento(dados: NovoEvento) {
    const novo: Evento = {
      ...dados,
      id: Date.now().toString(),
      inscritos: 0,
      codigo: `EVT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      status: "ativo",
    };
    setEventos((prev) => [novo, ...prev]);
  }

  return (
    <EventosContext.Provider value={{ eventos, criarEvento }}>
      {children}
    </EventosContext.Provider>
  );
}

export function useEventos() {
  const context = useContext(EventosContext);
  if (!context) {
    throw new Error("useEventos precisa ser usado dentro de um EventosProvider");
  }
  return context;
}
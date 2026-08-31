import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";
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
  organizadorId?: string;
};

type NovoEvento = Omit<Evento, "id" | "inscritos" | "codigo" | "status" | "organizadorId">;

type EventosContextType = {
  eventos: Evento[];
  carregando: boolean;
  criarEvento: (dados: NovoEvento) => Promise<void>;
};

const EventosContext = createContext<EventosContextType | undefined>(undefined);

export function EventosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const ref = collection(db, "eventos");

    async function seedSeNecessario() {
      const snap = await getDocs(query(ref));
      if (snap.empty) {
        for (const ev of eventosIniciais as Evento[]) {
          const { id, ...dados } = ev;
          await addDoc(ref, dados);
        }
      }
    }

    seedSeNecessario();

    const unsubscribe = onSnapshot(ref, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Evento[];
      setEventos(lista);
      setCarregando(false);
    });

    return unsubscribe;
  }, []);

  async function criarEvento(dados: NovoEvento) {
    const ref = collection(db, "eventos");
    await addDoc(ref, {
      ...dados,
      inscritos: 0,
      codigo: `EVT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      status: "ativo",
      organizadorId: user?.uid ?? null,
    });
  }

  return (
    <EventosContext.Provider value={{ eventos, carregando, criarEvento }}>
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
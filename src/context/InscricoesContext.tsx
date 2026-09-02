import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Alert } from "react-native";
import { useNotificacoes } from "./NotificacoesContext";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";
import { useEventos } from "./EventosContext";

export type StatusInscricao = "confirmada" | "espera" | "cancelada";

export type Inscricao = {
  id: string;
  eventoId: string;
  usuarioId: string;
  status: StatusInscricao;
  dataInscricao: string;
  posicaoFila?: number;
  checkin?: string;
};

type InscricoesContextType = {
  inscricoes: Inscricao[];
  inscrever: (eventoId: string) => Promise<void>;
  cancelar: (inscricaoId: string) => Promise<void>;
  getInscricaoDoEvento: (eventoId: string) => Inscricao | undefined;
  fazerCheckin: (inscricaoId: string) => Promise<boolean>;
  podeFazerCheckin: (eventoId: string) => boolean;
};

const InscricoesContext = createContext<InscricoesContextType | undefined>(undefined);

function estaNoPeriodoDoEvento(dataInicio: string, dataFim: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicio = new Date(dataInicio + "T00:00:00");
  const fim = new Date(dataFim + "T23:59:59");
  return hoje >= inicio && hoje <= fim;
}

export function InscricoesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { eventos } = useEventos();
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const { adicionarNotificacao } = useNotificacoes();

  const eventosRef = useRef(eventos);
  useEffect(() => {
    eventosRef.current = eventos;
  }, [eventos]);

  const inscricoesAnterioresRef = useRef<Inscricao[]>([]);

  useEffect(() => {
    if (!user) {
      setInscricoes([]);
      inscricoesAnterioresRef.current = [];
      return;
    }
    const ref = collection(db, "inscricoes");
    const q = query(ref, where("usuarioId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Inscricao[];

      // Detecta promoção: estava "espera" e virou "confirmada" -> avisa o usuário
      lista.forEach((atual) => {
        const anterior = inscricoesAnterioresRef.current.find((i) => i.id === atual.id);
        if (anterior && anterior.status === "espera" && atual.status === "confirmada") {
          const evento = eventosRef.current.find((e) => e.id === atual.eventoId);
          const texto = `Você foi promovido da lista de espera. Sua inscrição em "${evento?.nome ?? "um evento"}" está confirmada.`;
          Alert.alert("Vaga liberada! 🎉", texto);
          adicionarNotificacao(texto);
        }
      });

      inscricoesAnterioresRef.current = lista;
      setInscricoes(lista);
    });
    return unsubscribe;
  }, [user]);

  async function inscrever(eventoId: string) {
    if (!user) return;
    const evento = eventos.find((e) => e.id === eventoId);
    if (!evento) return;

    const jaInscrito = inscricoes.find((i) => i.eventoId === eventoId && i.status !== "cancelada");
    if (jaInscrito) return;

    const inscricoesRef = collection(db, "inscricoes");
    const temVaga = evento.inscritos < evento.capacidade;

    if (temVaga) {
      await addDoc(inscricoesRef, {
        eventoId,
        usuarioId: user.uid,
        status: "confirmada",
        dataInscricao: new Date().toISOString(),
      });
      await updateDoc(doc(db, "eventos", eventoId), { inscritos: increment(1) });
    } else {
      const q = query(inscricoesRef, where("eventoId", "==", eventoId), where("status", "==", "espera"));
      const snap = await getDocs(q);
      await addDoc(inscricoesRef, {
        eventoId,
        usuarioId: user.uid,
        status: "espera",
        dataInscricao: new Date().toISOString(),
        posicaoFila: snap.size + 1,
      });
    }
  }

  async function cancelar(inscricaoId: string) {
    const alvo = inscricoes.find((i) => i.id === inscricaoId);
    if (!alvo) return;

    await updateDoc(doc(db, "inscricoes", inscricaoId), { status: "cancelada" });

    if (alvo.status === "confirmada") {
      await updateDoc(doc(db, "eventos", alvo.eventoId), { inscritos: increment(-1) });

      const inscricoesRef = collection(db, "inscricoes");
      const q = query(inscricoesRef, where("eventoId", "==", alvo.eventoId), where("status", "==", "espera"));
      const snap = await getDocs(q);
      const fila = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Inscricao)
        .sort((a, b) => (a.posicaoFila ?? 0) - (b.posicaoFila ?? 0));

      if (fila.length > 0) {
        const proximo = fila[0];
        await updateDoc(doc(db, "inscricoes", proximo.id), { status: "confirmada", posicaoFila: null });
        await updateDoc(doc(db, "eventos", alvo.eventoId), { inscritos: increment(1) });
      }
    }
  }

  function getInscricaoDoEvento(eventoId: string) {
    return inscricoes.find((i) => i.eventoId === eventoId && i.status !== "cancelada");
  }

  function podeFazerCheckin(eventoId: string) {
    const evento = eventos.find((e) => e.id === eventoId);
    if (!evento) return false;
    return estaNoPeriodoDoEvento(evento.dataInicio, evento.dataFim);
  }

  async function fazerCheckin(inscricaoId: string): Promise<boolean> {
    const alvo = inscricoes.find((i) => i.id === inscricaoId);
    if (!alvo || alvo.status !== "confirmada" || alvo.checkin) return false;
    if (!podeFazerCheckin(alvo.eventoId)) return false;

    await updateDoc(doc(db, "inscricoes", inscricaoId), { checkin: new Date().toISOString() });
    return true;
  }

  return (
    <InscricoesContext.Provider
      value={{ inscricoes, inscrever, cancelar, getInscricaoDoEvento, fazerCheckin, podeFazerCheckin }}
    >
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
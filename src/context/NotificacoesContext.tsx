import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

export type Notificacao = {
  id: string;
  destinatarioId: string;
  mensagem: string;
  criadaEm: string;
  lida: boolean;
};

type NotificacoesContextType = {
  notificacoes: Notificacao[];
  naoLidas: number;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
};

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    if (!user) {
      setNotificacoes([]);
      return;
    }
    const ref = collection(db, "notificacoes");
    const q = query(ref, where("destinatarioId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Notificacao[];
      lista.sort((a, b) => (a.criadaEm < b.criadaEm ? 1 : -1));
      setNotificacoes(lista);
    });
    return unsubscribe;
  }, [user]);

  async function marcarComoLida(id: string) {
    await updateDoc(doc(db, "notificacoes", id), { lida: true });
  }

  async function marcarTodasComoLidas() {
    await Promise.all(
      notificacoes.filter((n) => !n.lida).map((n) => updateDoc(doc(db, "notificacoes", n.id), { lida: true }))
    );
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <NotificacoesContext.Provider value={{ notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas }}>
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoes() {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error("useNotificacoes precisa ser usado dentro de um NotificacoesProvider");
  }
  return context;
}

// Função independente (não é um hook) — pode ser chamada de qualquer lugar do app
// para gravar uma notificação destinada a QUALQUER usuário, não só o que está logado agora.
export async function criarNotificacaoParaUsuario(destinatarioId: string, mensagem: string) {
  const ref = collection(db, "notificacoes");
  await addDoc(ref, {
    destinatarioId,
    mensagem,
    criadaEm: new Date().toISOString(),
    lida: false,
  });
}
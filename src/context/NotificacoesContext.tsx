import { createContext, useContext, useState, ReactNode } from "react";

export type Notificacao = {
  id: string;
  mensagem: string;
  criadaEm: string;
  lida: boolean;
};

type NotificacoesContextType = {
  notificacoes: Notificacao[];
  naoLidas: number;
  adicionarNotificacao: (mensagem: string) => void;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
};

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  function adicionarNotificacao(mensagem: string) {
    const nova: Notificacao = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      mensagem,
      criadaEm: new Date().toISOString(),
      lida: false,
    };
    setNotificacoes((prev) => [nova, ...prev]);
  }

  function marcarComoLida(id: string) {
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  function marcarTodasComoLidas() {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <NotificacoesContext.Provider
      value={{ notificacoes, naoLidas, adicionarNotificacao, marcarComoLida, marcarTodasComoLidas }}
    >
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
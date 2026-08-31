import { createContext, useContext, useState, ReactNode } from "react";

export type TipoUsuario = "cliente" | "organizador" | "admin";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm: string;
};

type UsuariosContextType = {
  usuarios: Usuario[];
  alternarStatus: (id: string) => void;
};

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

const USUARIOS_INICIAIS: Usuario[] = [
  { id: "1", nome: "Ana Paula Santos", email: "ana@email.com", tipo: "cliente", ativo: true, criadoEm: "2026-01-10" },
  { id: "2", nome: "Rafael Organizer", email: "rafael@techco.com.br", tipo: "organizador", ativo: true, criadoEm: "2026-01-15" },
  { id: "3", nome: "Carlos Eduardo Lima", email: "carlos@email.com", tipo: "cliente", ativo: true, criadoEm: "2026-01-20" },
  { id: "4", nome: "Maria Fernanda", email: "maria@eventos.com", tipo: "organizador", ativo: false, criadoEm: "2026-01-22" },
  { id: "5", nome: "Admin Master", email: "admin@gerencia.com", tipo: "admin", ativo: true, criadoEm: "2026-01-01" },
  { id: "6", nome: "Beatriz Oliveira", email: "beatriz@email.com", tipo: "cliente", ativo: true, criadoEm: "2026-01-25" },
  { id: "7", nome: "Lucas Monteiro", email: "lucas@confhub.com", tipo: "organizador", ativo: true, criadoEm: "2026-01-28" },
];

export function UsuariosProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_INICIAIS);

  function alternarStatus(id: string) {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u)));
  }

  return (
    <UsuariosContext.Provider value={{ usuarios, alternarStatus }}>
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuarios() {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error("useUsuarios precisa ser usado dentro de um UsuariosProvider");
  }
  return context;
}
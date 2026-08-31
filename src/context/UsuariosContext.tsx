import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

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
  carregando: boolean;
  alternarStatus: (id: string) => void;
};

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

export function UsuariosProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const ref = collection(db, "usuarios");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const lista = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          nome: data.nome ?? "",
          email: data.email ?? "",
          tipo: data.tipo ?? "cliente",
          ativo: data.ativo ?? true,
          criadoEm: data.criadoEm ?? "",
        } as Usuario;
      });
      setUsuarios(lista);
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  async function alternarStatus(id: string) {
    const alvo = usuarios.find((u) => u.id === id);
    if (!alvo) return;
    await updateDoc(doc(db, "usuarios", id), { ativo: !alvo.ativo });
  }

  return (
    <UsuariosContext.Provider value={{ usuarios, carregando, alternarStatus }}>
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
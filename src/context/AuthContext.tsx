import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export type TipoConta = "cliente" | "organizador" | "admin";

export type PerfilUsuario = {
  nome: string;
  email: string;
  tipo: TipoConta;
};

type AuthContextType = {
  user: User | null;
  perfil: PerfilUsuario | null;
  carregando: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setPerfil(null);
        setCarregando(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "usuarios", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setPerfil(snap.data() as PerfilUsuario);
      } else {
        // Conta criada antes desse recurso existir, sem documento no Firestore ainda — assume "cliente"
        setPerfil({ nome: user.displayName ?? "", email: user.email ?? "", tipo: "cliente" });
      }
      setCarregando(false);
    });
    return unsubscribe;
  }, [user]);

  return <AuthContext.Provider value={{ user, perfil, carregando }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
}
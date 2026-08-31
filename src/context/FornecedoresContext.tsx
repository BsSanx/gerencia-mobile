import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type Fornecedor = {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  categoria: string;
  responsavel: string;
  organizadorId?: string;
};

type NovoFornecedor = Omit<Fornecedor, "id" | "organizadorId">;

type FornecedoresContextType = {
  fornecedores: Fornecedor[];
  cadastrarFornecedor: (dados: NovoFornecedor) => void;
};

const FornecedoresContext = createContext<FornecedoresContextType | undefined>(undefined);

export function FornecedoresProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [todosFornecedores, setTodosFornecedores] = useState<Fornecedor[]>([]);

  function cadastrarFornecedor(dados: NovoFornecedor) {
    const novo: Fornecedor = { ...dados, id: Date.now().toString(), organizadorId: user?.uid };
    setTodosFornecedores((prev) => [novo, ...prev]);
  }

  const fornecedores = todosFornecedores.filter((f) => f.organizadorId === user?.uid);

  return (
    <FornecedoresContext.Provider value={{ fornecedores, cadastrarFornecedor }}>
      {children}
    </FornecedoresContext.Provider>
  );
}

export function useFornecedores() {
  const context = useContext(FornecedoresContext);
  if (!context) {
    throw new Error("useFornecedores precisa ser usado dentro de um FornecedoresProvider");
  }
  return context;
}
import { createContext, useContext, useState, ReactNode } from "react";

export type Fornecedor = {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  categoria: string;
  responsavel: string;
};

type NovoFornecedor = Omit<Fornecedor, "id">;

type FornecedoresContextType = {
  fornecedores: Fornecedor[];
  cadastrarFornecedor: (dados: NovoFornecedor) => void;
};

const FornecedoresContext = createContext<FornecedoresContextType | undefined>(undefined);

const FORNECEDORES_INICIAIS: Fornecedor[] = [
  {
    id: "1",
    nome: "SoundPro Audiovisual",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 99888-7766",
    categoria: "Audiovisual",
    responsavel: "João Carlos",
  },
  {
    id: "2",
    nome: "Gourmet Express Buffet",
    cnpj: "98.765.432/0001-10",
    telefone: "(11) 98765-4321",
    categoria: "Buffet",
    responsavel: "Marina Souza",
  },
  {
    id: "3",
    nome: "PhotoClick Eventos",
    cnpj: "55.444.333/0001-22",
    telefone: "(11) 97654-3210",
    categoria: "Fotografia",
    responsavel: "André Souza",
  },
];

export function FornecedoresProvider({ children }: { children: ReactNode }) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(FORNECEDORES_INICIAIS);

  function cadastrarFornecedor(dados: NovoFornecedor) {
    const novo: Fornecedor = { ...dados, id: Date.now().toString() };
    setFornecedores((prev) => [novo, ...prev]);
  }

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
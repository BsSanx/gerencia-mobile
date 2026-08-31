import { createContext, useContext, useState, ReactNode } from "react";

export type Contrato = {
  id: string;
  fornecedorId: string;
  eventoId: string;
  dataContrato: string;
  valorAdiantamento: number;
  valorTotal: number;
  nomeResponsavel: string;
  contatoResponsavel: string;
  objetivo: string;
  situacao: "ativo" | "encerrado";
};

type NovoContrato = Omit<Contrato, "id" | "situacao">;

type ContratosContextType = {
  contratos: Contrato[];
  criarContrato: (dados: NovoContrato) => void;
  getContratosDoFornecedor: (fornecedorId: string) => Contrato[];
};

const ContratosContext = createContext<ContratosContextType | undefined>(undefined);

const CONTRATOS_INICIAIS: Contrato[] = [
  {
    id: "1",
    fornecedorId: "1",
    eventoId: "1",
    dataContrato: "2026-07-10",
    valorAdiantamento: 3000,
    valorTotal: 12000,
    nomeResponsavel: "João Carlos",
    contatoResponsavel: "(11) 99888-7766",
    objetivo: "Locação e operação do sistema de som e projeção.",
    situacao: "ativo",
  },
];

export function ContratosProvider({ children }: { children: ReactNode }) {
  const [contratos, setContratos] = useState<Contrato[]>(CONTRATOS_INICIAIS);

  function criarContrato(dados: NovoContrato) {
    const novo: Contrato = { ...dados, id: Date.now().toString(), situacao: "ativo" };
    setContratos((prev) => [novo, ...prev]);
  }

  function getContratosDoFornecedor(fornecedorId: string) {
    return contratos.filter((c) => c.fornecedorId === fornecedorId);
  }

  return (
    <ContratosContext.Provider value={{ contratos, criarContrato, getContratosDoFornecedor }}>
      {children}
    </ContratosContext.Provider>
  );
}

export function useContratos() {
  const context = useContext(ContratosContext);
  if (!context) {
    throw new Error("useContratos precisa ser usado dentro de um ContratosProvider");
  }
  return context;
}
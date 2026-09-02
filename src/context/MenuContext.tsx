import { createContext, useContext, useState, ReactNode } from "react";

type MenuContextType = {
  aberto: boolean;
  abrirMenu: () => void;
  fecharMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <MenuContext.Provider value={{ aberto, abrirMenu: () => setAberto(true), fecharMenu: () => setAberto(false) }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu precisa ser usado dentro de um MenuProvider");
  }
  return context;
}
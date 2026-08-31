import { createContext, useContext, useState, ReactNode } from "react";

type FavoritosContextType = {
  favoritos: string[];
  alternarFavorito: (eventoId: string) => void;
  ehFavorito: (eventoId: string) => boolean;
};

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  function alternarFavorito(eventoId: string) {
    setFavoritos((prev) =>
      prev.includes(eventoId) ? prev.filter((id) => id !== eventoId) : [...prev, eventoId]
    );
  }

  function ehFavorito(eventoId: string) {
    return favoritos.includes(eventoId);
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, alternarFavorito, ehFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error("useFavoritos precisa ser usado dentro de um FavoritosProvider");
  }
  return context;
}
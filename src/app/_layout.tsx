import { Stack } from "expo-router";
import { InscricoesProvider } from "../context/InscricoesContext";
import { FavoritosProvider } from "../context/FavoritosContext";

export default function RootLayout() {
  return (
    <InscricoesProvider>
      <FavoritosProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FavoritosProvider>
    </InscricoesProvider>
  );
}
import { Stack } from "expo-router";
import { EventosProvider } from "../context/EventosContext";
import { InscricoesProvider } from "../context/InscricoesContext";
import { FavoritosProvider } from "../context/FavoritosContext";
import { FornecedoresProvider } from "../context/FornecedoresContext";

export default function RootLayout() {
  return (
    <EventosProvider>
      <InscricoesProvider>
        <FavoritosProvider>
          <FornecedoresProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </FornecedoresProvider>
        </FavoritosProvider>
      </InscricoesProvider>
    </EventosProvider>
  );
}
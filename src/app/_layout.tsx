import { Stack } from "expo-router";
import { EventosProvider } from "../context/EventosContext";
import { InscricoesProvider } from "../context/InscricoesContext";
import { FavoritosProvider } from "../context/FavoritosContext";

export default function RootLayout() {
  return (
    <EventosProvider>
      <InscricoesProvider>
        <FavoritosProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </FavoritosProvider>
      </InscricoesProvider>
    </EventosProvider>
  );
}
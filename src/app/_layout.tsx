import { Stack } from "expo-router";
import { EventosProvider } from "../context/EventosContext";
import { InscricoesProvider } from "../context/InscricoesContext";
import { FavoritosProvider } from "../context/FavoritosContext";
import { FornecedoresProvider } from "../context/FornecedoresContext";
import { ContratosProvider } from "../context/ContratosContext";
import { UsuariosProvider } from "../context/UsuariosContext";

export default function RootLayout() {
  return (
    <EventosProvider>
      <InscricoesProvider>
        <FavoritosProvider>
          <FornecedoresProvider>
            <ContratosProvider>
              <UsuariosProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </UsuariosProvider>
            </ContratosProvider>
          </FornecedoresProvider>
        </FavoritosProvider>
      </InscricoesProvider>
    </EventosProvider>
  );
}
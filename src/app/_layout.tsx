import { Stack } from "expo-router";
import { InscricoesProvider } from "../context/InscricoesContext";

export default function RootLayout() {
  return (
    <InscricoesProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </InscricoesProvider>
  );
}
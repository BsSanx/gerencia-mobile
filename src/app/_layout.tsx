import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificacoesProvider } from "../context/NotificacoesContext";
import { EventosProvider } from "../context/EventosContext";
import { InscricoesProvider } from "../context/InscricoesContext";
import { FavoritosProvider } from "../context/FavoritosContext";
import { FornecedoresProvider } from "../context/FornecedoresContext";
import { ContratosProvider } from "../context/ContratosContext";
import { UsuariosProvider } from "../context/UsuariosContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, carregando } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const rotaPublica = segments[0] === "login" || segments[0] === "cadastro" || segments[0] === "recuperar-senha";

  useEffect(() => {
    if (carregando) return;
    if (!user && !rotaPublica) {
      router.replace("/login");
    }
  }, [user, carregando, rotaPublica]);

  if (carregando || (!user && !rotaPublica)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificacoesProvider>
          <EventosProvider>
            <InscricoesProvider>
              <FavoritosProvider>
                <FornecedoresProvider>
                  <ContratosProvider>
                    <UsuariosProvider>
                      <AuthGate>
                        <Stack screenOptions={{ headerShown: false }} />
                      </AuthGate>
                    </UsuariosProvider>
                  </ContratosProvider>
                </FornecedoresProvider>
              </FavoritosProvider>
            </InscricoesProvider>
          </EventosProvider>
        </NotificacoesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});
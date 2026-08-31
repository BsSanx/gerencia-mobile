import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useFavoritos } from "../context/FavoritosContext";

export default function HomeScreen() {
  const router = useRouter();
  const { eventos, carregando } = useEventos();
  const { ehFavorito, alternarFavorito } = useFavoritos();

  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Descubra novos eventos</Text>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: "/evento/[id]", params: { id: item.id } })}
          >
            <View style={styles.cardTopo}>
              <Text style={styles.categoria}>{item.categoria}</Text>
              <Pressable onPress={() => alternarFavorito(item.id)} hitSlop={8}>
                <Text style={styles.coracao}>{ehFavorito(item.id) ? "♥" : "♡"}</Text>
              </Pressable>
            </View>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.local}>{item.local}</Text>
            <Text style={styles.data}>
              {item.dataInicio} · {item.horario}
            </Text>
            <Text style={styles.vagas}>
              {item.inscritos}/{item.capacidade} inscritos
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: "#fff" },
  carregandoContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  lista: { gap: 12, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 14 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoria: { color: "#2563eb", fontWeight: "600", fontSize: 12 },
  coracao: { color: "#dc2626", fontSize: 18 },
  nome: { fontSize: 16, fontWeight: "bold", marginTop: 4, marginBottom: 2 },
  local: { color: "#6b7280", marginBottom: 2 },
  data: { color: "#6b7280", marginBottom: 4 },
  vagas: { fontSize: 13, color: "#111827" },
});
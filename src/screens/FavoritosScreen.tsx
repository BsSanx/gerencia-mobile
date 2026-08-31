import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useFavoritos } from "../context/FavoritosContext";

export default function FavoritosScreen() {
  const { eventos } = useEventos();
  const { favoritos, alternarFavorito } = useFavoritos();
  const router = useRouter();

  const eventosFavoritos = eventos.filter((e) => favoritos.includes(e.id));

  if (eventosFavoritos.length === 0) {
    return (
      <View style={styles.vazioContainer}>
        <Text style={styles.vazioTitulo}>Nenhum favorito ainda</Text>
        <Text style={styles.vazioTexto}>Toque no coração de um evento na Início para salvá-lo aqui.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Favoritos</Text>
      <FlatList
        data={eventosFavoritos}
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
                <Text style={styles.coracao}>♥</Text>
              </Pressable>
            </View>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.local}>{item.local}</Text>
            <Text style={styles.data}>
              {item.dataInicio} · {item.horario}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  lista: { gap: 12, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 14 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoria: { color: "#2563eb", fontWeight: "600", fontSize: 12 },
  coracao: { color: "#dc2626", fontSize: 18 },
  nome: { fontSize: 16, fontWeight: "bold", marginTop: 4, marginBottom: 2 },
  local: { color: "#6b7280", marginBottom: 2 },
  data: { color: "#6b7280" },
  vazioContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, backgroundColor: "#fff" },
  vazioTitulo: { fontSize: 17, fontWeight: "bold", marginBottom: 6 },
  vazioTexto: { color: "#6b7280", textAlign: "center" },
});
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import eventos from "../data/eventos.json";

export default function HomeScreen() {
  const router = useRouter();

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
            <Text style={styles.categoria}>{item.categoria}</Text>
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
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  lista: { gap: 12, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 14 },
  categoria: { color: "#2563eb", fontWeight: "600", fontSize: 12, marginBottom: 4 },
  nome: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  local: { color: "#6b7280", marginBottom: 2 },
  data: { color: "#6b7280", marginBottom: 4 },
  vagas: { fontSize: 13, color: "#111827" },
});
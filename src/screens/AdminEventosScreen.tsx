import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";

export default function AdminEventosScreen() {
  const router = useRouter();
  const { eventos } = useEventos();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <Text style={styles.titulo}>Todos os Eventos</Text>
      <Text style={styles.subtitulo}>{eventos.length} na plataforma</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopo}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={item.status === "ativo" ? styles.statusAtivo : styles.statusOutro}>
                {item.status === "ativo" ? "Ativo" : item.status}
              </Text>
            </View>
            <Text style={styles.detalhe}>
              {item.categoria} · {item.dataInicio}
            </Text>
            <Text style={styles.detalhe}>{item.local}</Text>
            <Text style={styles.vagas}>
              {item.inscritos}/{item.capacidade} vagas
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#111827", fontSize: 15 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", marginBottom: 16 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  nome: { fontWeight: "bold", fontSize: 15, flexShrink: 1 },
  statusAtivo: { color: "#16a34a", fontWeight: "700", fontSize: 12 },
  statusOutro: { color: "#9ca3af", fontWeight: "700", fontSize: 12 },
  detalhe: { color: "#6b7280", fontSize: 13 },
  vagas: { fontSize: 13, fontWeight: "600", marginTop: 4, color: "#111827" },
});
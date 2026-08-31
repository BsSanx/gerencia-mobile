import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import OrganizadorNav from "../components/OrganizadorNav";

export default function OrganizadorDashboardScreen() {
  const router = useRouter();
  const { eventos } = useEventos();

  const totalInscritos = eventos.reduce((soma, e) => soma + e.inscritos, 0);
  const eventosAtivos = eventos.filter((e) => e.status === "ativo").length;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <Text style={styles.titulo}>Dashboard</Text>
      <Text style={styles.subtitulo}>Visão geral dos seus eventos</Text>

      <OrganizadorNav />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{eventosAtivos}</Text>
          <Text style={styles.statLabel}>Eventos ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{totalInscritos}</Text>
          <Text style={styles.statLabel}>Total de inscritos</Text>
        </View>
      </View>

      <View style={styles.listaTopo}>
        <Text style={styles.secaoTitulo}>Meus Eventos</Text>
        <Pressable style={styles.botaoCriar} onPress={() => router.push("/organizador/criar-evento")}>
          <Text style={styles.botaoCriarTexto}>+ Criar evento</Text>
        </Pressable>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>
              {item.dataInicio} · {item.local}
            </Text>
            <Text style={styles.ocupacao}>
              {item.inscritos}/{item.capacidade} inscritos
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
  voltarTexto: { color: "#7c3aed", fontSize: 15 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", marginBottom: 16 },
  statsContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#f5f3ff", borderRadius: 12, padding: 14 },
  statValor: { fontSize: 24, fontWeight: "bold", color: "#7c3aed" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  listaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold" },
  botaoCriar: { backgroundColor: "#7c3aed", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  botaoCriarTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12 },
  nome: { fontWeight: "bold", fontSize: 15, marginBottom: 2 },
  detalhe: { color: "#6b7280", fontSize: 13, marginBottom: 2 },
  ocupacao: { fontSize: 13, color: "#111827" },
});
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { colors, shadow } from "../theme/colors";

export default function AdminEventosScreen() {
  const router = useRouter();
  const { eventos } = useEventos();

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeTexto}>🛡️</Text>
        </View>
        <View>
          <Text style={styles.headerTitulo}>GerenCIA</Text>
          <Text style={styles.headerSubtitulo}>Painel Administrativo</Text>
        </View>
      </View>

      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Todos os Eventos</Text>
        <Text style={styles.subtitulo}>{eventos.length} na plataforma</Text>

        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, shadow]}
              onPress={() => router.push({ pathname: "/admin/eventos/[id]", params: { id: item.id } })}
            >
              <View style={styles.cardTopo}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === "ativo" ? colors.greenLight : colors.bg }]}>
                  <Text style={[styles.statusTexto, { color: item.status === "ativo" ? colors.green : colors.textSecondary }]}>
                    {item.status === "ativo" ? "Ativo" : item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.detalhe}>
                {item.categoria} · {item.dataInicio}
              </Text>
              <Text style={styles.detalhe}>{item.local}</Text>
              <Text style={styles.vagas}>
                {item.inscritos}/{item.capacidade} vagas
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.navy,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  iconBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  iconBadgeTexto: { fontSize: 18 },
  headerTitulo: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  headerSubtitulo: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  voltar: { marginTop: 16, marginLeft: 16 },
  voltarTexto: { color: colors.textPrimary, fontSize: 15 },
  conteudo: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, marginBottom: 16 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  nome: { fontWeight: "bold", fontSize: 15, flexShrink: 1, color: colors.textPrimary },
  statusBadge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  statusTexto: { fontWeight: "700", fontSize: 11 },
  detalhe: { color: colors.textSecondary, fontSize: 13 },
  vagas: { fontSize: 13, fontWeight: "600", marginTop: 4, color: colors.textPrimary },
});
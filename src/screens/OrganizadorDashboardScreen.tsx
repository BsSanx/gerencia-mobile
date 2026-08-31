import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useAuth } from "../context/AuthContext";
import OrganizadorNav from "../components/OrganizadorNav";
import { colors, shadow } from "../theme/colors";

export default function OrganizadorDashboardScreen() {
  const router = useRouter();
  const { eventos } = useEventos();
  const { user } = useAuth();

  const meusEventos = eventos.filter((e) => e.organizadorId === user?.uid);
  const totalInscritos = meusEventos.reduce((soma, e) => soma + e.inscritos, 0);
  const eventosAtivos = meusEventos.filter((e) => e.status === "ativo").length;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeTexto}>📊</Text>
        </View>
        <View>
          <Text style={styles.headerTitulo}>GerenCIA</Text>
          <Text style={styles.headerSubtitulo}>Painel do Organizador</Text>
        </View>
      </View>

      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <OrganizadorNav />

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.purpleLight }]}>
          <View style={[styles.statIcone, { backgroundColor: colors.purple }]}>
            <Text style={styles.statIconeTexto}>📅</Text>
          </View>
          <Text style={[styles.statValor, { color: colors.purple }]}>{eventosAtivos}</Text>
          <Text style={styles.statLabel}>Eventos ativos</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.blueLight }]}>
          <View style={[styles.statIcone, { backgroundColor: colors.blue }]}>
            <Text style={styles.statIconeTexto}>👥</Text>
          </View>
          <Text style={[styles.statValor, { color: colors.blue }]}>{totalInscritos}</Text>
          <Text style={styles.statLabel}>Total de inscritos</Text>
        </View>
      </View>

      <View style={styles.listaTopo}>
        <Text style={styles.secaoTitulo}>Meus Eventos</Text>
        <Pressable style={styles.botaoCriar} onPress={() => router.push("/organizador/criar-evento")}>
          <Text style={styles.botaoCriarTexto}>+ Criar evento</Text>
        </Pressable>
      </View>

      {meusEventos.length === 0 ? (
        <Text style={styles.vazioTexto}>Você ainda não criou nenhum evento.</Text>
      ) : (
        <FlatList
          data={meusEventos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={[styles.card, shadow]}>
              <View style={styles.cardBarra} />
              <View style={styles.cardConteudo}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.detalhe}>
                  {item.dataInicio} · {item.local}
                </Text>
                <Text style={styles.ocupacao}>
                  {item.inscritos}/{item.capacidade} inscritos
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" },
  iconBadgeTexto: { fontSize: 18 },
  headerTitulo: { fontSize: 16, fontWeight: "bold", color: colors.textPrimary },
  headerSubtitulo: { fontSize: 12, color: colors.textSecondary },
  voltar: { marginTop: 16, marginLeft: 16 },
  voltarTexto: { color: colors.purple, fontSize: 15 },
  statsContainer: { flexDirection: "row", gap: 12, marginTop: 16, paddingHorizontal: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 16 },
  statIcone: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  statIconeTexto: { fontSize: 14 },
  statValor: { fontSize: 24, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  listaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12, paddingHorizontal: 16 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold", color: colors.textPrimary },
  botaoCriar: { backgroundColor: colors.purple, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  botaoCriarTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  vazioTexto: { color: colors.textSecondary, fontSize: 14, paddingHorizontal: 16 },
  lista: { gap: 10, paddingHorizontal: 16, paddingBottom: 24 },
  card: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 12, overflow: "hidden" },
  cardBarra: { width: 4, backgroundColor: colors.purple },
  cardConteudo: { flex: 1, padding: 12 },
  nome: { fontWeight: "bold", fontSize: 15, marginBottom: 2, color: colors.textPrimary },
  detalhe: { color: colors.textSecondary, fontSize: 13, marginBottom: 2 },
  ocupacao: { fontSize: 13, color: colors.textPrimary },
});
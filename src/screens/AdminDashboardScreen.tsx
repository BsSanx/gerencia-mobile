import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useUsuarios } from "../context/UsuariosContext";
import { colors, shadow } from "../theme/colors";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { eventos } = useEventos();
  const { usuarios } = useUsuarios();

  const organizadoresAtivos = usuarios.filter((u) => u.tipo === "organizador" && u.ativo).length;
  const totalInscricoes = eventos.reduce((soma, e) => soma + e.inscritos, 0);

  const porCategoria = eventos.reduce<Record<string, number>>((acc, e) => {
    acc[e.categoria] = (acc[e.categoria] ?? 0) + 1;
    return acc;
  }, {});
  const categorias = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);

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
        <Text style={styles.titulo}>Dashboard Administrativo</Text>
        <Text style={styles.subtitulo}>Visão geral da plataforma</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.blueLight }]}>
            <View style={[styles.statIcone, { backgroundColor: colors.blue }]}>
              <Text style={styles.statIconeTexto}>👥</Text>
            </View>
            <Text style={[styles.statValor, { color: colors.blue }]}>{usuarios.length}</Text>
            <Text style={styles.statLabel}>Total de usuários</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.purpleLight }]}>
            <View style={[styles.statIcone, { backgroundColor: colors.purple }]}>
              <Text style={styles.statIconeTexto}>🏢</Text>
            </View>
            <Text style={[styles.statValor, { color: colors.purple }]}>{organizadoresAtivos}</Text>
            <Text style={styles.statLabel}>Organizadores ativos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.greenLight }]}>
            <View style={[styles.statIcone, { backgroundColor: colors.green }]}>
              <Text style={styles.statIconeTexto}>📅</Text>
            </View>
            <Text style={[styles.statValor, { color: colors.green }]}>{eventos.length}</Text>
            <Text style={styles.statLabel}>Eventos na plataforma</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.amberLight }]}>
            <View style={[styles.statIcone, { backgroundColor: colors.amber }]}>
              <Text style={styles.statIconeTexto}>📈</Text>
            </View>
            <Text style={[styles.statValor, { color: colors.amber }]}>{totalInscricoes}</Text>
            <Text style={styles.statLabel}>Total de inscrições</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Eventos por categoria</Text>
        <View style={[styles.categoriasCard, shadow]}>
          <FlatList
            data={categorias}
            keyExtractor={([cat]) => cat}
            scrollEnabled={false}
            renderItem={({ item: [cat, qtd] }) => (
              <View style={styles.categoriaLinha}>
                <Text style={styles.categoriaNome}>{cat}</Text>
                <Text style={styles.categoriaQtd}>{qtd}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.menuContainer}>
          <Pressable style={[styles.menuItem, shadow]} onPress={() => router.push("/admin/usuarios")}>
            <Text style={styles.menuItemTexto}>Usuários</Text>
          </Pressable>
          <Pressable style={[styles.menuItem, shadow]} onPress={() => router.push("/admin/eventos")}>
            <Text style={styles.menuItemTexto}>Todos os Eventos</Text>
          </Pressable>
        </View>
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
  conteudo: { paddingHorizontal: 16, paddingTop: 16 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statCard: { width: "47%", borderRadius: 14, padding: 14 },
  statIcone: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statIconeTexto: { fontSize: 13 },
  statValor: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: colors.textPrimary },
  categoriasCard: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 20 },
  categoriaLinha: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  categoriaNome: { fontSize: 14, color: colors.textPrimary },
  categoriaQtd: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  menuContainer: { flexDirection: "row", gap: 10 },
  menuItem: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, alignItems: "center" },
  menuItemTexto: { fontWeight: "600", fontSize: 13, color: colors.textPrimary },
});
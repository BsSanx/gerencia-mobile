import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useUsuarios } from "../context/UsuariosContext";

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
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <Text style={styles.titulo}>Dashboard Administrativo</Text>
      <Text style={styles.subtitulo}>Visão geral da plataforma</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{usuarios.length}</Text>
          <Text style={styles.statLabel}>Total de usuários</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{organizadoresAtivos}</Text>
          <Text style={styles.statLabel}>Organizadores ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{eventos.length}</Text>
          <Text style={styles.statLabel}>Eventos na plataforma</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{totalInscricoes}</Text>
          <Text style={styles.statLabel}>Total de inscrições</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Eventos por categoria</Text>
      <FlatList
        data={categorias}
        keyExtractor={([cat]) => cat}
        scrollEnabled={false}
        style={styles.listaCategorias}
        renderItem={({ item: [cat, qtd] }) => (
          <View style={styles.categoriaLinha}>
            <Text style={styles.categoriaNome}>{cat}</Text>
            <Text style={styles.categoriaQtd}>{qtd}</Text>
          </View>
        )}
      />

      <View style={styles.menuContainer}>
        <Pressable style={styles.menuItem} onPress={() => router.push("/admin/usuarios")}>
          <Text style={styles.menuItemTexto}>Usuários</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push("/admin/eventos")}>
          <Text style={styles.menuItemTexto}>Todos os Eventos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#111827", fontSize: 15 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statCard: { width: "47%", backgroundColor: "#f9fafb", borderRadius: 12, padding: 14 },
  statValor: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  listaCategorias: { marginBottom: 20 },
  categoriaLinha: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  categoriaNome: { fontSize: 14, color: "#374151" },
  categoriaQtd: { fontSize: 14, fontWeight: "700" },
  menuContainer: { flexDirection: "row", gap: 10 },
  menuItem: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, alignItems: "center" },
  menuItemTexto: { fontWeight: "600", fontSize: 13 },
});
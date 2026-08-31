import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import OrganizadorNav from "../components/OrganizadorNav";
import { colors, shadow } from "../theme/colors";

export default function OrganizadorFornecedoresScreen() {
  const router = useRouter();
  const { fornecedores } = useFornecedores();

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

      <View style={styles.conteudo}>
        <OrganizadorNav />

        <View style={styles.topo}>
          <View>
            <Text style={styles.titulo}>Fornecedores</Text>
            <Text style={styles.subtitulo}>{fornecedores.length} cadastrados</Text>
          </View>
          <Pressable style={styles.botaoCadastrar} onPress={() => router.push("/organizador/fornecedores/cadastrar")}>
            <Text style={styles.botaoCadastrarTexto}>+ Cadastrar</Text>
          </Pressable>
        </View>

        <FlatList
          data={fornecedores}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, shadow]}
              onPress={() =>
                router.push({ pathname: "/organizador/fornecedores/[id]", params: { id: item.id } })
              }
            >
              <View style={styles.cardTopo}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={styles.categoriaBadge}>
                  <Text style={styles.categoriaTexto}>{item.categoria}</Text>
                </View>
              </View>
              <Text style={styles.detalhe}>{item.cnpj}</Text>
              <Text style={styles.detalhe}>
                {item.telefone} · {item.responsavel}
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
  conteudo: { paddingHorizontal: 16, paddingTop: 16, flex: 1 },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, fontSize: 13 },
  botaoCadastrar: { backgroundColor: colors.purple, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  botaoCadastrarTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  nome: { fontWeight: "bold", fontSize: 15, color: colors.textPrimary, flexShrink: 1 },
  categoriaBadge: { backgroundColor: colors.purpleLight, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  categoriaTexto: { fontSize: 11, color: colors.purple, fontWeight: "700" },
  detalhe: { color: colors.textSecondary, fontSize: 13 },
});
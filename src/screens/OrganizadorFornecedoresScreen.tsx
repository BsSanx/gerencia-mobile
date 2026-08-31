import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import OrganizadorNav from "../components/OrganizadorNav";

export default function OrganizadorFornecedoresScreen() {
  const router = useRouter();
  const { fornecedores } = useFornecedores();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

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
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/organizador/fornecedores/[id]", params: { id: item.id } })
            }
          >
            <View style={styles.cardTopo}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.categoria}>{item.categoria}</Text>
            </View>
            <Text style={styles.detalhe}>{item.cnpj}</Text>
            <Text style={styles.detalhe}>
              {item.telefone} · {item.responsavel}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#7c3aed", fontSize: 15 },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", fontSize: 13 },
  botaoCadastrar: { backgroundColor: "#7c3aed", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  botaoCadastrarTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  nome: { fontWeight: "bold", fontSize: 15 },
  categoria: { fontSize: 11, color: "#7c3aed", fontWeight: "600" },
  detalhe: { color: "#6b7280", fontSize: 13 },
});
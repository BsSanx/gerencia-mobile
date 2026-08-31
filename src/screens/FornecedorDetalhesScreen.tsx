import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import { useContratos } from "../context/ContratosContext";
import { useEventos } from "../context/EventosContext";
import { colors, shadow } from "../theme/colors";

export default function FornecedorDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fornecedores } = useFornecedores();
  const { getContratosDoFornecedor } = useContratos();
  const { eventos } = useEventos();

  const fornecedor = fornecedores.find((f) => f.id === id);
  const contratos = fornecedor ? getContratosDoFornecedor(fornecedor.id) : [];

  if (!fornecedor) {
    return (
      <View style={styles.container}>
        <Text>Fornecedor não encontrado.</Text>
      </View>
    );
  }

  function nomeEvento(eventoId: string) {
    return eventos.find((e) => e.id === eventoId)?.nome ?? "Evento";
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <View style={styles.conteudo}>
        <View style={[styles.infoCard, shadow]}>
          <Text style={styles.nome}>{fornecedor.nome}</Text>
          <View style={styles.categoriaBadge}>
            <Text style={styles.categoriaTexto}>{fornecedor.categoria}</Text>
          </View>
          <Text style={styles.detalhe}>{fornecedor.cnpj}</Text>
          <Text style={styles.detalhe}>
            {fornecedor.telefone} · {fornecedor.responsavel}
          </Text>
        </View>

        <View style={styles.listaTopo}>
          <Text style={styles.secaoTitulo}>Histórico de Contratos</Text>
          <Pressable
            style={styles.botaoNovo}
            onPress={() =>
              router.push({
                pathname: "/organizador/fornecedores/[id]/novo-contrato",
                params: { id: fornecedor.id },
              })
            }
          >
            <Text style={styles.botaoNovoTexto}>+ Novo contrato</Text>
          </Pressable>
        </View>

        {contratos.length === 0 ? (
          <Text style={styles.vazioTexto}>Nenhum contrato registrado para este fornecedor ainda.</Text>
        ) : (
          <FlatList
            data={contratos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.lista}
            renderItem={({ item }) => (
              <View style={[styles.card, shadow]}>
                <View style={styles.cardTopo}>
                  <Text style={styles.eventoNome}>{nomeEvento(item.eventoId)}</Text>
                  <Text style={item.situacao === "ativo" ? styles.situacaoAtiva : styles.situacaoEncerrada}>
                    {item.situacao === "ativo" ? "Ativo" : "Encerrado"}
                  </Text>
                </View>
                <Text style={styles.detalhe}>Data: {item.dataContrato}</Text>
                <Text style={styles.detalhe}>Responsável: {item.nomeResponsavel}</Text>
                <Text style={styles.valor}>
                  R$ {item.valorTotal.toLocaleString("pt-BR")} (adiantamento R${" "}
                  {item.valorAdiantamento.toLocaleString("pt-BR")})
                </Text>
                {!!item.objetivo && <Text style={styles.objetivo}>{item.objetivo}</Text>}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  voltar: { paddingTop: 50, paddingHorizontal: 16, marginBottom: 8 },
  voltarTexto: { color: colors.purple, fontSize: 15 },
  conteudo: { flex: 1, paddingHorizontal: 16 },
  infoCard: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 20 },
  nome: { fontSize: 18, fontWeight: "bold", color: colors.textPrimary },
  categoriaBadge: { alignSelf: "flex-start", backgroundColor: colors.purpleLight, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, marginTop: 4, marginBottom: 6 },
  categoriaTexto: { fontSize: 11, color: colors.purple, fontWeight: "700" },
  detalhe: { color: colors.textSecondary, fontSize: 13 },
  listaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold", color: colors.textPrimary },
  botaoNovo: { backgroundColor: colors.purple, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  botaoNovoTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  vazioTexto: { color: colors.textSecondary, fontSize: 14 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  eventoNome: { fontWeight: "bold", fontSize: 14, flexShrink: 1, color: colors.textPrimary },
  situacaoAtiva: { color: colors.green, fontWeight: "700", fontSize: 12 },
  situacaoEncerrada: { color: colors.textSecondary, fontWeight: "700", fontSize: 12 },
  valor: { fontSize: 13, fontWeight: "600", marginTop: 4, color: colors.textPrimary },
  objetivo: { fontSize: 12, color: colors.textSecondary, marginTop: 4, fontStyle: "italic" },
});
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import { useContratos } from "../context/ContratosContext";
import eventosData from "../data/eventos.json";

export default function FornecedorDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fornecedores } = useFornecedores();
  const { getContratosDoFornecedor } = useContratos();

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
    return eventosData.find((e) => e.id === eventoId)?.nome ?? "Evento";
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.nome}>{fornecedor.nome}</Text>
        <Text style={styles.categoria}>{fornecedor.categoria}</Text>
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
            <View style={styles.card}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#7c3aed", fontSize: 15 },
  infoCard: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 14, marginBottom: 20 },
  nome: { fontSize: 18, fontWeight: "bold" },
  categoria: { color: "#7c3aed", fontWeight: "600", fontSize: 12, marginTop: 2, marginBottom: 6 },
  detalhe: { color: "#6b7280", fontSize: 13 },
  listaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold" },
  botaoNovo: { backgroundColor: "#7c3aed", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  botaoNovoTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  vazioTexto: { color: "#6b7280", fontSize: 14 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  eventoNome: { fontWeight: "bold", fontSize: 14, flexShrink: 1 },
  situacaoAtiva: { color: "#16a34a", fontWeight: "700", fontSize: 12 },
  situacaoEncerrada: { color: "#9ca3af", fontWeight: "700", fontSize: 12 },
  valor: { fontSize: 13, fontWeight: "600", marginTop: 4, color: "#111827" },
  objetivo: { fontSize: 12, color: "#6b7280", marginTop: 4, fontStyle: "italic" },
});
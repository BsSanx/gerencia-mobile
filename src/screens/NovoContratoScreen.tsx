import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import { useContratos } from "../context/ContratosContext";
import { useEventos } from "../context/EventosContext";
import { colors, shadow } from "../theme/colors";

export default function NovoContratoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fornecedores } = useFornecedores();
  const { criarContrato } = useContratos();
  const { eventos } = useEventos();

  const fornecedor = fornecedores.find((f) => f.id === id);

  const [eventoId, setEventoId] = useState("");
  const [dataContrato, setDataContrato] = useState("");
  const [valorAdiantamento, setValorAdiantamento] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState(fornecedor?.responsavel ?? "");
  const [contatoResponsavel, setContatoResponsavel] = useState(fornecedor?.telefone ?? "");
  const [objetivo, setObjetivo] = useState("");

  if (!fornecedor) {
    return (
      <View style={styles.tela}>
        <Text>Fornecedor não encontrado.</Text>
      </View>
    );
  }

  function handleSalvar() {
    if (!eventoId || !dataContrato.trim() || !valorTotal.trim()) {
      Alert.alert("Campos obrigatórios", "Escolha um evento e preencha ao menos a data e o valor total.");
      return;
    }

    criarContrato({
      fornecedorId: fornecedor!.id,
      eventoId,
      dataContrato: dataContrato.trim(),
      valorAdiantamento: Number(valorAdiantamento) || 0,
      valorTotal: Number(valorTotal) || 0,
      nomeResponsavel: nomeResponsavel.trim(),
      contatoResponsavel: contatoResponsavel.trim(),
      objetivo: objetivo.trim(),
    });

    router.replace({ pathname: "/organizador/fornecedores/[id]", params: { id: fornecedor!.id } });
  }

  return (
    <View style={styles.tela}>
      <View style={styles.headerBar}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeTexto}>📊</Text>
        </View>
        <View>
          <Text style={styles.headerTitulo}>GerenCIA</Text>
          <Text style={styles.headerSubtitulo}>Painel do Organizador</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.voltar}>
          <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
        </Pressable>

        <View style={[styles.card, shadow]}>
          <Text style={styles.titulo}>Contrato de Fornecedor</Text>
          <Text style={styles.subtitulo}>
            {fornecedor.nome} · {fornecedor.categoria}
          </Text>

          <Text style={styles.label}>Evento</Text>
          <View style={styles.linhaWrap}>
            {eventos.map((ev) => (
              <Pressable
                key={ev.id}
                style={[styles.opcao, eventoId === ev.id && styles.opcaoAtiva]}
                onPress={() => setEventoId(ev.id)}
              >
                <Text style={[styles.opcaoTexto, eventoId === ev.id && styles.opcaoTextoAtivo]}>{ev.nome}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Data do contrato *</Text>
          <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={dataContrato} onChangeText={setDataContrato} />

          <Text style={styles.label}>Valor de adiantamento (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={valorAdiantamento}
            onChangeText={setValorAdiantamento}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Valor total (R$) *</Text>
          <TextInput style={styles.input} placeholder="0" value={valorTotal} onChangeText={setValorTotal} keyboardType="numeric" />

          <Text style={styles.label}>Nome do responsável</Text>
          <TextInput style={styles.input} value={nomeResponsavel} onChangeText={setNomeResponsavel} />

          <Text style={styles.label}>Contato do responsável</Text>
          <TextInput style={styles.input} value={contatoResponsavel} onChangeText={setContatoResponsavel} />

          <Text style={styles.label}>Objetivo / Escopo do serviço</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinha]}
            placeholder="Descreva o objetivo deste contrato..."
            value={objetivo}
            onChangeText={setObjetivo}
            multiline
            numberOfLines={4}
          />

          <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
            <Text style={styles.botaoSalvarTexto}>Salvar contrato</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.bg },
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
  container: { padding: 16, paddingBottom: 40 },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: colors.purple, fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12, color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15 },
  inputMultilinha: { height: 80, textAlignVertical: "top" },
  linhaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  opcaoAtiva: { borderColor: colors.purple, backgroundColor: colors.purpleLight },
  opcaoTexto: { fontSize: 13, color: colors.textPrimary },
  opcaoTextoAtivo: { color: colors.purple, fontWeight: "700" },
  botaoSalvar: { backgroundColor: colors.purple, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
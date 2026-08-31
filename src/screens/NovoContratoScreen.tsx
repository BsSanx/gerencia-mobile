import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import { useContratos } from "../context/ContratosContext";
import { useEventos } from "../context/EventosContext";

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
      <View style={styles.container}>
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
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#7c3aed", fontSize: 15 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15 },
  inputMultilinha: { height: 80, textAlignVertical: "top" },
  linhaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  opcaoAtiva: { borderColor: "#7c3aed", backgroundColor: "#f5f3ff" },
  opcaoTexto: { fontSize: 13, color: "#374151" },
  opcaoTextoAtivo: { color: "#7c3aed", fontWeight: "700" },
  botaoSalvar: { backgroundColor: "#7c3aed", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
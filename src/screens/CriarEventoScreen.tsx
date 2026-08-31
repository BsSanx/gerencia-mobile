import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";

const CATEGORIAS = ["Tecnologia", "Design", "Marketing", "Negócios", "Entretenimento"];

export default function CriarEventoScreen() {
  const router = useRouter();
  const { criarEvento } = useEventos();

  const [nome, setNome] = useState("");
  const [tipoEvento, setTipoEvento] = useState<"publico" | "privado">("publico");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [pago, setPago] = useState(false);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleSalvar() {
    if (!nome.trim() || !dataInicio.trim() || !dataFim.trim() || !local.trim() || !capacidade.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome, datas, local e capacidade máxima.");
      return;
    }

    criarEvento({
      nome: nome.trim(),
      tipoEvento,
      categoria,
      dataInicio: dataInicio.trim(),
      dataFim: dataFim.trim(),
      horario: horario.trim(),
      local: local.trim(),
      capacidade: Number(capacidade) || 0,
      descricao: descricao.trim(),
      valor: pago ? Number(valor) || 0 : 0,
    });

    // Navegação direta, sem depender do botão de um Alert (Alert.alert não funciona na web)
    router.replace("/organizador");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <Text style={styles.titulo}>Criar novo evento</Text>

      <Text style={styles.label}>Nome do evento *</Text>
      <TextInput style={styles.input} placeholder="Ex: Summit de Tecnologia 2026" value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Tipo de evento</Text>
      <View style={styles.linha}>
        <Pressable
          style={[styles.opcao, tipoEvento === "publico" && styles.opcaoAtiva]}
          onPress={() => setTipoEvento("publico")}
        >
          <Text style={[styles.opcaoTexto, tipoEvento === "publico" && styles.opcaoTextoAtivo]}>Público</Text>
        </Pressable>
        <Pressable
          style={[styles.opcao, tipoEvento === "privado" && styles.opcaoAtiva]}
          onPress={() => setTipoEvento("privado")}
        >
          <Text style={[styles.opcaoTexto, tipoEvento === "privado" && styles.opcaoTextoAtivo]}>Privado</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.linhaWrap}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.opcao, categoria === cat && styles.opcaoAtiva]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[styles.opcaoTexto, categoria === cat && styles.opcaoTextoAtivo]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Data de início *</Text>
      <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={dataInicio} onChangeText={setDataInicio} />

      <Text style={styles.label}>Data de término *</Text>
      <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={dataFim} onChangeText={setDataFim} />

      <Text style={styles.label}>Horário</Text>
      <TextInput style={styles.input} placeholder="09:00" value={horario} onChangeText={setHorario} />

      <Text style={styles.label}>Local *</Text>
      <TextInput style={styles.input} placeholder="Ex: Expo Center Norte, São Paulo" value={local} onChangeText={setLocal} />

      <Text style={styles.label}>Capacidade máxima *</Text>
      <TextInput style={styles.input} placeholder="200" value={capacidade} onChangeText={setCapacidade} keyboardType="numeric" />

      <Text style={styles.label}>Tipo de ingresso</Text>
      <View style={styles.linha}>
        <Pressable style={[styles.opcao, !pago && styles.opcaoAtiva]} onPress={() => setPago(false)}>
          <Text style={[styles.opcaoTexto, !pago && styles.opcaoTextoAtivo]}>Gratuito</Text>
        </Pressable>
        <Pressable style={[styles.opcao, pago && styles.opcaoAtiva]} onPress={() => setPago(true)}>
          <Text style={[styles.opcaoTexto, pago && styles.opcaoTextoAtivo]}>Pago</Text>
        </Pressable>
      </View>

      {pago && (
        <>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput style={styles.input} placeholder="99" value={valor} onChangeText={setValor} keyboardType="numeric" />
        </>
      )}

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.inputMultilinha]}
        placeholder="Descreva o evento..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.botaoSalvarTexto}>Criar evento</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#7c3aed", fontSize: 15 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15 },
  inputMultilinha: { height: 90, textAlignVertical: "top" },
  linha: { flexDirection: "row", gap: 10 },
  linhaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  opcaoAtiva: { borderColor: "#7c3aed", backgroundColor: "#f5f3ff" },
  opcaoTexto: { fontSize: 13, color: "#374151" },
  opcaoTextoAtivo: { color: "#7c3aed", fontWeight: "700" },
  botaoSalvar: { backgroundColor: "#7c3aed", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
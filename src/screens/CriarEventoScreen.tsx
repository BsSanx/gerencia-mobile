import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { colors, shadow } from "../theme/colors";

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

    router.replace("/organizador");
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
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: colors.textPrimary },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12, color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15 },
  inputMultilinha: { height: 90, textAlignVertical: "top" },
  linha: { flexDirection: "row", gap: 10 },
  linhaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  opcaoAtiva: { borderColor: colors.purple, backgroundColor: colors.purpleLight },
  opcaoTexto: { fontSize: 13, color: colors.textPrimary },
  opcaoTextoAtivo: { color: colors.purple, fontWeight: "700" },
  botaoSalvar: { backgroundColor: colors.purple, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
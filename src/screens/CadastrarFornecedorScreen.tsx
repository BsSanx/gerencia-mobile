import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";
import { colors, shadow } from "../theme/colors";

const CATEGORIAS = ["Audiovisual", "Buffet", "Decoração", "Fotografia", "Segurança", "Limpeza", "Locação", "Outras"];

export default function CadastrarFornecedorScreen() {
  const router = useRouter();
  const { cadastrarFornecedor } = useFornecedores();

  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [responsavel, setResponsavel] = useState("");

  function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do fornecedor.");
      return;
    }

    cadastrarFornecedor({
      nome: nome.trim(),
      cnpj: cnpj.trim(),
      telefone: telefone.trim(),
      categoria,
      responsavel: responsavel.trim(),
    });

    router.replace("/organizador/fornecedores");
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
          <Text style={styles.titulo}>Cadastrar fornecedor</Text>

          <Text style={styles.label}>Nome *</Text>
          <TextInput style={styles.input} placeholder="Nome da empresa" value={nome} onChangeText={setNome} />

          <Text style={styles.label}>CNPJ</Text>
          <TextInput style={styles.input} placeholder="00.000.000/0001-00" value={cnpj} onChangeText={setCnpj} />

          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} placeholder="(11) 99999-9999" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

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

          <Text style={styles.label}>Responsável</Text>
          <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} placeholder="Nome do contato" />

          <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
            <Text style={styles.botaoSalvarTexto}>Cadastrar e vincular</Text>
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
  linhaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  opcaoAtiva: { borderColor: colors.purple, backgroundColor: colors.purpleLight },
  opcaoTexto: { fontSize: 13, color: colors.textPrimary },
  opcaoTextoAtivo: { color: colors.purple, fontWeight: "700" },
  botaoSalvar: { backgroundColor: colors.purple, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
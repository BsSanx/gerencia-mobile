import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFornecedores } from "../context/FornecedoresContext";

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
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

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
      <TextInput style={styles.input} placeholder="Nome do contato" value={responsavel} onChangeText={setResponsavel} />

      <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.botaoSalvarTexto}>Cadastrar e vincular</Text>
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
  linhaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  opcaoAtiva: { borderColor: "#7c3aed", backgroundColor: "#f5f3ff" },
  opcaoTexto: { fontSize: 13, color: "#374151" },
  opcaoTextoAtivo: { color: "#7c3aed", fontWeight: "700" },
  botaoSalvar: { backgroundColor: "#7c3aed", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
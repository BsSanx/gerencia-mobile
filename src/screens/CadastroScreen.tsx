import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";

export default function CadastroScreen() {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoConta, setTipoConta] = useState<"cliente" | "organizador">("cliente");
  const router = useRouter();

  function handleCriarConta() {
    // Cadastro ainda não conectado a um backend — por enquanto, só valida campos obrigatórios e navega
    if (nome.trim() && email.trim() && senha.trim()) {
      router.replace("/(tabs)");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Criar sua conta</Text>
      <Text style={styles.subtitulo}>Junte-se ao GerenCIA e gerencie eventos</Text>

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nome completo</Text>
      <TextInput style={styles.input} placeholder="Maria da Silva" value={nome} onChangeText={setNome} />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="maria@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} placeholder="********" value={senha} onChangeText={setSenha} secureTextEntry />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="(11) 99999-9999"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Tipo de conta</Text>
      <View style={styles.tipoContainer}>
        <Pressable
          style={[styles.tipoCard, tipoConta === "cliente" && styles.tipoCardAtivo]}
          onPress={() => setTipoConta("cliente")}
        >
          <Text style={[styles.tipoTitulo, tipoConta === "cliente" && styles.tipoTituloAtivo]}>Cliente</Text>
          <Text style={styles.tipoDescricao}>Descubra e participe de eventos</Text>
        </Pressable>
        <Pressable
          style={[styles.tipoCard, tipoConta === "organizador" && styles.tipoCardAtivo]}
          onPress={() => setTipoConta("organizador")}
        >
          <Text style={[styles.tipoTitulo, tipoConta === "organizador" && styles.tipoTituloAtivo]}>Organizador</Text>
          <Text style={styles.tipoDescricao}>Crie e gerencie seus eventos</Text>
        </Pressable>
      </View>

      <Pressable style={styles.botao} onPress={handleCriarConta}>
        <Text style={styles.botaoTexto}>Criar conta</Text>
      </Pressable>

      <Link href="/login" style={styles.link}>
        Já possui conta? Entrar
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitulo: { color: "#6b7280", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15 },
  tipoContainer: { flexDirection: "row", gap: 10, marginTop: 4 },
  tipoCard: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12 },
  tipoCardAtivo: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  tipoTitulo: { fontWeight: "bold", marginBottom: 2 },
  tipoTituloAtivo: { color: "#2563eb" },
  tipoDescricao: { fontSize: 12, color: "#6b7280" },
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { textAlign: "center", marginTop: 20, color: "#2563eb" },
});
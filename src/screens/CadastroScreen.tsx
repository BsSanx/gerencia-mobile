import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

function mensagemDeErro(codigo: string) {
  switch (codigo) {
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    default:
      return "Não foi possível criar a conta. Tente novamente.";
  }
}

export default function CadastroScreen() {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoConta, setTipoConta] = useState<"cliente" | "organizador">("cliente");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleCriarConta() {
    setErro("");
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha nome, e-mail e senha.");
      return;
    }
    setCarregando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(credencial.user, { displayName: nome.trim() });

      await setDoc(doc(db, "usuarios", credencial.user.uid), {
        nome: nome.trim(),
        email: email.trim(),
        tipo: tipoConta,
        criadoEm: new Date().toISOString(),
      });

      router.replace(tipoConta === "organizador" ? "/organizador" : "/(tabs)");
    } catch (e: any) {
      setErro(mensagemDeErro(e.code));
    } finally {
      setCarregando(false);
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
      <TextInput style={styles.input} placeholder="mín. 6 caracteres" value={senha} onChangeText={setSenha} secureTextEntry />

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

      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      <Pressable style={styles.botao} onPress={handleCriarConta} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Criar conta</Text>}
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
  erro: { color: "#dc2626", marginTop: 12, fontSize: 13 },
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { textAlign: "center", marginTop: 20, color: "#2563eb" },
});
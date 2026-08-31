import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

function mensagemDeErro(codigo: string) {
  switch (codigo) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleEntrar() {
    setErro("");
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      router.replace("/(tabs)");
    } catch (e: any) {
      setErro(mensagemDeErro(e.code));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo de volta</Text>
      <Text style={styles.subtitulo}>Gerencie eventos de forma simples e inteligente.</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} placeholder="********" value={senha} onChangeText={setSenha} secureTextEntry />

      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      <Pressable style={styles.botao} onPress={handleEntrar} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
      </Pressable>

      <Link href="/cadastro" style={styles.link}>
        Não possui conta? Criar conta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitulo: { color: "#6b7280", marginBottom: 24 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15 },
  erro: { color: "#dc2626", marginTop: 12, fontSize: 13 },
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { textAlign: "center", marginTop: 20, color: "#2563eb" },
});
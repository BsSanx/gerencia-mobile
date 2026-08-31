import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { colors } from "../theme/colors";

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
      const credencial = await signInWithEmailAndPassword(auth, email.trim(), senha);
      const perfilSnap = await getDoc(doc(db, "usuarios", credencial.user.uid));
      const tipo = perfilSnap.exists() ? perfilSnap.data().tipo : "cliente";
      router.replace(tipo === "organizador" ? "/organizador" : "/(tabs)");
    } catch (e: any) {
      setErro(mensagemDeErro(e.code));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <View style={styles.marca}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeTexto}>📅</Text>
        </View>
        <Text style={styles.marcaTitulo}>GerenCIA</Text>
        <Text style={styles.marcaSubtitulo}>Gerencie eventos de forma simples e inteligente.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Bem-vindo de volta</Text>

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

        <Pressable onPress={() => router.push("/recuperar-senha")}>
          <Text style={styles.linkEsqueci}>Esqueci minha senha</Text>
        </Pressable>

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <Pressable style={styles.botao} onPress={handleEntrar} disabled={carregando}>
          {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
        </Pressable>

        <Link href="/cadastro" style={styles.link}>
          Não possui conta? Criar conta
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.navy, justifyContent: "center", paddingHorizontal: 24 },
  marca: { alignItems: "center", marginBottom: 28 },
  iconBadge: { width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  iconBadgeTexto: { fontSize: 24 },
  marcaTitulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  marcaSubtitulo: { color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 24 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: colors.textPrimary },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12, color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15 },
  linkEsqueci: { color: colors.blue, fontSize: 13, fontWeight: "600", marginTop: 10, textAlign: "right" },
  erro: { color: colors.red, marginTop: 12, fontSize: 13 },
  botao: { backgroundColor: colors.blue, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 20 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { textAlign: "center", marginTop: 20, color: colors.blue },
});
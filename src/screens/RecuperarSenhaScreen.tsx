import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { colors } from "../theme/colors";

function mensagemDeErro(codigo: string) {
  switch (codigo) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    default:
      return "Não foi possível enviar o link agora. Tente novamente.";
  }
}

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleEnviar() {
    setErro("");
    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }
    setCarregando(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setEnviado(true);
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
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Recuperar senha</Text>
        <Text style={styles.subtitulo}>Informe seu e-mail para receber as instruções de redefinição de senha.</Text>

        {enviado ? (
          <Text style={styles.sucesso}>
            Se esse e-mail estiver cadastrado, enviamos um link de recuperação para ele. Confira também a caixa de spam.
          </Text>
        ) : (
          <>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {!!erro && <Text style={styles.erro}>{erro}</Text>}

            <Pressable style={styles.botao} onPress={handleEnviar} disabled={carregando}>
              {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Enviar link de recuperação</Text>}
            </Pressable>
          </>
        )}

        <Pressable onPress={() => router.replace("/login")}>
          <Text style={styles.link}>{"< Voltar ao login"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.navy, justifyContent: "center", paddingHorizontal: 24 },
  marca: { alignItems: "center", marginBottom: 28 },
  iconBadge: { width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  iconBadgeTexto: { fontSize: 24 },
  marcaTitulo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 24 },
  titulo: { fontSize: 20, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, fontSize: 13, marginTop: 6, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15 },
  erro: { color: colors.red, marginTop: 12, fontSize: 13 },
  sucesso: { color: colors.green, fontSize: 14, marginBottom: 8, lineHeight: 20 },
  botao: { backgroundColor: colors.blue, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 20 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { textAlign: "center", marginTop: 20, color: colors.blue },
});
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  function handleEntrar() {
    // Login ainda não conectado a um backend — por enquanto, qualquer preenchimento navega para o app
    if (email.trim() && senha.trim()) {
      router.replace("/(tabs)");
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
      <TextInput
        style={styles.input}
        placeholder="********"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Pressable style={styles.botao} onPress={handleEntrar}>
        <Text style={styles.botaoTexto}>Entrar</Text>
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
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { textAlign: "center", marginTop: 20, color: "#2563eb" },
});
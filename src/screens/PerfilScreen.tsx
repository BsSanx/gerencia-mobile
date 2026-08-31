import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { Link } from "expo-router";

export default function PerfilScreen() {
  const [nome, setNome] = useState("Ana Paula Santos");
  const [email, setEmail] = useState("ana.paula@email.com");
  const [telefone, setTelefone] = useState("(11) 98765-4321");
  const [bio, setBio] = useState("Apaixonada por tecnologia e eventos de inovação.");

  function handleSalvar() {
    Alert.alert("Perfil atualizado", "Suas informações foram salvas.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>
      <Text style={styles.subtitulo}>Gerencie suas informações pessoais</Text>

      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {nome
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <Text style={styles.avatarNome}>{nome}</Text>
      </View>

      <Text style={styles.label}>Nome completo</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.inputMultilinha]}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
      />

      <Pressable style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar alterações</Text>
      </Pressable>

      <Link href="/organizador" style={styles.linkOrganizador}>
        Acessar painel do Organizador (demo)
      </Link>

      <Link href="/admin" style={styles.linkAdmin}>
        Acessar painel do Admin (demo)
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", marginBottom: 20 },
  avatarCard: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  avatarTexto: { color: "#2563eb", fontWeight: "bold", fontSize: 20 },
  avatarNome: { fontWeight: "600", fontSize: 15 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15 },
  inputMultilinha: { height: 80, textAlignVertical: "top" },
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  linkOrganizador: { textAlign: "center", marginTop: 24, color: "#7c3aed", fontWeight: "600" },
  linkAdmin: { textAlign: "center", marginTop: 12, color: "#111827", fontWeight: "600" },
});
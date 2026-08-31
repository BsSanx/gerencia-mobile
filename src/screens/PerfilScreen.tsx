import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { updateProfile, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const LABELS_TIPO: Record<string, string> = {
  cliente: "Cliente",
  organizador: "Organizador",
  admin: "Admin",
};

type Props = {
  esconderLinkOrganizador?: boolean;
};

export default function PerfilScreen({ esconderLinkOrganizador = false }: Props) {
  const { user, perfil } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState(user?.displayName ?? "");
  const [telefone, setTelefone] = useState("");
  const [bio, setBio] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (user?.displayName) setNome(user.displayName);
  }, [user?.displayName]);

  async function handleSalvar() {
    if (!auth.currentUser) return;
    setSalvando(true);
    try {
      await updateProfile(auth.currentUser, { displayName: nome.trim() });
      Alert.alert("Perfil atualizado", "Suas informações foram salvas.");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar agora.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleSair() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>
      <Text style={styles.subtitulo}>Gerencie suas informações pessoais</Text>

      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {(nome || user?.email || "?")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </Text>
        </View>
        <Text style={styles.avatarNome}>{nome || "Sem nome definido"}</Text>
        {!!perfil && <Text style={styles.badgeTipo}>{LABELS_TIPO[perfil.tipo]}</Text>}
      </View>

      <Text style={styles.label}>Nome completo</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />

      <Text style={styles.label}>E-mail</Text>
      <TextInput style={[styles.input, styles.inputDesabilitado]} value={user?.email ?? ""} editable={false} />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(11) 99999-9999" />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.inputMultilinha]}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        placeholder="Fale um pouco sobre você"
      />

      <Pressable style={styles.botao} onPress={handleSalvar} disabled={salvando}>
        <Text style={styles.botaoTexto}>{salvando ? "Salvando..." : "Salvar alterações"}</Text>
      </Pressable>

      {perfil?.tipo === "organizador" && !esconderLinkOrganizador && (
        <Link href="/organizador" style={styles.linkOrganizador}>
          Acessar painel do Organizador
        </Link>
      )}

      <Link href="/admin" style={styles.linkAdmin}>
        Acessar painel do Admin (demo)
      </Link>

      <Pressable style={styles.botaoSair} onPress={handleSair}>
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </Pressable>
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
  badgeTipo: { fontSize: 11, fontWeight: "700", color: "#7c3aed", backgroundColor: "#f5f3ff", borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, marginTop: 6 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15 },
  inputDesabilitado: { backgroundColor: "#f9fafb", color: "#6b7280" },
  inputMultilinha: { height: 80, textAlignVertical: "top" },
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  linkOrganizador: { textAlign: "center", marginTop: 24, color: "#7c3aed", fontWeight: "600" },
  linkAdmin: { textAlign: "center", marginTop: 12, color: "#111827", fontWeight: "600" },
  botaoSair: { alignItems: "center", marginTop: 24, borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 20 },
  botaoSairTexto: { color: "#dc2626", fontWeight: "600", fontSize: 14 },
});
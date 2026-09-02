import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { updateProfile, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import MenuButton from "../components/MenuButton";
import NotificationBell from "../components/NotificationBell";
import { colors, shadow } from "../theme/colors";

const LABELS_TIPO: Record<string, string> = {
  cliente: "Cliente",
  organizador: "Organizador",
  admin: "Admin",
};

type Props = {
  esconderLinkOrganizador?: boolean;
  esconderMenu?: boolean;
};

export default function PerfilScreen({ esconderLinkOrganizador = false, esconderMenu = false }: Props) {
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
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.headerEsquerda}>
            {!esconderMenu && <MenuButton />}
            <Text style={styles.titulo}>Meu Perfil</Text>
          </View>
          {!esconderMenu && <NotificationBell />}
        </View>
        <Text style={styles.subtitulo}>Gerencie suas informações pessoais</Text>
      </View>

      <View style={[styles.avatarCard, shadow]}>
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
        {!!perfil && (
          <View style={styles.badgeTipo}>
            <Text style={styles.badgeTipoTexto}>{LABELS_TIPO[perfil.tipo]}</Text>
          </View>
        )}
      </View>

      <View style={[styles.formCard, shadow]}>
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
      </View>

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
  tela: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingTop: 50, paddingBottom: 16 },
  headerTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerEsquerda: { flexDirection: "row", alignItems: "center", gap: 8 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, fontSize: 13, marginTop: 2, marginLeft: 44 },
  avatarCard: { backgroundColor: colors.card, borderRadius: 14, alignItems: "center", paddingVertical: 20, marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.blueLight, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  avatarTexto: { color: colors.blue, fontWeight: "bold", fontSize: 20 },
  avatarNome: { fontWeight: "600", fontSize: 15, color: colors.textPrimary },
  badgeTipo: { backgroundColor: colors.purpleLight, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, marginTop: 6 },
  badgeTipoTexto: { fontSize: 11, fontWeight: "700", color: colors.purple },
  formCard: { backgroundColor: colors.card, borderRadius: 14, padding: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12, color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15 },
  inputDesabilitado: { backgroundColor: colors.bg, color: colors.textSecondary },
  inputMultilinha: { height: 80, textAlignVertical: "top" },
  botao: { backgroundColor: colors.blue, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 20 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  linkOrganizador: { textAlign: "center", marginTop: 20, color: colors.purple, fontWeight: "600" },
  linkAdmin: { textAlign: "center", marginTop: 12, color: colors.textPrimary, fontWeight: "600" },
  botaoSair: { alignItems: "center", marginTop: 24, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20 },
  botaoSairTexto: { color: colors.red, fontWeight: "600", fontSize: 14 },
});
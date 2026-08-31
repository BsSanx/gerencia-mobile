import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useUsuarios } from "../context/UsuariosContext";
import { colors, shadow } from "../theme/colors";

const LABELS_TIPO: Record<string, string> = {
  cliente: "Cliente",
  organizador: "Organizador",
  admin: "Admin",
};

const CORES_TIPO: Record<string, { bg: string; texto: string }> = {
  cliente: { bg: colors.blueLight, texto: colors.blue },
  organizador: { bg: colors.purpleLight, texto: colors.purple },
  admin: { bg: colors.amberLight, texto: colors.amber },
};

export default function AdminUsuariosScreen() {
  const router = useRouter();
  const { usuarios, carregando, alternarStatus } = useUsuarios();

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeTexto}>🛡️</Text>
        </View>
        <View>
          <Text style={styles.headerTitulo}>GerenCIA</Text>
          <Text style={styles.headerSubtitulo}>Painel Administrativo</Text>
        </View>
      </View>

      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Usuários</Text>
        <Text style={styles.subtitulo}>{usuarios.length} cadastrados</Text>

        {carregando ? (
          <ActivityIndicator size="large" color={colors.navy} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.lista}
            renderItem={({ item }) => {
              const cor = CORES_TIPO[item.tipo] ?? CORES_TIPO.cliente;
              return (
                <View style={[styles.card, shadow]}>
                  <View style={styles.cardTopo}>
                    <View style={{ flexShrink: 1 }}>
                      <Text style={styles.nome}>{item.nome || "(sem nome)"}</Text>
                      <Text style={styles.email}>{item.email}</Text>
                    </View>
                    <View style={[styles.tipoBadge, { backgroundColor: cor.bg }]}>
                      <Text style={[styles.tipoBadgeTexto, { color: cor.texto }]}>{LABELS_TIPO[item.tipo]}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRodape}>
                    <Text style={item.ativo ? styles.statusAtivo : styles.statusInativo}>
                      {item.ativo ? "● Ativo" : "○ Inativo"}
                    </Text>
                    <Pressable onPress={() => alternarStatus(item.id)}>
                      <Text style={styles.acaoTexto}>{item.ativo ? "Desativar" : "Ativar"}</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.navy,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  iconBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  iconBadgeTexto: { fontSize: 18 },
  headerTitulo: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  headerSubtitulo: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  voltar: { marginTop: 16, marginLeft: 16 },
  voltarTexto: { color: colors.textPrimary, fontSize: 15 },
  conteudo: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, marginBottom: 16 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  nome: { fontWeight: "bold", fontSize: 15, color: colors.textPrimary },
  email: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  tipoBadge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  tipoBadgeTexto: { fontSize: 11, fontWeight: "700" },
  cardRodape: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  statusAtivo: { color: colors.green, fontSize: 12, fontWeight: "700" },
  statusInativo: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  acaoTexto: { color: colors.blue, fontSize: 12, fontWeight: "600" },
});
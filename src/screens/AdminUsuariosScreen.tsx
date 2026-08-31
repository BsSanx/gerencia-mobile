import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useUsuarios } from "../context/UsuariosContext";

const LABELS_TIPO: Record<string, string> = {
  cliente: "Cliente",
  organizador: "Organizador",
  admin: "Admin",
};

export default function AdminUsuariosScreen() {
  const router = useRouter();
  const { usuarios, alternarStatus } = useUsuarios();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <Text style={styles.titulo}>Usuários</Text>
      <Text style={styles.subtitulo}>{usuarios.length} cadastrados</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopo}>
              <View style={{ flexShrink: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <Text style={styles.tipoBadge}>{LABELS_TIPO[item.tipo]}</Text>
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: "#fff" },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: "#111827", fontSize: 15 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#6b7280", marginBottom: 16 },
  lista: { gap: 10, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  nome: { fontWeight: "bold", fontSize: 15 },
  email: { color: "#6b7280", fontSize: 12, marginTop: 1 },
  tipoBadge: { fontSize: 11, fontWeight: "700", color: "#374151", backgroundColor: "#f3f4f6", borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  cardRodape: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  statusAtivo: { color: "#16a34a", fontSize: 12, fontWeight: "700" },
  statusInativo: { color: "#9ca3af", fontSize: 12, fontWeight: "700" },
  acaoTexto: { color: "#2563eb", fontSize: 12, fontWeight: "600" },
});
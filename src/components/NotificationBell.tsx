import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, FlatList } from "react-native";
import { useNotificacoes } from "../context/NotificacoesContext";
import { colors } from "../theme/colors";

type Props = { cor?: string };

export default function NotificationBell({ cor = colors.textPrimary }: Props) {
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Pressable onPress={() => setAberto(true)} style={styles.botao} hitSlop={8}>
        <Text style={[styles.icone, { color: cor }]}>🔔</Text>
        {naoLidas > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{naoLidas > 9 ? "9+" : naoLidas}</Text>
          </View>
        )}
      </Pressable>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable style={styles.overlay} onPress={() => setAberto(false)}>
          <Pressable style={styles.painel} onPress={(e) => e.stopPropagation()}>
            <View style={styles.painelTopo}>
              <Text style={styles.painelTitulo}>Notificações</Text>
              {notificacoes.length > 0 && (
                <Pressable onPress={marcarTodasComoLidas}>
                  <Text style={styles.marcarTodasTexto}>Marcar todas como lidas</Text>
                </Pressable>
              )}
            </View>

            {notificacoes.length === 0 ? (
              <Text style={styles.vazioTexto}>Nenhuma notificação ainda.</Text>
            ) : (
              <FlatList
                data={notificacoes}
                keyExtractor={(item) => item.id}
                style={styles.lista}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => marcarComoLida(item.id)}
                    style={[styles.item, !item.lida && styles.itemNaoLido]}
                  >
                    <Text style={styles.itemMensagem}>{item.mensagem}</Text>
                    <Text style={styles.itemData}>{new Date(item.criadaEm).toLocaleString("pt-BR")}</Text>
                  </Pressable>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  botao: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  icone: { fontSize: 18 },
  badge: { position: "absolute", top: 2, right: 2, backgroundColor: colors.red, borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeTexto: { color: "#fff", fontSize: 10, fontWeight: "700" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "flex-end" },
  painel: { width: 300, maxHeight: 400, backgroundColor: colors.card, borderRadius: 12, marginTop: 60, marginRight: 16, elevation: 6 },
  painelTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  painelTitulo: { fontWeight: "bold", fontSize: 15, color: colors.textPrimary },
  marcarTodasTexto: { fontSize: 11, color: colors.blue, fontWeight: "600" },
  vazioTexto: { padding: 20, textAlign: "center", color: colors.textSecondary, fontSize: 13 },
  lista: { maxHeight: 340 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  itemNaoLido: { backgroundColor: colors.blueLight },
  itemMensagem: { fontSize: 13, color: colors.textPrimary, marginBottom: 2 },
  itemData: { fontSize: 11, color: colors.textSecondary },
});
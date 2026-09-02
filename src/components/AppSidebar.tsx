import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import { colors } from "../theme/colors";

const ITENS = [
  { label: "Início", href: "/", icone: "🏠" },
  { label: "Favoritos", href: "/favoritos", icone: "♡" },
  { label: "Meus Eventos", href: "/meus-eventos", icone: "📋" },
  { label: "Perfil", href: "/perfil", icone: "👤" },
];

export default function AppSidebar() {
  const { aberto, fecharMenu } = useMenu();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  async function handleSair() {
    fecharMenu();
    await signOut(auth);
    router.replace("/login");
  }

  function irPara(href: string) {
    fecharMenu();
    router.push(href as any);
  }

  return (
    <Modal visible={aberto} transparent animationType="fade" onRequestClose={fecharMenu}>
      <View style={styles.overlayContainer}>
        <Pressable style={styles.overlay} onPress={fecharMenu} />
        <View style={styles.painel}>
          <View style={styles.header}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeTexto}>📅</Text>
            </View>
            <Text style={styles.marca}>GerenCIA</Text>
          </View>

          <View style={styles.itens}>
            {ITENS.map((item) => {
              const ativo = pathname === item.href;
              return (
                <Pressable
                  key={item.href}
                  onPress={() => irPara(item.href)}
                  style={[styles.item, ativo && styles.itemAtivo]}
                >
                  <Text style={styles.itemIcone}>{item.icone}</Text>
                  <Text style={[styles.itemTexto, ativo && styles.itemTextoAtivo]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Text style={styles.usuarioNome} numberOfLines={1}>
              {user?.displayName || user?.email}
            </Text>
            <Pressable onPress={handleSair}>
              <Text style={styles.botaoSairTexto}>Sair da conta</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, flexDirection: "row" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  painel: { width: 260, backgroundColor: colors.card, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconBadge: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  iconBadgeTexto: { fontSize: 16 },
  marca: { fontSize: 17, fontWeight: "bold", color: colors.textPrimary },
  itens: { paddingTop: 12, paddingHorizontal: 12, gap: 4, flex: 1 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10 },
  itemAtivo: { backgroundColor: colors.blueLight },
  itemIcone: { fontSize: 16, width: 22, textAlign: "center" },
  itemTexto: { fontSize: 14, color: colors.textSecondary, fontWeight: "600" },
  itemTextoAtivo: { color: colors.blue },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  usuarioNome: { fontSize: 13, color: colors.textSecondary, marginBottom: 10 },
  botaoSairTexto: { color: colors.red, fontWeight: "600", fontSize: 13 },
});
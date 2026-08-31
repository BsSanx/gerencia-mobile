import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";

const ITENS = [
  { label: "Dashboard", href: "/organizador" },
  { label: "Fornecedores", href: "/organizador/fornecedores" },
];

export default function OrganizadorNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.grupo}>
        {ITENS.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as any)}
              style={[styles.item, ativo && styles.itemAtivo]}
            >
              <Text style={[styles.texto, ativo && styles.textoAtivo]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => router.push("/organizador/perfil" as any)} style={styles.itemPerfil}>
        <Text style={styles.itemPerfilTexto}>Meu Perfil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  grupo: { flexDirection: "row", gap: 8 },
  item: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 },
  itemAtivo: { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
  texto: { fontSize: 13, fontWeight: "600", color: "#374151" },
  textoAtivo: { color: "#fff" },
  itemPerfil: { paddingVertical: 6, paddingHorizontal: 4 },
  itemPerfilTexto: { fontSize: 13, fontWeight: "600", color: "#2563eb" },
});
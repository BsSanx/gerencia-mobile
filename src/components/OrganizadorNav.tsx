import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useEventos } from "../context/EventosContext";
import { useNotificacoes } from "../context/NotificacoesContext";
import NotificationBell from "./NotificationBell";

const ITENS = [
  { label: "Dashboard", href: "/organizador" },
  { label: "Fornecedores", href: "/organizador/fornecedores" },
];

export default function OrganizadorNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { eventos } = useEventos();
  const { adicionarNotificacao } = useNotificacoes();

  const meusEventoIds = eventos.filter((e) => e.organizadorId === user?.uid).map((e) => e.id);
  const totalAnteriorRef = useRef(0);
  const primeiraCargaRef = useRef(true);

  useEffect(() => {
    if (meusEventoIds.length === 0) {
      totalAnteriorRef.current = 0;
      primeiraCargaRef.current = true;
      return;
    }

    const ref = collection(db, "inscricoes");
    const q = query(ref, where("eventoId", "in", meusEventoIds.slice(0, 30)), where("status", "==", "espera"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const total = snap.size;

      if (!primeiraCargaRef.current && total > totalAnteriorRef.current) {
        adicionarNotificacao(`Seus eventos agora têm ${total} pessoa(s) aguardando vaga na lista de espera.`);
      }

      primeiraCargaRef.current = false;
      totalAnteriorRef.current = total;
    });

    return unsubscribe;
  }, [JSON.stringify(meusEventoIds)]);

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

      <View style={styles.direita}>
        <NotificationBell />
        <Pressable onPress={() => router.push("/organizador/perfil" as any)} style={styles.itemPerfil}>
          <Text style={styles.itemPerfilTexto}>Meu Perfil</Text>
        </Pressable>
      </View>
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
  direita: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemPerfil: { paddingVertical: 6, paddingHorizontal: 4 },
  itemPerfilTexto: { fontSize: 13, fontWeight: "600", color: "#2563eb" },
});
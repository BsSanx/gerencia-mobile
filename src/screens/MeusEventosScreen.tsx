import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import eventosData from "../data/eventos.json";
import { useInscricoes } from "../context/InscricoesContext";

export default function MeusEventosScreen() {
  const { inscricoes, cancelar } = useInscricoes();
  const router = useRouter();

  const ativas = inscricoes
    .filter((i) => i.status !== "cancelada")
    .map((i) => ({
      ...i,
      evento: eventosData.find((e) => e.id === i.eventoId),
    }))
    .filter((i) => i.evento);

  if (ativas.length === 0) {
    return (
      <View style={styles.vazioContainer}>
        <Text style={styles.vazioTitulo}>Nenhuma inscrição ainda</Text>
        <Text style={styles.vazioTexto}>Explore eventos na aba Início e inscreva-se.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Eventos</Text>
      <FlatList
        data={ativas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/evento/[id]", params: { id: item.evento!.id } })
            }
          >
            <View style={styles.cardTopo}>
              <Text style={styles.nome}>{item.evento!.nome}</Text>
              {item.status === "confirmada" ? (
                <Text style={styles.badgeConfirmado}>Confirmada</Text>
              ) : (
                <Text style={styles.badgeFila}>Na fila (#{item.posicaoFila})</Text>
              )}
            </View>
            <Text style={styles.local}>{item.evento!.local}</Text>
            <Text style={styles.data}>
              {item.evento!.dataInicio} · {item.evento!.horario}
            </Text>
            <Pressable style={styles.botaoCancelar} onPress={() => cancelar(item.id)}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  lista: { gap: 12, paddingBottom: 24 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 14 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  nome: { fontSize: 16, fontWeight: "bold", flexShrink: 1 },
  badgeConfirmado: { color: "#16a34a", fontWeight: "700", fontSize: 12 },
  badgeFila: { color: "#f59e0b", fontWeight: "700", fontSize: 12 },
  local: { color: "#6b7280", marginBottom: 2 },
  data: { color: "#6b7280", marginBottom: 10 },
  botaoCancelar: { alignSelf: "flex-start", borderWidth: 1, borderColor: "#dc2626", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  botaoCancelarTexto: { color: "#dc2626", fontWeight: "600", fontSize: 12 },
  vazioContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, backgroundColor: "#fff" },
  vazioTitulo: { fontSize: 17, fontWeight: "bold", marginBottom: 6 },
  vazioTexto: { color: "#6b7280", textAlign: "center" },
});
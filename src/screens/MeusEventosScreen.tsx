import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useInscricoes } from "../context/InscricoesContext";
import { colors, shadow } from "../theme/colors";

export default function MeusEventosScreen() {
  const { eventos } = useEventos();
  const { inscricoes, cancelar, fazerCheckin, podeFazerCheckin } = useInscricoes();
  const router = useRouter();

  const ativas = inscricoes
    .filter((i) => i.status !== "cancelada")
    .map((i) => ({
      ...i,
      evento: eventos.find((e) => e.id === i.eventoId),
    }))
    .filter((i) => i.evento);

  function handleCheckin(inscricaoId: string) {
    fazerCheckin(inscricaoId).then((sucesso) => {
      if (sucesso) {
        Alert.alert("Check-in realizado", "Presença confirmada com sucesso!");
      } else {
        Alert.alert("Não foi possível fazer check-in", "O check-in só é permitido durante o período do evento.");
      }
    });
  }

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
      <View style={styles.header}>
        <Text style={styles.titulo}>Meus Eventos</Text>
        <Text style={styles.subtitulo}>Eventos em que você está inscrito ou na fila</Text>
      </View>
      <FlatList
        data={ativas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, shadow]}
            onPress={() =>
              router.push({ pathname: "/evento/[id]", params: { id: item.evento!.id } })
            }
          >
            <View style={styles.cardTopo}>
              <Text style={styles.nome}>{item.evento!.nome}</Text>
              {item.status === "confirmada" ? (
                <View style={[styles.badge, { backgroundColor: colors.greenLight }]}>
                  <Text style={[styles.badgeTexto, { color: colors.green }]}>Confirmada</Text>
                </View>
              ) : (
                <View style={[styles.badge, { backgroundColor: colors.amberLight }]}>
                  <Text style={[styles.badgeTexto, { color: colors.amber }]}>Na fila (#{item.posicaoFila})</Text>
                </View>
              )}
            </View>
            <Text style={styles.local}>{item.evento!.local}</Text>
            <Text style={styles.data}>
              {item.evento!.dataInicio} · {item.evento!.horario}
            </Text>

            {item.status === "confirmada" && (
              <View style={styles.acoesContainer}>
                {item.checkin ? (
                  <Text style={styles.checkinFeito}>✓ Check-in realizado</Text>
                ) : podeFazerCheckin(item.evento!.id) ? (
                  <Pressable style={styles.botaoCheckin} onPress={() => handleCheckin(item.id)}>
                    <Text style={styles.botaoCheckinTexto}>Fazer check-in</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.checkinIndisponivel}>Check-in disponível apenas durante o evento</Text>
                )}
              </View>
            )}

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
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  lista: { gap: 12, paddingHorizontal: 16, paddingBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14 },
  cardTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  nome: { fontSize: 16, fontWeight: "bold", flexShrink: 1, color: colors.textPrimary },
  badge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  badgeTexto: { fontWeight: "700", fontSize: 11 },
  local: { color: colors.textSecondary, marginBottom: 2 },
  data: { color: colors.textSecondary, marginBottom: 10 },
  acoesContainer: { marginBottom: 10 },
  botaoCheckin: { backgroundColor: colors.green, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  botaoCheckinTexto: { color: "#fff", fontWeight: "700", fontSize: 13 },
  checkinFeito: { color: colors.green, fontWeight: "700", fontSize: 13 },
  checkinIndisponivel: { color: colors.textSecondary, fontSize: 12, fontStyle: "italic" },
  botaoCancelar: { alignSelf: "flex-start", borderWidth: 1, borderColor: colors.red, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  botaoCancelarTexto: { color: colors.red, fontWeight: "600", fontSize: 12 },
  vazioContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, backgroundColor: colors.bg },
  vazioTitulo: { fontSize: 17, fontWeight: "bold", marginBottom: 6, color: colors.textPrimary },
  vazioTexto: { color: colors.textSecondary, textAlign: "center" },
});
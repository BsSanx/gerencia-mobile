import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useInscricoes } from "../context/InscricoesContext";
import { colors, shadow } from "../theme/colors";

export default function EventoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { eventos } = useEventos();
  const evento = eventos.find((e) => e.id === id);
  const { inscrever, cancelar, getInscricaoDoEvento } = useInscricoes();

  if (!evento) {
    return (
      <View style={styles.tela}>
        <Text>Evento não encontrado.</Text>
      </View>
    );
  }

  const inscricao = getInscricaoDoEvento(evento.id);
  const vagasRestantes = evento.capacidade - evento.inscritos;
  const lotado = vagasRestantes <= 0;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <View style={[styles.card, shadow]}>
        <Text style={styles.categoria}>{evento.categoria}</Text>
        <Text style={styles.nome}>{evento.nome}</Text>

        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: evento.status === "ativo" ? colors.greenLight : colors.bg }]}>
            <Text style={[styles.tagTexto, { color: evento.status === "ativo" ? colors.green : colors.textSecondary }]}>
              {evento.status === "ativo" ? "Ativo" : evento.status}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.blueLight }]}>
            <Text style={[styles.tagTexto, { color: colors.blue }]}>
              {evento.tipoEvento === "publico" ? "Público" : "Privado"}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.amberLight }]}>
            <Text style={[styles.tagTexto, { color: colors.amber }]}>
              {evento.valor > 0 ? `R$ ${evento.valor}` : "Gratuito"}
            </Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>SOBRE O EVENTO</Text>
        <Text style={styles.descricao}>{evento.descricao}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Local</Text>
            <Text style={styles.infoValor}>{evento.local}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data de início</Text>
            <Text style={styles.infoValor}>{evento.dataInicio}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data de término</Text>
            <Text style={styles.infoValor}>{evento.dataFim}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValor}>{evento.horario}</Text>
          </View>
        </View>

        {!inscricao && (
          <>
            <Text style={styles.vagas}>{lotado ? "Esgotado" : `${vagasRestantes} vagas disponíveis`}</Text>
            <Pressable style={[styles.botao, lotado && styles.botaoFila]} onPress={() => inscrever(evento.id)}>
              <Text style={styles.botaoTexto}>{lotado ? "Entrar na fila de espera" : "Inscrever-se"}</Text>
            </Pressable>
          </>
        )}

        {inscricao?.status === "confirmada" && (
          <>
            <Text style={styles.statusConfirmado}>✓ Inscrição confirmada</Text>
            <Pressable style={styles.botaoCancelar} onPress={() => cancelar(inscricao.id)}>
              <Text style={styles.botaoCancelarTexto}>Cancelar inscrição</Text>
            </Pressable>
          </>
        )}

        {inscricao?.status === "espera" && (
          <>
            <Text style={styles.statusFila}>Você está na fila de espera (posição {inscricao.posicaoFila})</Text>
            <Pressable style={styles.botaoCancelar} onPress={() => cancelar(inscricao.id)}>
              <Text style={styles.botaoCancelarTexto}>Sair da fila</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, paddingTop: 50, flexGrow: 1 },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: colors.blue, fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  categoria: { color: colors.blue, fontWeight: "600", fontSize: 13, marginBottom: 4 },
  nome: { fontSize: 24, fontWeight: "bold", marginBottom: 12, color: colors.textPrimary },
  tagsContainer: { flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  tag: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  tagTexto: { fontSize: 12, fontWeight: "700" },
  secaoTitulo: { fontSize: 12, fontWeight: "bold", color: colors.textSecondary, marginBottom: 6, letterSpacing: 0.5 },
  descricao: { fontSize: 15, color: colors.textPrimary, marginBottom: 20, lineHeight: 22 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  infoItem: { width: "47%", backgroundColor: colors.bg, borderRadius: 10, padding: 12 },
  infoLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 2 },
  infoValor: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  vagas: { fontSize: 14, fontWeight: "600", marginBottom: 12, color: colors.textPrimary },
  botao: { backgroundColor: colors.blue, borderRadius: 10, padding: 14, alignItems: "center" },
  botaoFila: { backgroundColor: colors.amber },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  statusConfirmado: { color: colors.green, fontWeight: "700", fontSize: 15, marginBottom: 12 },
  statusFila: { color: colors.amber, fontWeight: "700", fontSize: 15, marginBottom: 12 },
  botaoCancelar: { borderWidth: 1, borderColor: colors.red, borderRadius: 10, padding: 14, alignItems: "center" },
  botaoCancelarTexto: { color: colors.red, fontWeight: "bold", fontSize: 15 },
});
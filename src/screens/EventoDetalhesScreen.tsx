import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useInscricoes } from "../context/InscricoesContext";

export default function EventoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { eventos } = useEventos();
  const evento = eventos.find((e) => e.id === id);
  const { inscrever, cancelar, getInscricaoDoEvento } = useInscricoes();

  if (!evento) {
    return (
      <View style={styles.container}>
        <Text>Evento não encontrado.</Text>
      </View>
    );
  }

  const inscricao = getInscricaoDoEvento(evento.id);
  const vagasRestantes = evento.capacidade - evento.inscritos;
  const lotado = vagasRestantes <= 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <Text style={styles.categoria}>{evento.categoria}</Text>
      <Text style={styles.nome}>{evento.nome}</Text>

      <View style={styles.tagsContainer}>
        <Text style={styles.tag}>{evento.status === "ativo" ? "Ativo" : evento.status}</Text>
        <Text style={styles.tag}>{evento.tipoEvento === "publico" ? "Público" : "Privado"}</Text>
        <Text style={styles.tag}>{evento.valor > 0 ? `R$ ${evento.valor}` : "Gratuito"}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, backgroundColor: "#fff", flexGrow: 1 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: "#2563eb", fontSize: 15 },
  categoria: { color: "#2563eb", fontWeight: "600", fontSize: 13, marginBottom: 4 },
  nome: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  tagsContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tag: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, fontSize: 12, overflow: "hidden" },
  secaoTitulo: { fontSize: 12, fontWeight: "bold", color: "#9ca3af", marginBottom: 6, letterSpacing: 0.5 },
  descricao: { fontSize: 15, color: "#374151", marginBottom: 20, lineHeight: 22 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  infoItem: { width: "47%", backgroundColor: "#f9fafb", borderRadius: 10, padding: 12 },
  infoLabel: { fontSize: 11, color: "#9ca3af", marginBottom: 2 },
  infoValor: { fontSize: 14, fontWeight: "600" },
  vagas: { fontSize: 14, fontWeight: "600", marginBottom: 12, color: "#111827" },
  botao: { backgroundColor: "#2563eb", borderRadius: 10, padding: 14, alignItems: "center" },
  botaoFila: { backgroundColor: "#f59e0b" },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  statusConfirmado: { color: "#16a34a", fontWeight: "700", fontSize: 15, marginBottom: 12 },
  statusFila: { color: "#f59e0b", fontWeight: "700", fontSize: 15, marginBottom: 12 },
  botaoCancelar: { borderWidth: 1, borderColor: "#dc2626", borderRadius: 10, padding: 14, alignItems: "center" },
  botaoCancelarTexto: { color: "#dc2626", fontWeight: "bold", fontSize: 15 },
});
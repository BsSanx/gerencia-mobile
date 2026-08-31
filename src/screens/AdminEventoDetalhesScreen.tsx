import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useUsuarios } from "../context/UsuariosContext";
import { colors, shadow } from "../theme/colors";

export default function AdminEventoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { eventos } = useEventos();
  const { usuarios } = useUsuarios();

  const evento = eventos.find((e) => e.id === id);

  if (!evento) {
    return (
      <View style={styles.tela}>
        <Text>Evento não encontrado.</Text>
      </View>
    );
  }

  const organizador = usuarios.find((u) => u.id === evento.organizadorId);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>{"< Voltar"}</Text>
      </Pressable>

      <View style={[styles.card, shadow]}>
        <View style={styles.topo}>
          <Text style={styles.nome}>{evento.nome}</Text>
          <View style={[styles.statusBadge, { backgroundColor: evento.status === "ativo" ? colors.greenLight : colors.bg }]}>
            <Text style={[styles.statusTexto, { color: evento.status === "ativo" ? colors.green : colors.textSecondary }]}>
              {evento.status === "ativo" ? "Ativo" : evento.status}
            </Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: colors.blueLight }]}>
            <Text style={[styles.tagTexto, { color: colors.blue }]}>{evento.categoria}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.purpleLight }]}>
            <Text style={[styles.tagTexto, { color: colors.purple }]}>
              {evento.tipoEvento === "publico" ? "Público" : "Privado"}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.amberLight }]}>
            <Text style={[styles.tagTexto, { color: colors.amber }]}>
              {evento.valor > 0 ? `R$ ${evento.valor}` : "Gratuito"}
            </Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>ORGANIZADOR</Text>
        <Text style={styles.organizador}>
          {organizador ? `${organizador.nome} (${organizador.email})` : "Não identificado (evento pré-cadastrado)"}
        </Text>

        <Text style={styles.secaoTitulo}>DESCRIÇÃO</Text>
        <Text style={styles.descricao}>{evento.descricao || "Sem descrição."}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Código</Text>
            <Text style={styles.infoValor}>{evento.codigo}</Text>
          </View>
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
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Capacidade</Text>
            <Text style={styles.infoValor}>{evento.capacidade} pessoas</Text>
          </View>
        </View>

        <Text style={styles.vagas}>
          {evento.inscritos}/{evento.capacidade} inscritos ({Math.round((evento.inscritos / evento.capacidade) * 100)}%)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, paddingTop: 50, flexGrow: 1 },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: colors.textPrimary, fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  nome: { fontSize: 22, fontWeight: "bold", flexShrink: 1, marginRight: 8, color: colors.textPrimary },
  statusBadge: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10 },
  statusTexto: { fontWeight: "700", fontSize: 13 },
  tagsContainer: { flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  tag: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  tagTexto: { fontSize: 12, fontWeight: "700" },
  secaoTitulo: { fontSize: 12, fontWeight: "bold", color: colors.textSecondary, marginBottom: 6, letterSpacing: 0.5, marginTop: 8 },
  organizador: { fontSize: 14, color: colors.textPrimary, marginBottom: 16 },
  descricao: { fontSize: 15, color: colors.textPrimary, marginBottom: 20, lineHeight: 22 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  infoItem: { width: "47%", backgroundColor: colors.bg, borderRadius: 10, padding: 12 },
  infoLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 2 },
  infoValor: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  vagas: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
});
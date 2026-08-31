import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, shadow } from "../theme/colors";

type Props = {
  nome: string;
  categoria: string;
  local: string;
  dataInicio: string;
  horario: string;
  inscritos: number;
  capacidade: number;
  valor: number;
  favorito: boolean;
  onPress: () => void;
  onToggleFavorito: () => void;
};

export default function EventoCard({
  nome,
  categoria,
  local,
  dataInicio,
  horario,
  inscritos,
  capacidade,
  valor,
  favorito,
  onPress,
  onToggleFavorito,
}: Props) {
  return (
    <Pressable style={[styles.card, shadow]} onPress={onPress}>
      <View style={styles.topo}>
        <View style={styles.categoriaBadge}>
          <Text style={styles.categoriaTexto}>{categoria}</Text>
        </View>
        <Pressable onPress={onToggleFavorito} hitSlop={8} style={styles.coracaoBotao}>
          <Text style={styles.coracao}>{favorito ? "♥" : "♡"}</Text>
        </Pressable>
      </View>
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.local}>{local}</Text>
      <Text style={styles.data}>
        {dataInicio} · {horario}
      </Text>
      <View style={styles.rodape}>
        <Text style={styles.vagas}>
          {inscritos}/{capacidade} inscritos
        </Text>
        <Text style={styles.preco}>{valor > 0 ? `R$ ${valor}` : "Gratuito"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14 },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoriaBadge: { backgroundColor: colors.blueLight, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  categoriaTexto: { fontSize: 11, color: colors.blue, fontWeight: "700" },
  coracaoBotao: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  coracao: { color: colors.red, fontSize: 15 },
  nome: { fontSize: 16, fontWeight: "bold", marginTop: 8, marginBottom: 2, color: colors.textPrimary },
  local: { color: colors.textSecondary, fontSize: 13, marginBottom: 2 },
  data: { color: colors.textSecondary, fontSize: 13, marginBottom: 8 },
  rodape: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  vagas: { fontSize: 13, color: colors.textPrimary },
  preco: { fontSize: 13, fontWeight: "700", color: colors.blue },
});
import { Pressable, Text, StyleSheet } from "react-native";
import { useMenu } from "../context/MenuContext";
import { colors } from "../theme/colors";

type Props = { cor?: string };

export default function MenuButton({ cor = colors.textPrimary }: Props) {
  const { abrirMenu } = useMenu();

  return (
    <Pressable onPress={abrirMenu} style={styles.botao} hitSlop={8}>
      <Text style={[styles.icone, { color: cor }]}>☰</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  icone: { fontSize: 20, fontWeight: "bold" },
});
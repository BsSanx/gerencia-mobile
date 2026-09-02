import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useFavoritos } from "../context/FavoritosContext";
import EventoCard from "../components/EventoCard";
import MenuButton from "../components/MenuButton";
import { colors } from "../theme/colors";

export default function FavoritosScreen() {
  const { eventos } = useEventos();
  const { favoritos, alternarFavorito } = useFavoritos();
  const router = useRouter();

  const eventosFavoritos = eventos.filter((e) => favoritos.includes(e.id));

  if (eventosFavoritos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTopo}>
            <MenuButton />
            <Text style={styles.titulo}>Meus Favoritos</Text>
          </View>
        </View>
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTitulo}>Nenhum favorito ainda</Text>
          <Text style={styles.vazioTexto}>Toque no coração de um evento na Início para salvá-lo aqui.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <MenuButton />
          <Text style={styles.titulo}>Meus Favoritos</Text>
        </View>
        <Text style={styles.subtitulo}>{eventosFavoritos.length} eventos salvos</Text>
      </View>
      <FlatList
        data={eventosFavoritos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <EventoCard
            nome={item.nome}
            categoria={item.categoria}
            local={item.local}
            dataInicio={item.dataInicio}
            horario={item.horario}
            inscritos={item.inscritos}
            capacidade={item.capacidade}
            valor={item.valor}
            favorito={true}
            onPress={() => router.push({ pathname: "/evento/[id]", params: { id: item.id } })}
            onToggleFavorito={() => alternarFavorito(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12 },
  headerTopo: { flexDirection: "row", alignItems: "center", gap: 8 },
  titulo: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary },
  subtitulo: { color: colors.textSecondary, fontSize: 13, marginTop: 2, marginLeft: 44 },
  lista: { gap: 12, paddingHorizontal: 16, paddingBottom: 24 },
  vazioContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  vazioTitulo: { fontSize: 17, fontWeight: "bold", marginBottom: 6, color: colors.textPrimary },
  vazioTexto: { color: colors.textSecondary, textAlign: "center" },
});
import { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEventos } from "../context/EventosContext";
import { useFavoritos } from "../context/FavoritosContext";
import EventoCard from "../components/EventoCard";
import MenuButton from "../components/MenuButton";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { eventos, carregando } = useEventos();
  const { ehFavorito, alternarFavorito } = useFavoritos();
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(eventos.map((e) => e.categoria)));
    return ["Todos", ...unicas];
  }, [eventos]);

  const eventosFiltrados =
    categoriaAtiva === "Todos" ? eventos : eventos.filter((e) => e.categoria === categoriaAtiva);

  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <MenuButton cor="#fff" />
        <Text style={styles.bannerEyebrow}>Destaques da semana</Text>
        <Text style={styles.bannerTitulo}>Descubra novos eventos</Text>
        <Text style={styles.bannerSubtitulo}>{eventos.length} eventos disponíveis para você</Text>
      </View>

      <View style={styles.filtrosWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categorias}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtros}
          renderItem={({ item }) => {
            const ativo = item === categoriaAtiva;
            return (
              <Pressable onPress={() => setCategoriaAtiva(item)} style={[styles.filtroChip, ativo && styles.filtroChipAtivo]}>
                <Text style={[styles.filtroTexto, ativo && styles.filtroTextoAtivo]}>{item}</Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={eventosFiltrados}
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
            favorito={ehFavorito(item.id)}
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
  carregandoContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  banner: { backgroundColor: colors.blue, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20 },
  bannerEyebrow: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "600", marginTop: 12, marginBottom: 6 },
  bannerTitulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  bannerSubtitulo: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  filtrosWrapper: { backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10 },
  filtros: { gap: 8, paddingHorizontal: 16 },
  filtroChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  filtroChipAtivo: { backgroundColor: colors.blue, borderColor: colors.blue },
  filtroTexto: { fontSize: 13, color: colors.textPrimary, fontWeight: "600" },
  filtroTextoAtivo: { color: "#fff" },
  lista: { gap: 12, padding: 16 },
});
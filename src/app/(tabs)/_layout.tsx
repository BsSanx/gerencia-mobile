import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
        }}
      />
      <Tabs.Screen
        name="meus-eventos"
        options={{
          title: "Meus Eventos",
        }}
      />
    </Tabs>
  );
}
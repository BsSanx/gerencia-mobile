import { Stack } from "expo-router";
import { MenuProvider } from "../../context/MenuContext";
import AppSidebar from "../../components/AppSidebar";

export default function TabsLayout() {
  return (
    <MenuProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <AppSidebar />
    </MenuProvider>
  );
}
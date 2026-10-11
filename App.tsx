import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Timeline } from "./src/components/Timeline";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Timeline />
    </SafeAreaProvider>
  );
}

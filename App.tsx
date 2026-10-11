import {
  HubotSans_400Regular,
  HubotSans_500Medium,
} from "@expo-google-fonts/hubot-sans";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Timeline } from "./src/components/Timeline";
import { colors } from "./src/theme";

export default function App() {
  const [loaded, error] = useFonts({
    HubotSans_400Regular,
    HubotSans_500Medium,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  });

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Timeline />
    </SafeAreaProvider>
  );
}

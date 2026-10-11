import { BlurView, type BlurTint } from "expo-blur";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../theme";

type GlassProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: BlurTint;
};

export function Glass({
  children,
  style,
  intensity = 72,
  tint = "systemThinMaterialLight",
}: GlassProps) {
  return (
    <View style={[styles.clip, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        blurMethod="dimezisBlurViewSdk31Plus"
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassEdge,
    backgroundColor: "transparent",
  },
});

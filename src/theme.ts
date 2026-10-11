import { Platform, type TextStyle } from "react-native";

export const colors = {
  background: "#FFFFFF",
  text: "#1C1C1E",
  muted: "#6C6C70",
  faint: "#8E8E93",
  line: "rgba(60, 60, 67, 0.12)",
  pressed: "rgba(0, 0, 0, 0.04)",
  glassStroke: "rgba(255, 255, 255, 0.72)",
  glassEdge: "rgba(0, 0, 0, 0.06)",
  chip: "rgba(255, 255, 255, 0.92)",
  accent: "#007AFF",
};

/** San Francisco on iPhone. Other platforms use their system sans. */
export const systemFont = Platform.select({
  ios: undefined,
  android: "sans-serif",
  default:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif',
});

export function text(weight: TextStyle["fontWeight"] = "400"): TextStyle {
  return {
    fontFamily: systemFont,
    fontWeight: weight,
  };
}

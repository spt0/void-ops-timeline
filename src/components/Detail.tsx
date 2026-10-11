import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatExact, formatRelativeLabel } from "../lib/time";
import { colors, text } from "../theme";
import type { ScheduleItem } from "../types";
import { Glass } from "./Glass";

type DetailProps = {
  item: ScheduleItem;
  now: Date;
  onClose: () => void;
};

export function Detail({ item, now, onClose }: DetailProps) {
  const insets = useSafeAreaInsets();
  const when = new Date(item.when);
  const barHeight = insets.top + 52;

  return (
    <View accessibilityViewIsModal style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: barHeight + 16, paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Glass style={styles.card} intensity={68}>
          <View style={styles.cardBody}>
            <Text style={styles.agent}>{item.agent}</Text>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.relative}>{formatRelativeLabel(when, now)}</Text>
            <Text style={styles.exact}>{formatExact(when)}</Text>
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
          </View>
        </Glass>
        <Text selectable style={styles.iso}>
          {item.when}
        </Text>
      </ScrollView>
      <Glass intensity={90} tint="systemChromeMaterialLight" style={[styles.bar, { height: barHeight }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver a la agenda"
          hitSlop={12}
          onPress={onClose}
          style={[styles.back, { marginTop: insets.top }]}
        >
          <Text style={styles.backLabel}>Volver</Text>
        </Pressable>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    zIndex: 2,
  },
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    backgroundColor: "transparent",
  },
  back: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    cursor: "pointer",
  },
  backLabel: {
    ...text("400"),
    fontSize: 17,
    color: colors.accent,
  },
  content: {
    paddingHorizontal: 20,
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  card: {
    borderRadius: 22,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  agent: {
    ...text("600"),
    fontSize: 13,
    color: colors.faint,
    marginBottom: 6,
  },
  action: {
    ...text("700"),
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
  },
  relative: {
    ...text("400"),
    fontSize: 17,
    lineHeight: 22,
    color: colors.text,
    marginTop: 18,
  },
  exact: {
    ...text("400"),
    fontSize: 15,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 4,
  },
  note: {
    ...text("400"),
    fontSize: 17,
    lineHeight: 24,
    color: colors.text,
    marginTop: 22,
  },
  iso: {
    ...text("400"),
    fontSize: 13,
    color: colors.faint,
    marginTop: 20,
    paddingHorizontal: 4,
  },
});

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatExact, formatRelativeLabel } from "../lib/time";
import { colors, fonts } from "../theme";
import type { ScheduleItem } from "../types";

type DetailProps = {
  item: ScheduleItem;
  now: Date;
  onClose: () => void;
};

export function Detail({ item, now, onClose }: DetailProps) {
  const insets = useSafeAreaInsets();
  const when = new Date(item.when);

  return (
    <View
      accessibilityViewIsModal
      style={[styles.screen, { paddingBottom: insets.bottom }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8 },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver a la agenda"
          hitSlop={12}
          onPress={onClose}
          style={styles.back}
        >
          <Text style={styles.backLabel}>Volver</Text>
        </Pressable>

        <Text style={styles.agent}>{item.agent}</Text>
        <Text style={styles.action}>{item.action}</Text>

        <Text style={styles.relative}>{formatRelativeLabel(when, now)}</Text>
        <Text style={styles.exact}>{formatExact(when)}</Text>

        {item.note ? <Text style={styles.note}>{item.note}</Text> : null}

        <Text selectable style={styles.iso}>
          {item.when}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    zIndex: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  back: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    marginBottom: 36,
    cursor: "pointer",
  },
  backLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.muted,
  },
  agent: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.muted,
    marginBottom: 10,
  },
  action: {
    fontFamily: fonts.serif,
    fontSize: 42,
    lineHeight: 48,
    color: colors.text,
    marginBottom: 28,
  },
  relative: {
    fontFamily: fonts.sans,
    fontSize: 18,
    color: colors.text,
  },
  exact: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.muted,
    marginTop: 6,
  },
  note: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    lineHeight: 30,
    color: colors.text,
    marginTop: 36,
  },
  iso: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.faint,
    marginTop: 48,
  },
});

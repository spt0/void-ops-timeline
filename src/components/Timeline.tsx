import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AppState,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { schedule } from "../data/schedule";
import { emptyCopy, FILTERS, selectItems, type FilterId } from "../lib/schedule";
import { formatRelativeLabel } from "../lib/time";
import { colors, fonts } from "../theme";
import type { ScheduleItem } from "../types";
import { Detail } from "./Detail";

export function Timeline() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ScheduleItem>>(null);
  const [now, setNow] = useState(() => new Date());
  const [filter, setFilter] = useState<FilterId>("todos");
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<ScheduleItem | null>(null);

  const refreshTimes = useCallback(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    const id = setInterval(refreshTimes, 30_000);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshTimes();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [refreshTimes]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined" || !document.body) return;
    document.body.style.backgroundColor = colors.background;
    document.title = "Void — Agenda";
  }, []);

  const items = useMemo(() => selectItems(schedule, now, filter), [now, filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshTimes();
    setTimeout(() => setRefreshing(false), 450);
  }, [refreshTimes]);

  const onFilter = useCallback((id: FilterId) => {
    setFilter(id);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  return (
    <View style={styles.screen}>
      <View style={[styles.column, { paddingTop: insets.top }]}>
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          extraData={now}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text}
              colors={[colors.text]}
              progressBackgroundColor={colors.background}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 48 },
          ]}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.kicker}>Void</Text>
              <Text accessibilityRole="header" style={styles.title}>
                Agenda
              </Text>
              <Text style={styles.dek}>Lo que viene.</Text>
              <View style={styles.filters}>
                {FILTERS.map((entry) => {
                  const active = entry.id === filter;
                  return (
                    <Pressable
                      key={entry.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => onFilter(entry.id)}
                      style={styles.chip}
                    >
                      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                        {entry.label}
                      </Text>
                      <View style={[styles.chipRule, active && styles.chipRuleActive]} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nada por ahora.</Text>
              <Text style={styles.emptyBody}>{emptyCopy(filter)}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Row item={item} now={now} onPress={() => setSelected(item)} />
          )}
        />
      </View>
      {selected ? (
        <Detail item={selected} now={now} onClose={() => setSelected(null)} />
      ) : null}
    </View>
  );
}

function Row({
  item,
  now,
  onPress,
}: {
  item: ScheduleItem;
  now: Date;
  onPress: () => void;
}) {
  const label = formatRelativeLabel(new Date(item.when), now);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${item.agent}. ${item.action}`}
      android_ripple={{ color: "rgba(255,255,255,0.06)" }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.meta}>
        <Text style={styles.time}>{label}</Text>
        <Text style={styles.dot}>  ·  </Text>
        <Text style={styles.agent}>{item.agent}</Text>
      </Text>
      <Text style={styles.action}>{item.action}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  column: {
    flex: 1,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  listContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  kicker: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 64,
    lineHeight: 70,
    color: colors.text,
    marginTop: 10,
  },
  dek: {
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 24,
    color: colors.muted,
    marginTop: 8,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 22,
    marginTop: 36,
  },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    cursor: "pointer",
  },
  chipLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.muted,
  },
  chipLabelActive: {
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  chipRule: {
    height: 1,
    marginTop: 6,
    backgroundColor: "transparent",
  },
  chipRuleActive: {
    backgroundColor: colors.text,
  },
  row: {
    paddingHorizontal: 24,
    paddingVertical: 26,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    cursor: "pointer",
  },
  rowPressed: {
    backgroundColor: colors.pressed,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontFamily: fonts.sans,
    color: colors.muted,
  },
  dot: {
    fontFamily: fonts.sans,
    color: colors.faint,
  },
  agent: {
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  action: {
    fontFamily: fonts.sans,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
    marginTop: 6,
  },
  empty: {
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  emptyTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 36,
    lineHeight: 42,
    color: colors.text,
  },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginTop: 12,
  },
});

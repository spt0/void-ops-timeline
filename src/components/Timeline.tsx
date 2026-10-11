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
import { colors, text } from "../theme";
import type { ScheduleItem } from "../types";
import { Detail } from "./Detail";
import { Glass } from "./Glass";

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
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    document.documentElement.style.backgroundColor = colors.background;
    if (document.body) document.body.style.backgroundColor = colors.background;
    document.title = "Agenda";
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
      <View style={styles.column}>
        <FlatList
          ref={listRef}
          style={styles.list}
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
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 },
          ]}
          ListHeaderComponent={
            <View style={styles.header}>
              <Glass style={styles.filterBar} intensity={80} tint="systemChromeMaterialLight">
                <View style={styles.filterRow}>
                  {FILTERS.map((entry) => {
                    const active = entry.id === filter;
                    return (
                      <Pressable
                        key={entry.id}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        onPress={() => onFilter(entry.id)}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                          {entry.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Glass>
            </View>
          }
          ListEmptyComponent={
            <Glass style={styles.emptyCard} intensity={64}>
              <View style={styles.emptyBody}>
                <Text style={styles.emptyTitle}>Nada por ahora.</Text>
                <Text style={styles.emptyCopy}>{emptyCopy(filter)}</Text>
              </View>
            </Glass>
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
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Glass style={styles.card} intensity={60}>
        <View style={styles.cardBody}>
          <Text style={styles.meta}>
            <Text style={styles.time}>{label}</Text>
            <Text style={styles.dot}>  ·  </Text>
            <Text style={styles.agent}>{item.agent}</Text>
          </Text>
          <Text style={styles.action}>{item.action}</Text>
        </View>
      </Glass>
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
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    backgroundColor: colors.background,
  },
  filterBar: {
    borderRadius: 16,
    padding: 4,
    borderColor: colors.glassStroke,
  },
  filterRow: {
    flexDirection: "row",
    gap: 4,
  },
  chip: {
    flex: 1,
    minHeight: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    cursor: "pointer",
  },
  chipActive: {
    backgroundColor: colors.chip,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chipLabel: {
    ...text("500"),
    fontSize: 13,
    color: colors.muted,
  },
  chipLabelActive: {
    ...text("600"),
    color: colors.text,
  },
  row: {
    marginHorizontal: 20,
    marginTop: 12,
    cursor: "pointer",
  },
  rowPressed: {
    opacity: 0.72,
  },
  card: {
    borderRadius: 22,
    borderColor: colors.glassStroke,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  cardBody: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  time: {
    ...text("400"),
    color: colors.muted,
  },
  dot: {
    ...text("400"),
    color: colors.faint,
  },
  agent: {
    ...text("600"),
    color: colors.text,
  },
  action: {
    ...text("600"),
    fontSize: 17,
    lineHeight: 22,
    color: colors.text,
    marginTop: 4,
  },
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 22,
  },
  emptyBody: {
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  emptyTitle: {
    ...text("600"),
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
  },
  emptyCopy: {
    ...text("400"),
    fontSize: 16,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 6,
  },
});

import Items from "../../../types/Item";
import {
  SixItemEntry,
  SixItemGroup,
  BUCKET_START,
  ALWAYS_BUY_THRESHOLD,
  bucketOfTime,
  normalizeItemKey,
  effectiveValue,
} from "./sixItemBuildTypes";

const BUCKET_MIN_COST: Record<string, number> = {
  early: 0,
  early_lane: 350,
  early_mid: 1000,
  mid: 2000,
  late: 2000,
  "ultra late": 2000,
  "end game": 4000,
};

const BASE_OPTIONAL_CUTOFF = 1;
const CUTOFF_PER_CORE_ITEM = 0;
const DEBUG_FORCE_INCLUDE_ITEM_KEYS = new Set<string>([
  // Add normalized item keys here while debugging, e.g. "black_king_bar"
]);

const isDebugForcedItem = (itemKey: string) =>
  DEBUG_FORCE_INCLUDE_ITEM_KEYS.has(normalizeItemKey(itemKey));

export const groupSixItems = (
  items: SixItemEntry[],
  itemData: Items,
): SixItemGroup[] => {
  const buckets: Record<string, SixItemEntry[]> = Object.fromEntries(
    Object.keys(BUCKET_START).map((k) => [k, []]),
  );

  for (const item of items) {
    const ev = effectiveValue(item);
    if (ev < ALWAYS_BUY_THRESHOLD) {
      buckets[bucketOfTime(item.time)].push(item);
    }
  }

  const clusters: { bucket: string; items: SixItemEntry[] }[] = Object.entries(buckets)
    .filter(([, b]) => b.length > 0)
    .map(([bucket, items]) => ({
      bucket,
      items: items.filter(
        (i) => (itemData?.items[normalizeItemKey(i.key)].cost ?? 0) >= (BUCKET_MIN_COST[bucket] ?? 0),
      ),
    }))
    .filter(({ items }) => items.length > 0);

  const groups: SixItemGroup[] = [];

  for (const item of items) {
    if (effectiveValue(item) >= ALWAYS_BUY_THRESHOLD) {
      groups.push({ type: "always", item });
    }
  }

  for (const item of items) {
    if (!isDebugForcedItem(item.key)) continue;
    const alreadyIncluded = groups.some(
      (group) =>
        (group.type === "always" &&
          normalizeItemKey(group.item.key) === normalizeItemKey(item.key)) ||
        (group.type === "choice" &&
          group.items.some(
            (choiceItem) =>
              normalizeItemKey(choiceItem.key) === normalizeItemKey(item.key),
          )),
    );
    if (!alreadyIncluded) {
      groups.push({ type: "always", item });
    }
  }

  for (const { bucket, items: clusterItems } of clusters) {
    const alwaysBuy = clusterItems.filter((i) => effectiveValue(i) >= ALWAYS_BUY_THRESHOLD);
    for (const item of alwaysBuy) {
      groups.push({ type: "always", item });
    }

    const optionalCutoff = BASE_OPTIONAL_CUTOFF + alwaysBuy.length * CUTOFF_PER_CORE_ITEM;
    const eligible = clusterItems.filter(
      (i) => effectiveValue(i) < ALWAYS_BUY_THRESHOLD && effectiveValue(i) >= optionalCutoff,
    );
    const standaloneOptional = eligible.filter((i) => normalizeItemKey(i.key) === "aghanims_shard");
    const choices = eligible.filter((i) => normalizeItemKey(i.key) !== "aghanims_shard");

    for (const item of standaloneOptional) {
      groups.push({ type: "choice", chooseN: 1, items: [item], bucket });
    }
    if (choices.length === 0) continue;

    // Split choices into cost tiers so cheap and expensive items don't compete
    const COST_TIERS = [1500, 3500, 5500, Infinity];
    const tiers: SixItemEntry[][] = COST_TIERS.map(() => []);
    for (const item of choices) {
      const cost = itemData?.items[normalizeItemKey(item.key)]?.cost ?? 0;
      const tierIndex = COST_TIERS.findIndex((ceiling) => cost < ceiling);
      tiers[tierIndex].push(item);
    }

    const SINGLE_OPTIONAL_MIN = 30;
    for (const tier of tiers) {
      if (tier.length === 0) continue;
      if (tier.length === 1 && effectiveValue(tier[0]) < SINGLE_OPTIONAL_MIN) continue;
      const sum = tier.reduce((s, i) => s + effectiveValue(i), 0);
      const chooseN = Math.max(1, Math.round(sum / 100));
      groups.push({ type: "choice", chooseN, items: tier, bucket });
    }
  }

  return groups.sort((a, b) => {
    const aBucket = a.type === "always" ? bucketOfTime(a.item.time) : a.bucket;
    const bBucket = b.type === "always" ? bucketOfTime(b.item.time) : b.bucket;
    const aBucketStart = BUCKET_START[aBucket];
    const bBucketStart = BUCKET_START[bBucket] ?? 0;
    if (aBucketStart !== bBucketStart) return aBucketStart - bBucketStart;
    if (a.type !== b.type) return a.type === "always" ? -1 : 1;
    if (a.type === "always" && b.type === "always") return a.item.time - b.item.time;
    return 0;
  });
};

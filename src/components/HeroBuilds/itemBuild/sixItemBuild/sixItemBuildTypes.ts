import { CoreItem } from "../itemGroups/groupBytime";

export type SixItemEntry = CoreItem & { key: string };

export type SixItemGroup =
  | { type: "always"; item: SixItemEntry }
  | { type: "choice"; chooseN: number; items: SixItemEntry[]; bucket: string };

export const BUCKET_START: Record<string, number> = {
  early: 0,
  early_lane: 300,
  early_mid: 700,
  mid: 1300,
  late: 1800,
  "ultra late": 2700,
  "end game": 3600,
};

export const ALWAYS_BUY_THRESHOLD = 70;
export const PRO_RATIO_THRESHOLD = 1.3;

export const SORTED_BUCKET_ENTRIES = Object.entries(BUCKET_START).sort(
  (a, b) => b[1] - a[1],
);

export const bucketOfTime = (time: number) =>
  SORTED_BUCKET_ENTRIES.find(([, start]) => time >= start)?.[0] ??
  SORTED_BUCKET_ENTRIES[SORTED_BUCKET_ENTRIES.length - 1][0];

export const normalizeItemKey = (itemKey: string) => itemKey.replace(/__\d+/g, "");

export const getItemType = (itemKey: string): "item" | "shard" | "scepter" => {
  if (itemKey === "aghanims_shard") return "shard";
  if (itemKey === "ultimate_scepter") return "scepter";
  return "item";
};

export const effectiveValue = (item: CoreItem) => {
  const proFavoured =
    item.proAdjustedValue !== undefined &&
    item.proAdjustedValue > item.adjustedValue &&
    item.proRatio >= PRO_RATIO_THRESHOLD;
  return item.adjustedValue * (proFavoured ? 1 + (item.proRatio - 1) * 0.25 : 1);
};

import { CoreItem } from "../itemGroups/groupBytime";
import Items from "../../../types/Item";
import {
  SixItemEntry,
  effectiveValue,
  normalizeItemKey,
  bucketOfTime,
} from "./sixItemBuildTypes";
import { HeroBuild } from "../../buildHooks/buildTypes";

const BOOT_ITEMS = new Set(["power_treads", "guardian_greaves"]);
const DEBUG_FORCE_INCLUDE_ITEM_KEYS = new Set<string>([
//   "magic_stick",
  "kaya",
  // Add normalized item keys here while debugging, e.g. "black_king_bar"
]);

export const isBootItem = (itemKey: string) => {
  const normalizedKey = normalizeItemKey(itemKey);
  return normalizedKey.includes("boot") || BOOT_ITEMS.has(normalizedKey);
};

const isDebugForcedItem = (itemKey: string) =>
  DEBUG_FORCE_INCLUDE_ITEM_KEYS.has(normalizeItemKey(itemKey));

const sortByAdjustedValue = (items: CoreItem[]) =>
  [...items].sort((a, b) => effectiveValue(b) - effectiveValue(a));

const addItemsToPool = (items: CoreItem[], itemPool: SixItemEntry[]) => {
  for (const item of items) {
    if (!item.key) continue;
    itemPool.push({ ...item, key: item.key });
    if (item.option?.choice) {
      itemPool.push({
        ...item,
        key: item.option.choice,
        value: item.option.targetValue,
        adjustedValue: item.option.targetValue,
        time: item.option.time,
        proRatio: 1,
        proAdjustedValue: item.option.targetValue,
      });
    }
  }
};

const addDebugForcedItemsFromSource = (
  items: CoreItem[],
  itemPool: SixItemEntry[],
) => {
  for (const item of items) {
    if (!item.key) continue;
    if (isDebugForcedItem(item.key)) {
      itemPool.push({ ...item, key: item.key });
    }
    if (item.option?.choice && isDebugForcedItem(item.option.choice)) {
      itemPool.push({
        ...item,
        key: item.option.choice,
        value: item.option.targetValue,
        adjustedValue: item.option.targetValue,
        time: item.option.time,
        proRatio: 1,
        proAdjustedValue: item.option.targetValue,
      });
    }
  }
};

export const getAllComponents = (
  itemKey: string,
  itemData?: Items,
  visited = new Set<string>(),
): Set<string> => {
  if (!itemData?.items[itemKey] || visited.has(itemKey)) return new Set();
  visited.add(itemKey);
  const components = itemData.items[itemKey].components || [];
  const allComponents = new Set<string>();
  for (const component of components) {
    allComponents.add(component);
    for (const nested of getAllComponents(component, itemData, visited)) {
      allComponents.add(nested);
    }
  }
  return allComponents;
};

export const buildSixItemSummary = (
  data: HeroBuild["item_builds"],
  itemData?: Items,
): SixItemEntry[] => {
  let itemPool: SixItemEntry[] = [];
  const [earlyBuild, midBuild, lateBuild] = data;

  if (earlyBuild) {
    const earlyCore = sortByAdjustedValue(earlyBuild.core);
    addItemsToPool(earlyCore, itemPool);
    addDebugForcedItemsFromSource(earlyCore, itemPool);
  }
  if (midBuild) {
    const midCore = sortByAdjustedValue(midBuild.core);
    addItemsToPool(midCore, itemPool);
    addDebugForcedItemsFromSource(midCore, itemPool);
  }
  if (lateBuild) {
    const lateCore = sortByAdjustedValue(lateBuild.core);
    addItemsToPool(lateCore, itemPool);
    addDebugForcedItemsFromSource(lateCore, itemPool);
  }
  if (midBuild) {
    const midSituational = sortByAdjustedValue(midBuild.situational);
    addItemsToPool(midSituational, itemPool);
    addDebugForcedItemsFromSource(midSituational, itemPool);
  }
  if (lateBuild) {
    const lateSituational = sortByAdjustedValue(lateBuild.situational);
    addItemsToPool(lateSituational, itemPool);
    addDebugForcedItemsFromSource(lateSituational, itemPool);
  }
  if (earlyBuild) {
    const earlyCoreOptional = sortByAdjustedValue(earlyBuild.core).slice(1);
    const earlySituational = sortByAdjustedValue(earlyBuild.situational);
    addItemsToPool(earlyCoreOptional, itemPool);
    addDebugForcedItemsFromSource(earlyBuild.core, itemPool);
    addItemsToPool(earlySituational, itemPool);
    addDebugForcedItemsFromSource(earlySituational, itemPool);
  }
  itemPool = filterRemovedItems(itemPool);
  const BOOT_VALUE_TOLERANCE = 10;
  const bootCandidates = itemPool.filter((item) => isBootItem(item.key));
  const bestBootValue = bootCandidates.reduce(
    (max, b) => Math.max(max, effectiveValue(b)),
    0,
  );
  const preferredBoot =
    bootCandidates
      .filter((b) => effectiveValue(b) >= bestBootValue - BOOT_VALUE_TOLERANCE)
      .filter((b) => normalizeItemKey(b.key) !== "boots_of_speed")
      .sort(
        (a, b) =>
          (itemData?.items[normalizeItemKey(b.key)]?.cost ?? 0) -
          (itemData?.items[normalizeItemKey(a.key)]?.cost ?? 0),
      ) ??
    bootCandidates.sort((a, b) => effectiveValue(b) - effectiveValue(a))[0];

  const prioritizedItemPool = [...(preferredBoot ?? []), ...itemPool];

  console.log(
    "PRIORITIZED ITEM POOL:",
    prioritizedItemPool,
    "keys:",
    prioritizedItemPool.map((i) => i.key),
  );
  const selectedItems: SixItemEntry[] = [];
  const seenKeys = new Set<string>();
  const fineComponentCandidates = new Set<string>([
    "magic_stick",
    "magic_wand",
    "urn_of_shadows",
    "vanguard",
    "boots",
  ]);
  for (const item of prioritizedItemPool) {
    const normalizedKey = normalizeItemKey(item.key);
    if (seenKeys.has(normalizedKey)) continue;
    if (item.key.toLowerCase().includes("ward")) continue;
    const itemComponents = getAllComponents(normalizedKey, itemData);
    const itemBucket = bucketOfTime(item.time);
    const shouldSkipBecauseComponent = selectedItems.some((selectedItem) => {
      if (
        !fineComponentCandidates.has(item.key) &&
        bucketOfTime(selectedItem.time) === itemBucket &&
        getAllComponents(normalizeItemKey(selectedItem.key), itemData).has(
          normalizedKey,
        )
      ) {
        return true;
      } else {
        return false;
      }
    });
    if (shouldSkipBecauseComponent) {
      console.log(
        `Skipping ${item.key} because its a component of an already selected item in the same bucket`,
      );
      continue;
    }

    for (let index = selectedItems.length - 1; index >= 0; index -= 1) {
      const selectedItem = selectedItems[index];
      const selectedNormalizedKey = normalizeItemKey(selectedItem.key);
      if (
        itemComponents.has(selectedNormalizedKey) &&
        !fineComponentCandidates.has(selectedItem.key) &&
        bucketOfTime(selectedItem.time) === itemBucket
      ) {
        seenKeys.delete(selectedNormalizedKey);
        selectedItems.splice(index, 1);
      }
    }

    selectedItems.push(item);
    seenKeys.add(normalizedKey);
    // if (isBootItem(normalizedKey)) hasBoots = true;
    if (selectedItems.length === 300) break;
  }
  console.log(
    "SELECTED ITEMS BEFORE BOOTS CHECK:",
    selectedItems,
    "keys:",
    selectedItems.map((i) => i.key),
  );

  const forcedItems = prioritizedItemPool.filter((item) =>
    isDebugForcedItem(item.key),
  );
  for (const forcedItem of forcedItems) {
    const normalizedKey = normalizeItemKey(forcedItem.key);
    if (seenKeys.has(normalizedKey)) continue;
    selectedItems.push(forcedItem);
    seenKeys.add(normalizedKey);
  }

  console.log(
    "SELECTED ITEMS AFTER DEBUG FORCE INCLUDE:",
    selectedItems,
    "keys:",
    selectedItems.map((i) => i.key),
  );

  return selectedItems.sort((a, b) => a.time - b.time);
};
const filterRemovedItems = (data: SixItemEntry[]) => {
  return data.filter(
    (x) => DEBUG_FORCE_INCLUDE_ITEM_KEYS.has(x.key) || !x.removed,
  );
};

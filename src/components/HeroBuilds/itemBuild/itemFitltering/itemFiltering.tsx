import { medianValue } from "../../../../utils/medianValue";
import { Items } from "../../../types/Item";
import DotaMatch from "../../../types/matchData";
import { UnparsedBuilds } from "../../buildHooks/shortBuildHook";
import filterComponents from "../itemComponents/componentFilter";
import groupByTime from "../itemGroups/groupBytime";
import { addItemChoices } from "./itemChoices";
type ItemBuildOption = {
  original: string;
  value: number;
  choice: string;
  targetValue: number;
  time: number;
};
export type RawItemBuildValues = {
  value: number;
  adjustedValue: number;
  time: number;
  disassemble?: boolean;
  disassembledComponents?: string[][];
  option?: ItemBuildOption;
  longOption?: boolean;
  currMax?: number;
  offset?: { [key: string]: number };
  key?: string;
};
export type RawItemBuild = [string, RawItemBuildValues];

const CONSUMABLE_ITEMS = new Set([
  "tango",
  "flask",
  "branches",
  "blood_grenade",
  "ward_observer",
  "ward_sentry",
  "smoke_of_deceit",
  "enchanted_mango",
  "clarity",
  "tpscroll",
  "dust",
  "tome_of_knowledge",
  "faerie_fire",
  "great_famango",
  "famango",
  "dagon_2",
  "dagon_3",
  "dagon_4",
]);

const humanToUnix = (time: string | number) => {
  if (typeof time === "number") {
    return 0;
  }
  const split = time.split(":");
  const hours = +split[0] * 3600;
  const mins = +split[1] * 60;
  const secs = +split[2];
  return hours + mins + secs;
};

export const countItems = (
  data: DotaMatch[],
  itemData: Items,
  filter?: string,
) => {
  const itemTimesByKey = new Map<string, number[]>();
  for (const match of data) {
    const duplicateCountByKey = new Map<string, number>();
    for (const item of match["items"]) {
      const itemKey = item["key"];
      if (itemKey === "tpscroll") continue;
      if (filter === "consumables" && CONSUMABLE_ITEMS.has(itemKey)) continue;
      if (!itemData["items"][itemKey]) continue;

      const seenCount = duplicateCountByKey.get(itemKey) || 0;
      let key = itemKey;
      if (
        seenCount > 0 &&
        itemKey !== "aghanims_shard" &&
        itemKey !== "ultimate_scepter"
      ) {
        key = `${itemKey}__${seenCount}`;
      }
      duplicateCountByKey.set(itemKey, seenCount + 1);

      const time =
        typeof item["time"] === "string"
          ? humanToUnix(item["time"])
          : item["time"];
      if (time <= 0) continue;

      const times = itemTimesByKey.get(key);
      if (times) {
        times.push(time);
      } else {
        itemTimesByKey.set(key, [time]);
      }
    }
  }

  const itemValues: { [key: string]: { value: number; time: number } } = {};
  for (const [key, filteredItemTimes] of itemTimesByKey.entries()) {
    const medianTime = medianValue(filteredItemTimes);
    const avgTime =
      filteredItemTimes.reduce((a, b) => a + b, 0) / filteredItemTimes.length;
    const time = Math.min(medianTime, avgTime);
    if (!key.match(/__\d+/g) || avgTime <= 800) {
      itemValues[key] = {
        value: filteredItemTimes.length,
        time: time,
      };
    }
  }

  const matchMeta = data.map((match) => {
    const counts = new Map<string, number>();
    for (const item of match["items"]) {
      const itemKey = item["key"];
      counts.set(itemKey, (counts.get(itemKey) || 0) + 1);
    }
    const lastTime = Number(
      match["items"][match["items"].length - 1]?.["time"],
    );
    return { counts, lastTime };
  });

  const map = Object.entries(itemValues)
    .filter((item) => (item[1]["value"] / data.length) * 100 > 1)
    .map((item): RawItemBuild => {
      let missingBeforeEndCount = 0;
      let includedMatchCount = 0;
      const cleanedKey = item[0].replace(/__\d+/g, "");
      const itemNum: string[] | null = item[0].match(/\d+/g);
      const requiredItemCount = itemNum ? +itemNum[0] + 1 : 1;

      for (const match of matchMeta) {
        const inItems =
          (match.counts.get(cleanedKey) || 0) >= requiredItemCount;
        if (inItems) {
          includedMatchCount++;
        } else if (match.lastTime - 300 > item[1]["time"]) {
          // only count items where they're bought at least 5 mins before game ending
          missingBeforeEndCount++;
        }
      }
      const o: RawItemBuild = [
        item[0],
        {
          value: (item[1]["value"] / data.length) * 100,
          adjustedValue:
            (includedMatchCount /
              (includedMatchCount + missingBeforeEndCount)) *
            100,
          time: item[1]["time"],
        },
      ];
      return o;
    })
    .filter(Boolean);
  return map.sort((a, b) => a[1]["time"] - b[1]["time"]);
};

export const bootsFilter = (data: RawItemBuild[]) => {
  const boots = [
    "tranquil_boots",
    "arcane_boots",
    "power_treads",
    "phase_boots",
  ];
  const bootsCount = data.filter((x) => {
    if (x[0].includes("boot") && x[0].match(/\d/g)) {
      return false;
    }
    return boots.includes(x[0].replace(/__\d+/g, ""));
  }).length;
  const filtered = data.filter((x) => {
    if (x[0].includes("boot") && x[0].match(/\d/g)) {
      return false;
    }
    if (boots.includes(x[0].replace(/__\d+/g, ""))) {
      return (
        +(100 / x[1]["value"]).toFixed(0) < bootsCount ||
        +(100 / x[1]["value"]).toFixed(0) === 1
      );
    } else {
      return true;
    }
  });
  return filtered;
};

const filterItems = (
  itemData: Items,
  roleKey: string,
  matchData?: DotaMatch[],
  shortBuild?: UnparsedBuilds,
  filter?: string,
) => {
  // const start = performance.now()
  let itemBuild = !shortBuild
    ? countItems(matchData!, itemData, filter)
    : (shortBuild["items"].map((x) => [
        x["key"],
        {
          value: x["value"],
          time: x["time"],
          adjustedValue: x["adjustedValue"],
        },
      ]) as RawItemBuild[]);
  // const end = performance.now()
  // console.log(itemBuild)
  itemBuild = filterComponents(itemBuild, itemData);
  // itemBuild = bootsFilter(itemBuild)
  if (!shortBuild) itemBuild = addItemChoices(itemBuild, matchData!, itemData);
  const groupedItems = groupByTime(itemBuild, roleKey);
  // console.log('filterCompoentns:', performance.now() - start, 'ms')
  return groupedItems;
};

export default filterItems;

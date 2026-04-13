import { useEffect, useState } from "react";
import abilityFilter from "../abillityBuild/abilityFiltering";
import filterItems from "../itemBuild/itemFitltering/itemFiltering";
import countStartingItems from "../itemBuild/startingItems/startingItemsFilter";
import {
  NeutralItemCounts,
  mostUsedNeutrals,
} from "../itemBuild/neutralItems/mostUsedNeutrals";
import { mostUsedTalents } from "../abillityBuild/talentLevels";
import { Items } from "../../types/Item";
import { PageHeroData } from "../../types/heroData";
import { GroupedCoreItems } from "../itemBuild/itemGroups/groupBytime";
import { facetFilter } from "../abillityBuild/facetFiltering";
import { UnparsedBuilds } from "./shortBuildHook";
import DotaMatch from "../../types/matchData";
import { HeroBuild } from "./buildTypes";

const ENABLE_BUILD_PROFILING = process.env.NODE_ENV !== "production";
const nowMs = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
const roundMs = (value: number) => Math.round(value * 100) / 100;
const normalizeItemKey = (itemKey: string) => itemKey.replace(/__\d+/g, "");

type UseHeroBuildsArgs = {
  filteredData?: { [role: string]: DotaMatch[] };
  heroData: PageHeroData;
  itemData: Items;
  api: boolean;
  shortBuild?: { [key: string]: UnparsedBuilds };
  filter?: string;
};
const useHeroBuilds = ({
  filteredData,
  heroData,
  itemData,
  api,
  shortBuild,
  filter,
}: UseHeroBuildsArgs) => {
  const [heroBuilds, setHeroBuilds] = useState<Record<string, HeroBuild>>();
  const hasItemData =
    !!itemData &&
    !!itemData["items"] &&
    Object.keys(itemData["items"]).length > 0;
  const hasHeroData = !!heroData && Object.keys(heroData).length > 0;
  // const [filterComponents, setFilterComponents] = useState(false)
  // const [filterBoots, setFilterBoots] = useState(false)
  // const [filterPerc, setFilterPerc] = useState(1)

  const getUltimateAbility = () => {
    for (const k in heroData) {
      const hero = heroData?.[k];
      if (!hero?.["abilities"]) continue;
      const abilities = hero["abilities"];
      for (const abilityKey in abilities) {
        const ability = abilities[abilityKey];
        if (ability?.["max_level"] === 3) {
          return ability["name"];
        }
      }
    }
  };
  useEffect(() => {
    const updateHeroBuilds = () => {
      const totalStart = nowMs();
      const stepTimings: Record<string, number> = {};
      const trackStep = (step: string, startTime: number) => {
        if (!ENABLE_BUILD_PROFILING) return;
        stepTimings[step] = (stepTimings[step] || 0) + (nowMs() - startTime);
      };
      const updatedBuilds: Record<string, HeroBuild> = {};
      const hasFullFilteredData =
        !!filteredData &&
        Object.values(filteredData).some((matches) => matches.length > 0);
      let stepStart = nowMs();
      const ultimateAbility = getUltimateAbility();
      trackStep("getUltimateAbility", stepStart);
      if (shortBuild && !hasFullFilteredData) {
        console.log("loading short build", shortBuild);
        const srted = Object.entries(shortBuild).sort(
          (a, b) => b[1]["length"] - a[1]["length"],
        );
        for (const role of srted) {
          const roleStart = nowMs();
          const buildData = shortBuild[role[0]];
          stepStart = nowMs();
          const itemBuild = filterItems(
            itemData,
            role[0],
            undefined,
            buildData,
          );
          trackStep("filterItems", stepStart);
          const count = itemBuildLengthChecker(itemBuild);
          if (count < 2) {
            console.log(`removed role: ${Object.keys(role)} count: ${count}`);
            continue;
          }
          stepStart = nowMs();
          const abilityBuilds = abilityFilter(undefined, buildData) || [[]];
          trackStep("abilityFilter", stepStart);
          stepStart = nowMs();
          const startingItemBuilds = Object.entries(
            buildData["starting_items"],
          );
          trackStep("startingItems", stepStart);
          stepStart = nowMs();
          const neutralItems = buildData["neutral_items"];
          const d: {
            [key: string]: {
              neutral_items: NeutralItemCounts[];
              enchants: NeutralItemCounts[];
            };
          } = {};
          for (const key in neutralItems) {
            d[key] = {
              enchants: neutralItems[key],
              neutral_items: neutralItems[key],
            };
          }
          trackStep("neutralItems", stepStart);
          stepStart = nowMs();
          const talents = Object.entries(buildData["talents"]);
          trackStep("talents", stepStart);
          const res = {
            item_builds: itemBuild,
            facet_builds: buildData.facets,
            ability_builds: abilityBuilds[0],
            starting_items: startingItemBuilds,
            neutral_items: d,
            talents: talents,
            ultimate_ability: ultimateAbility,
            length: buildData["length"],
          };
          console.log("shortbuild", res);
          updatedBuilds[role[0]] = res;
          if (ENABLE_BUILD_PROFILING) {
            console.log(
              `[useHeroBuilds] role=${role[0]} mode=short elapsed=${roundMs(nowMs() - roleStart)}ms`,
            );
          }
        }
      } else if (filteredData) {
        for (const key in filteredData) {
          const roleStart = nowMs();
          let buildData = filteredData[key];
          stepStart = nowMs();
          const facetBuilds = facetFilter(buildData, heroData) || [];
          trackStep("facetFilter", stepStart);
          if (api && facetBuilds.length) {
            const facetSort = facetBuilds.sort(
              (a, b) => +b["perc"] - +a["perc"],
            );
            buildData = buildData.filter(
              (match) => match.variant === facetSort[0]["key"],
            );
            filter = "consumables";
          }
          stepStart = nowMs();
          const itemBuild = filterItems(
            itemData,
            key,
            buildData,
            undefined,
            filter,
          );
          trackStep("filterItems", stepStart);
          const proMatches = buildData.filter((m) => m.pro);
          //   console.log(
          //     `[proRatio] role=${key} proMatches=${proMatches.length} total=${buildData.length}`,
          //   );
          if (proMatches.length >= 5) {
            const proItemBuild = filterItems(
              itemData,
              key,
              proMatches,
              undefined,
              filter,
            );
            const proMap = new Map<string, number>();
            for (const slot of proItemBuild) {
              for (const items of Object.values(slot)) {
                for (const item of items) {
                  if (!item.key) continue;

                  const exactKey = item.key;
                  const normalizedKey = normalizeItemKey(item.key);
                  const existingExact = proMap.get(exactKey) ?? 0;
                  const existingNormalized = proMap.get(normalizedKey) ?? 0;

                  proMap.set(
                    exactKey,
                    Math.max(existingExact, item.adjustedValue),
                  );
                  proMap.set(
                    normalizedKey,
                    Math.max(existingNormalized, item.adjustedValue),
                  );
                }
              }
            }
            // console.log(`[proRatio] proMap keys:`, [...proMap.keys()]);
            for (const slot of itemBuild) {
              for (const items of Object.values(slot)) {
                for (const item of items) {
                  if (item.key) {
                    const proVal =
                      proMap.get(item.key) ??
                      proMap.get(normalizeItemKey(item.key)) ??
                      0;
                    item.proRatio =
                      proVal > 0 ? proVal / (item.adjustedValue || 1) : 0;
                    if (item.proRatio < 1) {
                      item.proRatio = 1 + (1 - item.proRatio);
                    }
                    item.proAdjustedValue = proVal;
                    // if (item.proRatio > 0)
                    //   console.log(
                    //     `[proRatio] ${item.key}: proVal=${proVal.toFixed(1)} overall=${item.adjustedValue.toFixed(1)} ratio=${item.proRatio.toFixed(2)}`,
                    //   );
                  }
                }
              }
            }
          }
          const count = itemBuildLengthChecker(itemBuild);
          if (count < 2) {
            console.log(`removed key: ${key} count: ${count}`);
            continue;
          }
          stepStart = nowMs();
          const abilityBuilds = abilityFilter(buildData) || [[]];
          trackStep("abilityFilter", stepStart);
          stepStart = nowMs();
          const startingItemBuilds = countStartingItems(buildData);
          trackStep("startingItems", stepStart);
          stepStart = nowMs();
          const neutralItems = mostUsedNeutrals(buildData, itemData);
          trackStep("neutralItems", stepStart);
          stepStart = nowMs();
          const talentBuild = mostUsedTalents(buildData);
          trackStep("talents", stepStart);
          const res = {
            item_builds: itemBuild,
            facet_builds: facetBuilds,
            ability_builds: abilityBuilds[0],
            starting_items: startingItemBuilds,
            neutral_items: neutralItems,
            talents: talentBuild,
            ultimate_ability: ultimateAbility,
          };
          console.log(res);
          updatedBuilds[key] = res;
          if (ENABLE_BUILD_PROFILING) {
            console.log(
              `[useHeroBuilds] role=${key} matches=${buildData.length} mode=full elapsed=${roundMs(nowMs() - roleStart)}ms`,
            );
          }
        }
      }
      if (ENABLE_BUILD_PROFILING) {
        const totalElapsed = roundMs(nowMs() - totalStart);
        const breakdown = Object.entries(stepTimings)
          .sort((a, b) => b[1] - a[1])
          .map(([step, ms]) => `${step}=${roundMs(ms)}ms`)
          .join(" | ");
        console.log(
          `[useHeroBuilds] total=${totalElapsed}ms roles=${Object.keys(updatedBuilds).length}`,
        );
        console.log(`[useHeroBuilds] breakdown ${breakdown}`);
      }
      setHeroBuilds(updatedBuilds);
    };
    // Call the function to update hero builds
    const canRunShort = !!shortBuild && hasItemData;
    const canRunFull = !!filteredData && hasItemData && hasHeroData;
    if (canRunShort || canRunFull) {
      updateHeroBuilds();
    } else {
      setHeroBuilds(undefined);
    }
  }, [
    filteredData,
    shortBuild,
    heroData,
    itemData,
    hasHeroData,
    hasItemData,
    api,
    // filterBoots,
    // filterComponents,
    filter,
  ]);
  // console.log(heroBuilds)
  return heroBuilds;
};
const itemBuildLengthChecker = (itemBuild: GroupedCoreItems[]) => {
  let count = 0;
  for (const entry of itemBuild) {
    for (const key in entry) {
      if (key !== "core") continue;
      if (entry[key].length >= 2) count++;
    }
  }
  return count;
};
export default useHeroBuilds;

import { Items } from "../../../types/Item";
import DotaMatch from "../../../types/matchData";
import { RawItemBuild, countItems } from "./itemFiltering";

type ItemChoiceResult = {
  original: string;
  value: number;
  choice: string;
  targetValue: number;
  time: number;
};

type ChoiceContext = {
  primaryItem: RawItemBuild;
  allCandidateItems: RawItemBuild[];
  alternativeItems: RawItemBuild[];
  itemData: Items;
  togetherPurchaseRateByKey: Map<string, number>;
};

const OPTION_VALUE_GAP = 5;
const MAX_TOGETHER_PURCHASE_RATE = 35;

const normalizeItemKey = (itemKey: string) => itemKey.replace(/__\d+/g, "");

const timeBracket = (item: RawItemBuild) => {
  if (item[1]["time"] < 700) {
    return "early";
  } else if (item[1]["time"] < 1800) {
    return "mid";
  } else {
    return "late";
  }
};
export const choices = (
  primaryItem: RawItemBuild,
  allCandidateItems: RawItemBuild[],
  matchData: DotaMatch[],
  itemData: Items,
) => {
  const primaryItemKey = normalizeItemKey(primaryItem[0]);
  const primaryAdjustedValue = primaryItem[1]["adjustedValue"];
  if (primaryAdjustedValue > 90 || primaryAdjustedValue < 20) {
    return;
  }
  if (primaryItem[1]["value"] < 5) {
    return;
  }
  const matchesWithPrimaryItem = matchData.filter((match) =>
    match["items"].some((item) => normalizeItemKey(item["key"]) === primaryItemKey),
  );
  const matchesWithoutPrimaryItem = matchData.filter(
    (match) =>
      !match["items"].some(
        (item) => normalizeItemKey(item["key"]) === primaryItemKey,
      ),
  );
  const alternativeItems = countItems(matchesWithoutPrimaryItem, itemData);
  const togetherPurchaseRateByKey = new Map<string, number>();

  for (const candidateItem of allCandidateItems) {
    const candidateItemKey = normalizeItemKey(candidateItem[0]);
    if (candidateItemKey === primaryItemKey) continue;

    const matchesWithBothItems = matchesWithPrimaryItem.filter((match) =>
      match["items"].some(
        (item) => normalizeItemKey(item["key"]) === candidateItemKey,
      ),
    ).length;
    const togetherPurchaseRate =
      matchesWithPrimaryItem.length > 0
        ? (matchesWithBothItems / matchesWithPrimaryItem.length) * 100
        : 0;

    togetherPurchaseRateByKey.set(candidateItem[0], togetherPurchaseRate);
    togetherPurchaseRateByKey.set(candidateItemKey, togetherPurchaseRate);
  }

  return choice({
    primaryItem,
    allCandidateItems,
    alternativeItems,
    itemData,
    togetherPurchaseRateByKey,
  });
};
export const choice = ({
  primaryItem,
  allCandidateItems,
  alternativeItems,
  itemData,
  togetherPurchaseRateByKey,
}: ChoiceContext) => {
  const primaryItemKey = normalizeItemKey(primaryItem[0]);
  const primaryItemCost: number = itemData["items"][primaryItemKey]["cost"]!;
  const primaryAdjustedValue = primaryItem[1]["adjustedValue"];
  if (primaryAdjustedValue > 75 || primaryAdjustedValue < 20) {
    return;
  }
  const primaryTimeBracket = timeBracket(primaryItem);
  const alternativeItemKeys = alternativeItems.map((itemEntry) => itemEntry[0]);
  let bestChoice: ItemChoiceResult | undefined;
  let bestScore = Number.POSITIVE_INFINITY;

  const updateBestChoice = (
    candidate: ItemChoiceResult,
    candidateItemCost: number,
  ) => {
    const score =
      Math.abs(candidate.targetValue - primaryAdjustedValue) +
      Math.abs(candidate.time - primaryItem[1]["time"]) / 60 +
      Math.abs(candidateItemCost - primaryItemCost) / 100;

    if (score < bestScore) {
      bestChoice = candidate;
      bestScore = score;
    }
  };

  for (const candidateItem of allCandidateItems) {
    const candidateItemKey = normalizeItemKey(candidateItem[0]);
    if (
      primaryItemKey === candidateItemKey ||
      !itemData["items"][candidateItemKey]
    )
      continue;
    // if (!componentChecker(itemData, key, targetKey)) continue;
    const candidateAdjustedValue = candidateItem[1]["adjustedValue"];
    const candidateTimeBracket = timeBracket(candidateItem);
    const candidateItemCost: number = itemData["items"][candidateItemKey]["cost"]!;
    if (
      Math.abs(primaryItemCost - candidateItemCost) >
        (primaryItemCost / 100) * 20 ||
      candidateTimeBracket !== primaryTimeBracket ||
      Math.abs(candidateItem[1]["time"] - primaryItem[1]["time"]) > 900
    ) {
      continue;
    }
    if (candidateAdjustedValue < 15) continue;

    // check if item is in same bracket
    // if (
    //   (candidateAdjustedValue > 25 && primaryAdjustedValue < 25) ||
    //   (candidateAdjustedValue < 25 && primaryAdjustedValue > 25)
    // )
    //   continue;
    if (candidateAdjustedValue > 80) continue;
    if (
      (togetherPurchaseRateByKey.get(candidateItem[0]) ??
        togetherPurchaseRateByKey.get(candidateItemKey) ??
        0) > MAX_TOGETHER_PURCHASE_RATE
    ) {
      continue;
    }

    if (alternativeItemKeys.includes(candidateItem[0])) {
      const alternativeItemIndex = alternativeItemKeys.findIndex(
        (itemKey) => itemKey === candidateItem[0],
      );
      const resolvedCandidateItem = alternativeItems[alternativeItemIndex];
      const resolvedCandidateAdjustedValue =
        resolvedCandidateItem[1]["adjustedValue"];
      if (
        resolvedCandidateAdjustedValue < 50 &&
        primaryAdjustedValue - resolvedCandidateAdjustedValue >=
          OPTION_VALUE_GAP
      ) {
        updateBestChoice(
          {
            original: primaryItemKey,
            value: primaryAdjustedValue,
            choice: resolvedCandidateItem[0],
            targetValue: resolvedCandidateAdjustedValue,
            time: resolvedCandidateItem[1]["time"],
          },
          candidateItemCost,
        );
      }
    } else {
      if (candidateAdjustedValue >= 50) continue;
      updateBestChoice(
        {
          original: primaryItemKey,
          value: primaryAdjustedValue,
          choice: candidateItem[0],
          targetValue: candidateItem[1]["adjustedValue"],
          time: candidateItem[1]["time"],
        },
        candidateItemCost,
      );
    }
  }
  return bestChoice;
};
export const addItemChoices = (
  allCandidateItems: RawItemBuild[],
  matchData: DotaMatch[],
  itemData: Items,
) => {
  allCandidateItems.forEach((candidateItem, index: number) => {
    const res = choices(candidateItem, allCandidateItems, matchData, itemData);
    if (res) {
      allCandidateItems[index][1]["option"] = res;
    }
  });
  return allCandidateItems;
};

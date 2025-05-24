import { Items } from "../../../types/Item";
import DotaMatch from "../../../types/matchData";

export type NeutralItemCounts = {
  key: string;
  count: number;
  tier: number;
  totalGameOfTier?: number;
  perc: number;
  enchantment?: string;
};

export type NeutralItemsStats = Record<string, NeutralItemCounts>;

export const mostUsedNeutrals = (matchData: DotaMatch[], itemData: Items) => {
  const tierCountArr: {
    enchants: NeutralItemsStats;
    neutral_items: NeutralItemsStats;
  }[] = [];
  for (let tier = 1; tier <= 5; tier++) {
    const neutralItemCount: NeutralItemsStats = {};
    const enchantmentCount: NeutralItemsStats = {};

    const totalGameOfTier = matchData.reduce((count, match) => {
      if (match.neutral_item_history) {
        return (
          count +
          match.neutral_item_history.filter((item) => {
            const neutralItem = itemData.items[item.item_neutral];
            if (!neutralItem) {
              return false;
            }
            return neutralItem.tier === tier;
          }).length
        );
      }

      const neutralItem = itemData.items[match.item_neutral];
      return count + (neutralItem && neutralItem.tier === tier ? 1 : 0);
    }, 0);

    for (const match of matchData) {
      if (match.neutral_item_history) {
        match.neutral_item_history.forEach(
          ({ item_neutral, item_neutral_enhancement }) => {
            const neutralItem = itemData.items[item_neutral];
            if (!neutralItem) {
              return;
            }
            if (neutralItem.tier !== tier) return;

            const customKey = `${item_neutral}__${item_neutral_enhancement}`;
            const itemCount = (neutralItemCount[customKey]?.count || 0) + 1;

            neutralItemCount[customKey] = {
              key: customKey,
              count: itemCount,
              tier,
              totalGameOfTier,
              perc: (itemCount / totalGameOfTier) * 100,
            };
          }
        );
      } else if (match.item_neutral) {
        const neutralItem = itemData.items[match.item_neutral];
        if (neutralItem.tier !== tier) continue;

        const itemCount =
          (neutralItemCount[match.item_neutral]?.count || 0) + 1;

        neutralItemCount[match.item_neutral] = {
          key: match.item_neutral,
          count: itemCount,
          tier,
          totalGameOfTier,
          perc: (itemCount / totalGameOfTier) * 100,
        };
      }
    }

    for (const match of matchData) {
      if (match.neutral_item_history) {
        match.neutral_item_history.forEach(
          ({ item_neutral, item_neutral_enhancement }) => {
            const neutralItem = itemData.items[item_neutral];
            if (neutralItem?.tier !== tier) return;

            const enchantCount =
              (enchantmentCount[item_neutral_enhancement]?.count || 0) + 1;

            enchantmentCount[item_neutral_enhancement] = {
              key: item_neutral_enhancement,
              count: enchantCount,
              tier,
              totalGameOfTier,
              perc: (enchantCount / totalGameOfTier) * 100,
            };
          }
        );
      }
    }

    tierCountArr.push({
      enchants: enchantmentCount,
      neutral_items: neutralItemCount,
    });
  }

  const sortNeutrals = (items: NeutralItemsStats) => {
    const grouped = new Map<
      string,
      {
        count: number;
        topEnchant: string;
        tier: number;
        totalGameOfTier: number;
      }
    >();

    for (const [key, item] of Object.entries(items)) {
      const baseKey = key.split("__")[0];
      const enchantment = key.split("__")[1];

      if (!grouped.has(baseKey)) {
        grouped.set(baseKey, {
          count: 0,
          topEnchant: enchantment,
          tier: item.tier,
          totalGameOfTier: item.totalGameOfTier!,
        });
      }

      grouped.get(baseKey)!.count += item.count;
    }

    return Array.from(grouped.entries())
      .map(([key, { count, topEnchant, tier, totalGameOfTier }]) => ({
        key,
        count,
        perc: (count / totalGameOfTier) * 100,
        tier,
        enchantment: topEnchant,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const result: Record<
    string,
    { neutral_items: NeutralItemCounts[]; enchants: NeutralItemCounts[] }
  > = {
    tier_1: { neutral_items: [], enchants: [] },
    tier_2: { neutral_items: [], enchants: [] },
    tier_3: { neutral_items: [], enchants: [] },
    tier_4: { neutral_items: [], enchants: [] },
    tier_5: { neutral_items: [], enchants: [] },
  };

  for (let i = 0; i < tierCountArr.length; i++) {
    result[`tier_${i + 1}`].neutral_items = sortNeutrals(
      tierCountArr[i].neutral_items
    ).slice(0, 4);
    result[`tier_${i + 1}`].enchants = sortNeutrals(
      tierCountArr[i].enchants
    ).slice(0, 4);
  }

  return result;
};

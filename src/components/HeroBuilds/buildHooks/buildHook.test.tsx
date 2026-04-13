import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useHeroBuilds from "./buildHook";
import type { PageHeroData } from "../../types/heroData";
import type { Items } from "../../types/Item";
import type DotaMatch from "../../types/matchData";
import type { UnparsedBuilds } from "./shortBuildHook";

const abilityFilterMock = vi.fn();
const filterItemsMock = vi.fn();
const countStartingItemsMock = vi.fn();
const mostUsedNeutralsMock = vi.fn();
const mostUsedTalentsMock = vi.fn();
const facetFilterMock = vi.fn();

vi.mock("../abillityBuild/abilityFiltering", () => ({
  default: (...args: unknown[]) => abilityFilterMock(...args),
}));

vi.mock("../itemBuild/itemFitltering/itemFiltering", () => ({
  default: (...args: unknown[]) => filterItemsMock(...args),
}));

vi.mock("../itemBuild/startingItems/startingItemsFilter", () => ({
  default: (...args: unknown[]) => countStartingItemsMock(...args),
}));

vi.mock("../itemBuild/neutralItems/mostUsedNeutrals", () => ({
  mostUsedNeutrals: (...args: unknown[]) => mostUsedNeutralsMock(...args),
}));

vi.mock("../abillityBuild/talentLevels", () => ({
  mostUsedTalents: (...args: unknown[]) => mostUsedTalentsMock(...args),
}));

vi.mock("../abillityBuild/facetFiltering", () => ({
  facetFilter: (...args: unknown[]) => facetFilterMock(...args),
}));

const baseHeroData = {
  antimage: {
    abilities: {
      antimage_mana_void: {
        max_level: 3,
        name: "antimage_mana_void",
      },
    },
  },
} as unknown as PageHeroData;

const baseItemData = {
  items: {
    blink: {
      id: 1,
      dname: "Blink Dagger",
    },
  },
} as unknown as Items;

const groupedItemsResult = [
  { core: [{ key: "blink" }, { key: "bkb" }], situational: [] },
  { core: [{ key: "manta" }, { key: "butterfly" }], situational: [] },
];

const neutralsResult = {
  tier_1: { neutral_items: [], enchants: [] },
  tier_2: { neutral_items: [], enchants: [] },
  tier_3: { neutral_items: [], enchants: [] },
  tier_4: { neutral_items: [], enchants: [] },
  tier_5: { neutral_items: [], enchants: [] },
};

const shortBuildFixture: { [key: string]: UnparsedBuilds } = {
  Support: {
    abilities: { a_count: { skill_order: 10 } },
    items: [
      {
          key: "blink",
          value: 70,
          adjustedValue: 65,
          time: 1200,
          proRatio: 0,
          proAdjustedValue: 0,
          itemCount: 0,
          totalMatches: 0
      },
    ],
    talents: {},
    starting_items: { branches: 5 },
    neutral_items: {
      tier_1: [{ key: "trusty_shovel", count: 10, tier: 1, perc: 40 }],
    },
    facets: [{ key: 1, count: 10, perc: "100", title: "facet_1" }],
    length: 10,
  },
};
const emptyFilteredData: Record<string, DotaMatch[]> = {};

describe("useHeroBuilds", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    abilityFilterMock.mockReturnValue([[["skill_order", 10]]]);
    filterItemsMock.mockReturnValue(groupedItemsResult);
    countStartingItemsMock.mockReturnValue([["branches", 30]]);
    mostUsedNeutralsMock.mockReturnValue(neutralsResult);
    mostUsedTalentsMock.mockReturnValue([]);
    facetFilterMock.mockReturnValue([{ key: 1, count: 10, perc: "100", title: "facet_1" }]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("returns undefined and skips computation when key params are undefined", () => {
    const { result } = renderHook(() =>
      useHeroBuilds({
        filteredData: undefined,
        heroData: undefined as unknown as PageHeroData,
        itemData: undefined as unknown as Items,
        api: false,
        shortBuild: undefined,
      }),
    );

    expect(result.current).toBeUndefined();
    expect(filterItemsMock).not.toHaveBeenCalled();
    expect(abilityFilterMock).not.toHaveBeenCalled();
  });

  it("uses short builds as placeholder when filteredData is undefined", async () => {
    const { result } = renderHook(() =>
      useHeroBuilds({
        filteredData: undefined,
        heroData: baseHeroData,
        itemData: baseItemData,
        api: false,
        shortBuild: shortBuildFixture,
      }),
    );

    await waitFor(() => {
      expect(result.current?.Support).toBeDefined();
    });

    expect(filterItemsMock).toHaveBeenCalledWith(
      baseItemData,
      "Support",
      undefined,
      shortBuildFixture.Support,
    );
    expect(countStartingItemsMock).not.toHaveBeenCalled();
    expect(result.current?.Support.ultimate_ability).toBe("antimage_mana_void");
  });

  it("uses short builds as placeholder when filteredData is an empty object", async () => {
    const { result } = renderHook(() =>
      useHeroBuilds({
        filteredData: emptyFilteredData,
        heroData: baseHeroData,
        itemData: baseItemData,
        api: false,
        shortBuild: shortBuildFixture,
      }),
    );

    await waitFor(() => {
      expect(result.current?.Support).toBeDefined();
    });

    expect(filterItemsMock).toHaveBeenCalledWith(
      baseItemData,
      "Support",
      undefined,
      shortBuildFixture.Support,
    );
  });

  it("builds from full filteredData when correctly formed params are provided", async () => {
    const filteredData = {
      Midlane: [{ role: "Midlane", items: [], abilities: [] } as unknown as DotaMatch],
    };

    const { result } = renderHook(() =>
      useHeroBuilds({
        filteredData,
        heroData: baseHeroData,
        itemData: baseItemData,
        api: false,
        shortBuild: shortBuildFixture,
      }),
    );

    await waitFor(() => {
      expect(result.current?.Midlane).toBeDefined();
    });

    expect(facetFilterMock).toHaveBeenCalledWith(filteredData.Midlane, baseHeroData);
    expect(countStartingItemsMock).toHaveBeenCalledWith(filteredData.Midlane);
    expect(mostUsedNeutralsMock).toHaveBeenCalledWith(filteredData.Midlane, baseItemData);
    expect(mostUsedTalentsMock).toHaveBeenCalledWith(filteredData.Midlane);
    expect(result.current?.Midlane.ultimate_ability).toBe("antimage_mana_void");
  });
});

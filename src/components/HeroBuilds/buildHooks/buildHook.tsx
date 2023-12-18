import { useReducer, useEffect, useState } from "react";
import { NonProDataType } from "../builds/build";
import abilityFilter from "../abillityBuild/abilityFiltering";
import filterItems from "../itemBuild/itemFitltering/itemFiltering";
import countStartingItems from "../itemBuild/startingItems/startingItemsFilter";
import { mostUsedNeutrals } from "../itemBuild/neutralItems/mostUsedNeutrals";
import { mostUsedTalents } from "../abillityBuild/talentLevels";
import { Items } from "../../types/Item";
import { PageHeroData } from "../../types/heroData";
import { AbilityBuildEntry, Talents } from "../builds/buildCell";
import { CoreItem } from "../itemBuild/itemGroups/groupBytime";
export type HeroBuild = {
    item_builds: {
        [key: string]: CoreItem[],
    }[];
    ability_builds: AbilityBuildEntry[] | never[];
    ability_medians: {
        [key: string]: number;
    } | undefined;
    starting_items: [string, number][];
    neutral_items: [string, {
        count: number;
        tier: number;
        perc: number;
    }][][];
    talents: Talents
    ultimate_ability: string | undefined;
}
export const useHeroBuilds = (filteredData: { [role: string]: NonProDataType[] }, heroData: PageHeroData, itemData: Items) => {
    const [heroBuilds, setHeroBuilds] = useState<Record<string, HeroBuild>>()
    const getUltimateAbility = () => {
        for (const k in heroData) {
            const abilities = heroData[k]['abilities']
            for (const abilityKey in abilities) {
                const ability = abilities[abilityKey]
                if (ability['max_level'] === 3) {
                    return ability['name']
                }

            }
        }
    }
    useEffect(() => {
        const updateHeroBuilds = () => {
            const updatedBuilds: Record<string, HeroBuild> = {};
            for (const key in filteredData) {
                const buildData = filteredData[key];
                const itemBuild = filterItems(buildData, itemData, key);
                const abilityBuilds = abilityFilter(buildData) || [[]];
                const startingItemBuilds = countStartingItems(buildData);
                const neutralItems = mostUsedNeutrals(buildData, itemData)
                const talentBuild = mostUsedTalents(buildData)
                const ultimateAbility = getUltimateAbility()
                const res = {
                    'item_builds': itemBuild, 'ability_builds': abilityBuilds[0], 'ability_medians': abilityBuilds[1], 'starting_items': startingItemBuilds,
                    'neutral_items': neutralItems, 'talents': talentBuild, 'ultimate_ability': ultimateAbility
                };
                console.log(res)
                updatedBuilds[key] = res;
            }
            setHeroBuilds(updatedBuilds)
        };
        // Call the function to update hero builds
        if (filteredData) {
            updateHeroBuilds();
        }

    }, [filteredData]);
    // console.log(heroBuilds)
    return heroBuilds;

}
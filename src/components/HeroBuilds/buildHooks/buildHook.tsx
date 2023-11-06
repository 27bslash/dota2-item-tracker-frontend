import { useReducer, useEffect } from "react";
import { NonProDataType } from "../build";
import Items from "../../types/Item";
import abilityFilter from "../abillityBuild/abilityFiltering";
import filterItems from "../itemBuild/itemFitltering/itemFiltering";
import countStartingItems from "../itemBuild/startingItems/startingItemsFilter";
import { mostUsedNeutrals } from "../itemBuild/neutralItems/mostUsedNeutrals";
import { mostUsedTalents } from "../abillityBuild/talentLevels";

export const useHeroBuilds = (filteredData: { [role: string]: NonProDataType[] }, heroData: any, itemData: Items) => {
    const [heroBuilds, setHeroBuilds] = useReducer((states: any, updates: any) => {
        switch (updates.type) {
            case 'clear':
                return ({})
            default:
                return ({ ...states, ...updates })
        }
    }, {})
    const getUltimateAbility = () => {
        for (let k in heroData) {
            const abilities = heroData[k]['abilities']
            for (let abilityKey in abilities) {
                const ability = abilities[abilityKey]
                if (ability['max_level'] === 3) {
                    return ability['name']
                }

            }
        }
    }
    useEffect(() => {
        const updateHeroBuilds = () => {
            setHeroBuilds({ type: 'clear' })
            for (let key in filteredData) {
                const buildData = filteredData[key];
                const itemBuild = filterItems(buildData, itemData, key);
                const abilityBuilds = abilityFilter(buildData);
                const startingItemBuilds = countStartingItems(buildData);
                const neutralItems = mostUsedNeutrals(buildData, itemData)
                const talentBuild = mostUsedTalents(buildData)
                const ultimate_ability = getUltimateAbility()
                const res = {
                    'item_builds': itemBuild, 'ability_builds': abilityBuilds, 'starting_items': startingItemBuilds,
                    'neutral_items': neutralItems, 'talents': talentBuild, 'ultimate_ability': ultimate_ability
                };
                setHeroBuilds({ [key]: res })
            }
        };
        // Call the function to update hero builds
        if (filteredData) {
            updateHeroBuilds();
        }

    }, [filteredData]);
    if (heroBuilds) {
        // console.log(heroBuilds)
        return heroBuilds;
    }
}
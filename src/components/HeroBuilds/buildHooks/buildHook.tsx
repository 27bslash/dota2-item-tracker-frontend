import { useReducer, useEffect } from "react";
import { NonProDataType } from "../build";
import Items from "../../types/Item";
import abilityFilter from "../abillityBuild/abilityFiltering";
import filterItems from "../itemBuild/itemFitltering/itemFiltering";
import countStartingItems from "../itemBuild/startingItems/startingItemsFilter";
import { mostUsedNeutrals } from "../itemBuild/neutralItems/mostUsedNeutrals";

export const useHeroBuilds = (filteredData: { [key: string]: NonProDataType[] } | undefined, itemData: Items) => {
    const [heroBuilds, setHeroBuilds] = useReducer((states: any, updates: any) => {
        switch (updates.type) {
            case 'clear':
                return ({})
            default:
                return ({ ...states, ...updates })
        }
    }, {})

    useEffect(() => {
        const updateHeroBuilds = () => {
            setHeroBuilds({ type: 'clear' })
            for (let key in filteredData) {
                const buildData = filteredData[key];
                const itemBuild = filterItems(buildData, itemData, key);
                const abilityBuilds = abilityFilter(buildData);
                const startingItemBuilds = countStartingItems(buildData);
                const neutralItems = mostUsedNeutrals(buildData, itemData)
                const res = [itemBuild, abilityBuilds, startingItemBuilds, neutralItems];
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
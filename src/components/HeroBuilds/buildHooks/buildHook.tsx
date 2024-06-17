import { useEffect, useState } from 'react'
import abilityFilter from '../abillityBuild/abilityFiltering'
import filterItems from '../itemBuild/itemFitltering/itemFiltering'
import countStartingItems from '../itemBuild/startingItems/startingItemsFilter'
import { mostUsedNeutrals } from '../itemBuild/neutralItems/mostUsedNeutrals'
import { mostUsedTalents } from '../abillityBuild/talentLevels'
import { Items } from '../../types/Item'
import { PageHeroData } from '../../types/heroData'
import { AbilityBuildEntry, Talents } from '../builds/buildCell'
import { CoreItem, GroupedCoreItems } from '../itemBuild/itemGroups/groupBytime'
import { NonProDataType } from '../types'
import { facetFilter } from '../abillityBuild/facetFiltering'
export type HeroBuild = {
    item_builds: {
        [key: string]: CoreItem[]
    }[]
    ability_builds: AbilityBuildEntry[] | never[]
    ability_medians:
        | {
              [key: string]: number
          }
        | undefined
    starting_items: [string, number][]
    neutral_items: [
        string,
        {
            count: number
            tier: number
            perc: number
        }
    ][][]
    talents: Talents
    ultimate_ability: string | undefined
    facet_builds: {
        key: number
        count: number
        perc: string
    }[]
}
export const useHeroBuilds = (
    filteredData: { [role: string]: NonProDataType[] },
    heroData: PageHeroData,
    itemData: Items,
    api: boolean
) => {
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
            const updatedBuilds: Record<string, HeroBuild> = {}
            for (const key in filteredData) {
                let buildData = filteredData[key]
                const facetBuilds = facetFilter(buildData)
                if (api) {
                    const facetSort = facetBuilds.sort(
                        (a, b) => +b['perc'] - +a['perc']
                        )
                    buildData = buildData.filter(
                        (match) => match.variant === facetSort[0]['key']
                    )
                }
                const itemBuild = filterItems(buildData, itemData, key)
                const count = itemBuildLengthChecker(itemBuild)
                if (count < 2) {
                    console.log(`removed key: ${key} count: ${count}`)
                    continue
                }
                const abilityBuilds = abilityFilter(buildData) || [[]]
                const startingItemBuilds = countStartingItems(buildData)
                const neutralItems = mostUsedNeutrals(buildData, itemData)
                const talentBuild = mostUsedTalents(buildData)
                const ultimateAbility = getUltimateAbility()
                const res = {
                    item_builds: itemBuild,
                    facet_builds: facetBuilds,
                    ability_builds: abilityBuilds[0],
                    ability_medians: abilityBuilds[1],
                    starting_items: startingItemBuilds,
                    neutral_items: neutralItems,
                    talents: talentBuild,
                    ultimate_ability: ultimateAbility,
                }
                console.log(res)
                updatedBuilds[key] = res
            }
            setHeroBuilds(updatedBuilds)
        }
        // Call the function to update hero builds
        if (filteredData) {
            updateHeroBuilds()
        }
    }, [filteredData])
    // console.log(heroBuilds)
    return heroBuilds
}
const itemBuildLengthChecker = (itemBuild: GroupedCoreItems[]) => {
    let count = 0
    for (const entry of itemBuild) {
        for (const key in entry) {
            if (key !== 'core') continue
            if (entry[key].length >= 2) count++
        }
    }
    return count
}

import { matchSorter } from 'match-sorter'
import { useEffect, useState } from 'react'
import Hero from '../../types/heroList'
const acronymFinder = (heroList: Hero[], target: string) => {
    const acronyms = []
    for (const hero of heroList) {
        const split = hero['name'].split(' ')
        if (split.length === 1) {
            continue
        }
        // const acronym = split[0][0] + split[1][0]
        let acronym = ''
        for (const word of split) {
            acronym += word[0]
        }
        if (acronym.startsWith(target)) {
            acronyms.push(hero)
        }
    }
    return acronyms
}
export const useFilterHeroes = (
    heroList: Hero[],
    filteredHeroes: string[] | undefined,
    value: string
) => {
    const [sortedHeroes, setSortedHeroes] = useState<string[]>([])
    useEffect(() => {
        const legacyNames: { [key: string]: string } = {
            bounty_hunter: 'gondar',
            bristleback: 'bristle_back',
            io: 'wisp',
            jakiro: 'thd',
            leshrac: 'disco_pony',
            lifestealer: 'naix',
            mirana: 'priestess_of_the_moon',
            night_stalker: 'balanar',
            spirit_breaker: 'bara',
            undying: 'dirge',
            windranger: 'wind_runner',
            invoker: 'carl',
            shadow_shaman: 'pollywog_priest',
        }
        if (value.length > 1) {
            const searchText = value.toLowerCase()
            const copy = [...heroList]
            const heroMatches = matchSorter(
                copy.map((x) => {
                    x.name = x.name.replace(/-|_/g, ' ')
                    return x
                }),
                searchText,
                {
                    keys: [
                        {
                            threshold: matchSorter.rankings.CONTAINS,
                            key: 'name',
                        },
                    ],
                }
            ).slice(0, 8)
            const legacyList = [...heroList].map((x) => {
                // const newName = x['name'].replace(' ', '_') in legacyNames ? legacyNames[x['name'].replace(' ', '_')] : undefined
                const newName = legacyNames[x['name'].replace(' ', '_')]
                if (newName) return { id: x['id'], name: newName }
                return x
            })
            const legacyHeroMatches = matchSorter(
                legacyList.map((x) => {
                    x.name = x.name.replace(/-|_/g, ' ')
                    return x
                }),
                searchText,
                {
                    keys: [
                        {
                            threshold: matchSorter.rankings.CONTAINS,
                            key: 'name',
                        },
                    ],
                }
            ).slice(0, 8)
            const combinedLists = copy.concat(legacyList)
            const acronyms = acronymFinder(combinedLists, searchText)
            const allResults = acronyms
                .concat(heroMatches)
                .concat(legacyHeroMatches)
            const filteredBySearch: string[] = []
            const seenIds = new Set()
            for (const heroObj of allResults) {
                const heroId = heroObj['id']
                if (!seenIds.has(heroId)) {
                    const convertedHero = copy.find((x) => x['id'] === heroId)

                    filteredBySearch.push(convertedHero!.name)
                    seenIds.add(heroId)
                }
            }
            setSortedHeroes(filteredBySearch)
        } else {
            if (filteredHeroes) {
                setSortedHeroes(filteredHeroes)
            } else {
                setSortedHeroes(
                    [...heroList].map((x) => x.name.replace(/\s/g, '_'))
                )
            }
        }
    }, [value])
    return sortedHeroes
}

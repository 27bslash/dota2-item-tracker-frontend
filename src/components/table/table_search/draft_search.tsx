import { matchSorter } from "match-sorter"
import heroSwitcher from "../../../utils/heroSwitcher"
import Hero from "../../types/heroList"
import DotaMatch from "../../types/matchData"

class DraftSearch {
    heroSearch = (search: string, heroList: Hero[], hero: string) => {
        let ret: string[] = []
        search = search.replace(' ', '_')
        const sorted = matchSorter([...heroList].filter((x) => x.name !== hero), search, { keys: [{ threshold: matchSorter.rankings.ACRONYM, key: 'name' }] }).reverse().map(x => x.name)
        ret = [...ret, ...sorted]
        return ret
    }
    handleDraftSearch = (matchData: DotaMatch[], heroList: Hero[], search: string, hero: string, i = 0) => {
        // const heroes = heroSearch(search, heroList)

        // const draftRes: Set<string> = new Set()
        const matches: Set<DotaMatch> = new Set()
        const dict: { [item: string]: { index: number, matches: DotaMatch[] } } = {}
        const heroName = search.replace(/\+|-/g, '')
        const heroes = this.heroSearch(heroName, heroList, hero)
        // console.log('h', heroes)
        for (const tHero of heroes) {
            const targetHero = heroSwitcher(tHero)
            // console.log(targetHero)
            for (const match of matchData) {
                let symbol = null
                symbol = search.match(/\+|-/g)
                if (symbol) symbol = symbol[0]
                const draf = this.draftChecker(match, hero, targetHero, symbol)
                if (draf) {
                    // draftRes.add(`${symbol || ''}${targetHero}`)
                    matches.add(match)
                    dict[`${symbol || ''}${targetHero}`] ? dict[`${symbol || ''}${targetHero}`]['matches'].push(match) : dict[`${symbol || ''}${targetHero}`] = { 'matches': [match], index: i }

                }
            }
        }
        if (matches.size) {
            return dict
        }
    }

    draftChecker = (match: DotaMatch, hero: string, targetHero: string, symbol: string | null) => {
        let rad = match['radiant_draft'].includes(targetHero)
        let dire = match['dire_draft'].includes(targetHero)
        if (!rad && !dire) {
            return null
        }
        if (symbol === '-') {
            rad = !match['radiant_draft'].includes(targetHero) && match['radiant_draft'].includes(hero)
            dire = !match['dire_draft'].includes(targetHero) && match['dire_draft'].includes(hero)
            console.log(symbol, targetHero, hero, match, rad, dire)

        } else if (!symbol) {
            if (rad || dire) {
                return match['id']
            }
        }
        if ((match['radiant_draft'].includes(hero) && rad) || (match['dire_draft'].includes(hero) && dire)) {
            console.log('ret', match)
            return match['id']
        }


    }
}
export default DraftSearch
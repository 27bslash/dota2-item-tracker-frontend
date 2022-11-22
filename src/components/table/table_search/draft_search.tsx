import { matchSorter } from "match-sorter"
import heroSwitcher from "../../heroSwitcher"

class DraftSearch {
    heroSearch = (search: string, heroList: any[]) => {
        let ret: any[] = []
        search = search.replace(' ', '_')
        const sorted = matchSorter(heroList.map((x: any) => {
            return x
        }), search, { keys: [{ threshold: matchSorter.rankings.ACRONYM, key: 'name' }] }).reverse().map(x => x.name)
        ret = [...ret, ...sorted]
        return ret
    }
    handleDraftSearch = (matchData: any, heroList: any, search: string, hero: string) => {
        // const heroes = heroSearch(search, heroList)
        const matches: any = new Set()
        const split = search.split(',')
        for (let term of split) {
            term = term.replace(/\+|-/g, '')
            const heroes = this.heroSearch(term, heroList)
            console.log(heroes)
            for (let tHero of heroes) {
                const targetHero = heroSwitcher(tHero)
                console.log(targetHero)
                for (let match of matchData) {
                    let symbol = null
                    symbol = term.match(/\+|-/g)
                    if (symbol) symbol = symbol[0]
                    const draf = this.draftChecker(match, hero, targetHero, symbol)
                    if (draf) {
                        matches.add(match)
                    }
                }
            }
        }
        return matches
    }
    draftChecker = (match: any, hero: string, targetHero: string, symbol: string | null) => {
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
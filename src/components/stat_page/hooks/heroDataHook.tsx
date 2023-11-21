import { useEffect, useState } from "react"
import { baseApiUrl } from "../../../App"
import DotaMatch from "../../types/matchData"
import { PageHeroData } from "../../types/heroData"

export const useHeroData = (type: string, totalMatchData: DotaMatch[], role: string, nameParam: string) => {

    const [heroData, setHeroData] = useState<PageHeroData>({})
    const [visited, setVisited] = useState<Set<string>>(new Set())
    const [total, setTotal] = useState<string[]>([])

    useEffect(() => {
        (async () => {
            const sett: Set<string> = new Set()

            if (type !== 'player') {
                const hData = await fetch(`${baseApiUrl}files/hero-data/${nameParam}`)
                const hJson = await hData.json()
                setHeroData({ [nameParam]: hJson })
            } else {
                for (const match of totalMatchData) {
                    sett.add(match['hero'])
                }
                setVisited(sett)
            }
        }
        )()
    }, [totalMatchData])
    async function getHeroData(hero: string) {
        const hData = await fetch(`${baseApiUrl}files/hero-data/${hero}`)
        const hJson = await hData.json()
        const o = heroData
        o[hero] = hJson
        setHeroData(o)
    }
    useEffect(() => {
        for (const hero of visited) {
            if (!total.includes(hero)) {
                getHeroData(hero)
                setTotal((prev) => [...prev, hero])
            }
        }
    }, [visited])
    return heroData
}
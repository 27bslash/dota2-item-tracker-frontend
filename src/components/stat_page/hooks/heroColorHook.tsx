import { useEffect, useState } from "react"
import { baseApiUrl } from "../../../App"
import { generateColorPalette } from "../../../utils/changeTheme"

export const useHeroColor = (type: string, heroName: string) => {
    const [heroColor, setHeroColor] = useState('')
    useEffect(() => {
        (async () => {
            if (type === 'hero') {
                const hc = await fetch(`${baseApiUrl}files/colors`)
                const json = await hc.json()
                for (let colorObj of json['colors']) {
                    let targetHero = heroName
                    if (targetHero === 'earth_spirit') targetHero = 'undying'
                    const badReds = ['ursa', 'lion']
                    const badBrowns = ['dragon_knight', 'bristleback', 'monkey_king',]
                    if (badReds.includes(heroName)) targetHero = 'doom_bringer'
                    if (badBrowns.includes(heroName)) targetHero = 'gyrocopter'
                    if (heroName === 'ember_spirit' || heroName === 'rattletrap') targetHero = 'clinkz'
                    if (heroName === 'abyssal_underlord') targetHero = 'muerta'
                    if (colorObj['hero'] !== targetHero) continue
                    setHeroColor(`rgb(${colorObj['color'][0]}, ${colorObj['color'][1]}, ${colorObj['color'][2]})`)
                    const colorSUm = colorObj['uncontrasted'][1] + colorObj['uncontrasted'][2]
                    const greenRatio = colorObj['uncontrasted'][1] / colorSUm
                    if ((Math.max(...colorObj['uncontrasted']) === colorObj['uncontrasted'][1] ||
                        Math.max(...colorObj['uncontrasted']) - 50 <= colorObj['uncontrasted'][1])
                        && colorObj['uncontrasted'][1] - colorObj['uncontrasted'][2] > 50 && (greenRatio > 0.6 || colorObj['uncontrasted'][1] > 170)) {
                        continue
                    }
                    generateColorPalette([colorObj['uncontrasted'][0], colorObj['uncontrasted'][1], colorObj['uncontrasted'][2]], targetHero);

                }
            } else {
                setHeroColor('player')
            }
        })()
    }, [heroName, type])
    return heroColor
}
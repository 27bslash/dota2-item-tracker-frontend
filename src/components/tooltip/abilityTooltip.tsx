/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useEffect } from 'react'
import TooltipAttributes from './tooltipAttributes'
import TooltipLore from './tooltipLore'
import CdMc from './cdmc'
import Color from 'color-thief-react'
import { highlight_numbers } from './tooltipDescription'
import AbilityAttributes from './abilityAttributes'
import { usePageContext } from '../stat_page/pageContext'

const AbilityTooltip = (props: any) => {
    const id = props.ability.id
    const [open, setOpen] = useState(false)
    const [ability, setAbility] = useState<any>()
    const { nameParam, heroData } = usePageContext()
    useEffect(() => {
        if (heroData && Object.keys(heroData).length) {
            if (heroData[nameParam] && id && !ability) {
                setAbility(heroData[nameParam].abilities[+id])
            } else if (!ability) {
                const concattedAbililites = Object.values(heroData)
                    .map((hero) => hero.abilities)
                    .flat()
                for (const ab of concattedAbililites) {
                    const abilityId = props.ability['id']
                    const a = ab[abilityId]
                    if (a) setAbility(a)
                }
            }
        }
    }, [open, heroData])
    // const fac = new FastAverageColor()
    // const options = { width: '55px', height: '55px' }
    const image = new Image(55, 55)
    image.src = props.img
    // console.log(image)
    // const averageColor = fac.getColor(image)
    // console.log(averageColor)

    return (
        <>
            {ability && (
                <Color src={props.img} crossOrigin="anonymous" format="hex">
                    {({ data, loading, error }) => {
                        return (
                            <div
                                className="tooltip"
                                id="ability-tooltip"
                                // style={{
                                //     background: `radial-gradient(circle at top left, ${data} 0%, #11171c 160px`,
                                // }}
                            >
                                <div
                                    className="tooltip-line-one"
                                    style={{
                                        background: `linear-gradient(to right, ${data}, #11171c)`,
                                    }}
                                >
                                    <div className="tooltip-title">
                                        <img
                                            className="tooltip-img"
                                            alt={props.img}
                                            src={props.img}
                                            width="55px"
                                        ></img>
                                        <h3>{ability.name_loc}</h3>
                                    </div>
                                </div>
                                <div className="tooltip-content">
                                    <AbilityAttributes ability={ability} />
                                    {ability['desc_loc'] &&
                                        ability['desc_loc'].length && (
                                            <div
                                                className="tooltip-description"
                                                style={{ color: '#c9d1dd' }}
                                            >
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlight_numbers(
                                                            ability['desc_loc']
                                                        ),
                                                    }}
                                                ></p>
                                            </div>
                                        )}
                                    <TooltipAttributes
                                        itemProperties={ability}
                                    ></TooltipAttributes>
                                    <TooltipLore
                                        itemProperties={ability}
                                    ></TooltipLore>
                                </div>
                                <div className="tooltip-footer">
                                    <CdMc
                                        mana_costs={ability.mana_costs}
                                        cooldowns={ability.cooldowns}
                                    ></CdMc>
                                </div>
                            </div>
                        )
                    }}
                </Color>
            )}
        </>
    )
}

export default AbilityTooltip

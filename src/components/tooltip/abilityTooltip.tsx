import { useState } from 'react';
import { useEffect } from 'react';
import TooltipAttributes from './tooltipAttributes';
import TooltipLore from './tooltipLore';
import CdMc from './cdmc';
import colorTooltip from './colorTooltip';
const AbilityTooltip = (props: any) => {
    let id = props.ability.id
    const [open, setOpen] = useState(false)
    const [ability, setAbility] = useState<any>([])
    const [color, setColor] = useState('')
    useEffect(() => {
        for (let hero of props.heroData) {
            if (hero[props.heroName]) {
                setAbility(hero[props.heroName].abilities[+id])
            }
        }
    }, [open])



    useEffect(() => {
        setColor(colorTooltip(props.abilityColors['colors'], ability['name']))
    }, [ability, open])
    return (
        <div className="tooltip" id="ability-tooltip" style={{ background: color }}>
            <div className="tooltip-line-one">
                <div className="tooltip-title">
                    <img className="tooltip-img" alt={props.img} src={props.img}></img>
                    <h3>{ability.name_loc}</h3>
                </div>
            </div>
            <div className="tooltip-content">
                <div className="tooltip-description">
                    <p>{ability['desc_loc']}</p>
                </div>
                <TooltipAttributes itemProperties={ability}></TooltipAttributes>
                <TooltipLore itemProperties={ability}></TooltipLore>
            </div>
            <div className="tooltip-footer">
                <CdMc mana_costs={ability.mana_costs} cooldowns={ability.cooldowns}></CdMc>
            </div>
        </div >
    )
}
export default AbilityTooltip
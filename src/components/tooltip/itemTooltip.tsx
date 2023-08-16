import { useEffect, useState } from "react";
import AghanimTooltip from "./aghanimTooltip";
import TooltipAttributes from './tooltipAttributes';
import TooltipDescription from './tooltipDescription';
import TooltipLore from "./tooltipLore";
interface Itemproperties {
    id: number,
    attrib: [],
    displayName: string,
    language?: { description?: string[], lore?: string[] },
    name: string,
    attributes: [{ name: string, value: string }],
    stat: { cost: string, manaCost: string[], cooldown: string[] }
    cost: number,
    dname: string
}
interface ItemTooltipProps {
    itemId?: number,
    items: any,
    itemKey: string,
    type: string,
    heroData?: object[],
    img: string,
    heroName?: string,
}
const ItemTooltip = (props: ItemTooltipProps) => {
    const [open, setOpen] = useState(false)
    const [itemProperties, setItemProperties] = useState<Itemproperties>()
    useEffect(() => {
        if (props.items) {
            setItemProperties(props.items.items[props.itemKey])
        }
    }, [open])
    return (
        <>
            {itemProperties && !props.heroData && (
                <div className="tooltip">
                    <div className="tooltip-line-one item-tooltip-line-one">
                        <img className="tooltip-img" alt={props.img} src={props.img} width='75px' style={{ marginRight: '10px' }}></img>
                        <div className="item-tooltip-title">
                            <h3>{itemProperties.dname}</h3>
                            {+itemProperties.cost > 0 &&
                                <div className="cost-wrapper">
                                    <img alt='gold' className="gold-img" src="https://steamcdn-a.akamaihd.net/apps/dota2/images/tooltips/gold.png" style={{ marginRight: '5px' }}></img>
                                    <h4>{itemProperties.cost}</h4>
                                </div>
                            }
                        </div>

                    </div>
                    <div className="tooltip-content">
                        <TooltipAttributes itemProperties={itemProperties}></TooltipAttributes>
                        <TooltipDescription itemProperties={itemProperties}></TooltipDescription>
                        <TooltipLore itemProperties={itemProperties}></TooltipLore>
                    </div>
                </div>
            )}
            {
                props.heroData && props.heroName && (
                    <AghanimTooltip heroName={props.heroName} heroData={props.heroData} type={props.type}></AghanimTooltip>
                )
            }
        </>
    )
}
export default ItemTooltip 
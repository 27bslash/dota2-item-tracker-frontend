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
}
interface ItemTooltipProps {
    itemId?: number,
    items: { 'items': any[] },
    itemKey: string,
    type: string,
    heroData?: object[],
    img: string,
    colors: object[],
    heroName?: string,
}
const ItemTooltip = (props: ItemTooltipProps) => {
    const [open, setOpen] = useState(false)
    const [itemProperties, setItemProperties] = useState<Itemproperties>()
    useEffect(() => {
        if (props.items) {
            for (let item of props.items['items']) {
                if (item.id === props.itemId || item.name.replace('item_', '') === props.itemKey) {
                    setItemProperties(item)
                    break
                }
            }
        }
    }, [open])
    return (
        <>
            {itemProperties && !props.heroData && (
                <div className="tooltip">
                    <div className="tooltip-line-one item-tooltip-line-one">
                        <div className="tooltip-title">
                            <img className="tooltip-img" alt={props.img} src={props.img}></img>
                            <h3>{itemProperties.displayName}</h3>
                        </div>
                        {+itemProperties.stat.cost > 0 &&
                            <div className="cost-wrapper">
                                <img alt='gold' className="gold-img" src="https://steamcdn-a.akamaihd.net/apps/dota2/images/tooltips/gold.png"></img>
                                <h4>{itemProperties.stat.cost}</h4>
                            </div>
                        }
                    </div>
                    <div className="tooltip-content">
                        <TooltipAttributes itemProperties={itemProperties}></TooltipAttributes>
                        <TooltipDescription itemProperties={itemProperties}></TooltipDescription>
                        <TooltipLore itemProperties={itemProperties}></TooltipLore>
                    </div>
                </div>
            )}
            {
                props.heroData?.length && props.heroName && (
                    <AghanimTooltip heroName={props.heroName} heroData={props.heroData} colors={props.colors} type={props.type}></AghanimTooltip>
                )
            }
        </>
    )
}
export default ItemTooltip 
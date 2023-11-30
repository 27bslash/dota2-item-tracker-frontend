/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AghanimTooltip from "./aghanimTooltip";
import TooltipAttributes from './tooltipAttributes';
import TooltipDescription from './tooltipDescription';
import TooltipLore from "./tooltipLore";
import { PageHeroData } from "../types/heroData";
import { Items, Item } from "../types/Item";
import { useTableContext } from "../table/tableContext";
import { usePageContext } from "../stat_page/pageContext";


interface ItemTooltipProps {
    itemId?: number,
    itemKey: string,
    type: string,
    img: string,
    heroName?: string,
}
const ItemTooltip = (props: ItemTooltipProps) => {
    const [itemProperties, setItemProperties] = useState<Item>()
    const { itemData } = usePageContext()
    useEffect(() => {
        if (itemData) {
            setItemProperties(itemData.items[props.itemKey])
        }
    }, [])
    return (
        <>
            {itemProperties &&
                <>
                    {props.type !== 'scepter' && props.type !== 'shard' ? (
                        <div className="tooltip">
                            <div className="tooltip-line-one item-tooltip-line-one">
                                <img className="tooltip-img" alt={props.img} src={props.img} width='75px' style={{ marginRight: '10px' }}></img>
                                <div className="item-tooltip-title">
                                    <h3>{itemProperties.dname}</h3>
                                    {itemProperties.cost && itemProperties.cost > 0 &&
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
                    ) : (
                        <AghanimTooltip heroName={props.heroName} type={props.type}></AghanimTooltip>
                    )
                    }
                </>
            }
        </>
    )
}
export default ItemTooltip
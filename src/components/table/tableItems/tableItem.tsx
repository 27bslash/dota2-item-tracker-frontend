/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router";
import ItemTooltip from "../../tooltip/itemTooltip"
import itemSearch from '../table_search/item_search';
import React from 'react'
import Tip from "../../tooltip/tooltip";
import { PageHeroData } from "../../types/heroData";
import Items from "../../types/Item";
import { useTableContext } from "../tableContext";
import DotaMatch from "../../types/matchData";
import { MatchDataAdj } from "../../stat_page/page";
import { RoleStrings } from "../../home/home";
import { exists } from "../../../utils/exists";
type TItemProp = {
    type: string,
    height?: string,
    width?: string,
    starter?: boolean,
    itemKey: string,
    itemId?: number | undefined,
    children?: React.ReactNode;
    time?: string,
    overlay: boolean
    totalMatchData?: DotaMatch[]
    items?: Items
    updateMatchData?: MatchDataAdj['updateMatchData']
    row?: DotaMatch,
    role?: RoleStrings
}
const TableItem = (props: TItemProp) => {
    const image_host = "https://ailhumfakp.cloudimg.io/v7/"

    const link = `${image_host}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${props.itemKey}.png`
    // console.log(props.item)
    const { updateMatchData, totalMatchData, items } = useTableContext()
    const updateTable = () => {
        if (!totalMatchData) return
        const data = itemSearch(props.itemKey, totalMatchData, items, props.role)
        if (exists(data) && updateMatchData) {
            const itemKey = Object.keys(data)[0];
            updateMatchData(data[itemKey]['matches'], { 'items': data })
        }
    }
    const handleClick = (event: any) => {
        if (!event.ctrlKey && items) {
            updateTable()
        } else if (props.row && (event.ctrlKey || event.button === 1) && props.row.match_id) {
            event.preventDefault()
            // return <Link to={{ 'pathname': "https://example.zendesk.com/hc/en-us/articles/123456789-Privacy-Policies" }} target="_blank" />
            const url = `https://www.opendota.com/matches/${props.row.match_id}`
            const w = window.open(url, '_blank')
            if (w) {
                w.focus()
            }
        }
    }
    return (
        <Tip component={<ItemTooltip type={props.type} img={link} itemId={props.itemId} itemKey={props.itemKey} />}>
            {(props.type === 'item' || props.type === 'shard' || props.type === 'scepter') &&
                <div className="item-cell" onClick={handleClick} >
                    <img className="item-img" height={props.height || '55px'} width={props.width || '100%'} alt={props.itemKey} src={link} loading="lazy"></img>
                    {!props.starter && props.overlay &&
                        < div className="overlay">{props.time}</div>
                    }
                    {props.starter && props.overlay &&
                        <div className="overlay" style={{ backgroundColor: 'inherit' }}></div>
                    }
                </div>
            }

            {
                props.type === 'neutral' &&
                <div className="neutral-cell" onClick={updateTable}>
                    <div className="circle">
                        <img id="neutral-item" className="item-img" height='55px' alt={props.itemKey} src={link} loading="lazy">
                        </img>
                    </div>
                </div>
            }
        </Tip >
    )
}
export default TableItem
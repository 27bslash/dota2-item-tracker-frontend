import { useNavigate } from "react-router";
import ItemTooltip from "../tooltip/itemTooltip"
import itemSearch from './table_search/item_search';
import Tip from "../tooltip/tooltip";
interface TItemProp {
    matchId: number,
    type: string,
    item?: any,
    items: any,
    starter?: boolean,
    itemKey: string,
    colors?: any,
    heroData?: object[],
    heroName?: string
    itemId?: number | undefined,
    children?: React.ReactNode;
    filteredData: object[],
    totalMatchData: object[],
    updateMatchData: (data: any, searchResults?: any) => void
    role: string,
    time?: string,
}
const TableItem = (props: TItemProp) => {
    const image_host = "https://ailhumfakp.cloudimg.io/v7/"

    let link = `${image_host}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${props.itemKey}.png`
    // console.log(props.item)
    const updateTable = () => {
        const data = itemSearch(props.itemKey, props.totalMatchData, props.items, props.role)
        if (data) {
            const itemKey = Object.keys(data)[0];

        props.updateMatchData(data)
            props.updateMatchData(data[itemKey]['matches'], { 'items': data })
        }
    }
    const navigate = useNavigate()
    const handleClick = (event: any) => {
        const url = `https://www.opendota.com/matches/${props.matchId}`
        if (!event.ctrlKey) {
            updateMatchData()
        } else {
        if (!event.ctrlKey && props.items) {
            updateTable()
        } else if (event.ctrlKey || event.button === 1) {
            event.preventDefault()
            // return <Link to={{ 'pathname': "https://example.zendesk.com/hc/en-us/articles/123456789-Privacy-Policies" }} target="_blank" />
            const url = `https://www.opendota.com/matches/${props.matchId}`
            const w = window.open(url, '_blank')
            if (w) {
                w.focus()
            }


        }
    }
    return (
        <Tip component={<ItemTooltip type={props.type} img={link} itemId={props.itemId} items={props.items} itemKey={props.itemKey} colors={props.colors} heroData={props.heroData} heroName={props.heroName} />}>
            {(props.type === 'item' || props.type === 'shard' || props.type === 'scepter') &&
                <div className="item-cell" onClick={handleClick} >
                    <img className="item-img" height='55px' alt={props.itemKey} src={link}></img>
                    {!props.starter &&
                        <div className="overlay">{props.time}</div>
                    }
                    {props.starter &&
                        <div className="overlay" style={{ backgroundColor: 'inherit' }}></div>
                    }
                </div>
            }

            {
                props.type === 'neutral' &&
                <div className="neutral-cell" onClick={updateTable}>
                    <div className="circle">
                        <img id="neutral-item" className="item-img" height='55px' alt={props.itemKey} src={link}>
                        </img>
                    </div>
                </div>
            }
        </Tip >
    )
}
export default TableItem
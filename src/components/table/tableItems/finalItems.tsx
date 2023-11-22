import { PageHeroData } from "../../types/heroData";
import DotaMatch from "../../types/matchData";
import { useTableContext } from "../tableContext";
import TableItem from "./tableItem";
import { TitemProps, humanReadableTime } from "./tableItems";

// row: TitemProps['row'], bear?: boolean; role: string; heroName: string; itemList: DotaMatch['items'];
// updateMatchData: ((data: DotaMatch[], searchResults?: any) => void);
// filteredData: DotaMatch[]; totalMatchData: DotaMatch[]; items: any; heroData: PageHeroData
export const FinalItems = (props: any) => {
    const { row, role, updateMatchData, items, totalMatchData } = useTableContext()
    return (
        <div className="flex">
            {props.bear &&
                <img src='https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/lone_druid_spirit_bear.png'
                    height='55'
                    alt='lone druid bear'
                ></img>
            }
            {props.itemList.map((item: any, i: number) => {
                const time = humanReadableTime(item['time'])
                if (item.key === 'ultimate_scepter') {
                    return <TableItem overlay={true} items={items} totalMatchData={totalMatchData} updateMatchData={updateMatchData} role={role}
                        key={i} itemKey='ultimate_scepter' type='scepter'
                        time={time}>
                    </TableItem>
                } else {
                    return <TableItem time={time} overlay={true} items={items} totalMatchData={totalMatchData} updateMatchData={updateMatchData} role={role}
                        key={i}
                        itemId={item.id} itemKey={item.key} type='item'></TableItem>
                }
            }
            )}
        </div>
    )
}
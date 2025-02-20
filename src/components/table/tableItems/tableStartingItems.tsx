import DotaMatch from "../../types/matchData";
import TableItem from "./tableItem";
import { humanReadableTime } from "./tableItems";

type TableStartingItemsProps = {
    consumables: string[],
    row: DotaMatch
}
export function TableStartingItems({ row, consumables }: TableStartingItemsProps) {
    return (<div className="flex intermediate-items">
        {row.items.map((item, i) => {
            if (+item['time'] < 600 && +item['time'] > 0 && !consumables.includes(item['key'])) {
                const time = humanReadableTime(item['time']);
                return <TableItem overlay={true} key={i} time={time} itemKey={item.key} type='item'>
                </TableItem>;
            }
        })}
    </div>);
}
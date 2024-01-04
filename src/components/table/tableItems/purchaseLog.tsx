import { exists } from "../../../utils/exists";
import { RoleStrings } from "../../home/home";
import Items from "../../types/Item";
import { PageHeroData } from "../../types/heroData";
import DotaMatch from "../../types/matchData";
import { useTableContext } from "../tableContext";
import { FinalItems } from "./finalItems";
import TableItem from "./tableItem";
import { humanReadableTime } from "./tableItems";

type PurchaseLogProps = {
    tableItemProps: {
        matchId: number;
        overlay: boolean;
        role: RoleStrings;
        updateMatchData: (data: DotaMatch[]) => void;
        heroName?: string
    }
}
export function PurchaseLog({ tableItemProps }: PurchaseLogProps) {
    const { showStarter, row } = useTableContext()
    return (<div className="purchases">
        {!showStarter ? <>
            <FinalItems bear={!!exists(row.additional_units)} itemList={row.additional_units || []}></FinalItems>
            <FinalItems itemList={row.final_items} heroName={tableItemProps.heroName}></FinalItems>
        </> : row.starting_items && <div className="flex">
            {row.starting_items.map((item, i: number) => {
                const time = humanReadableTime(item['time']);
                return <TableItem {...tableItemProps} time={time} key={i} itemKey={item.key} type='item' starter={true}>
                </TableItem>;
            })}
        </div>}
    </div>);
}

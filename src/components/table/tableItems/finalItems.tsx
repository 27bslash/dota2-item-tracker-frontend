import { humanReadableTime } from "../../../utils/humanReadableTime";
import { SimpleItems } from "../../types/matchData";
import { useTableContext } from "../tableContext";
import TableItem from "./tableItem";

export const FinalItems = ({
  bear,
  itemList,
  heroName,
}: {
  bear?: boolean;
  itemList: SimpleItems[];
  heroName?: string;
}) => {
  const { role, updateMatchData } = useTableContext();
  return (
    <div className="flex">
      {bear && (
        <img
          src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/lone_druid_spirit_bear.png"
          height="55"
          alt="lone druid bear"
        ></img>
      )}
      {itemList.map((item, i: number) => {
        const time = humanReadableTime(item["time"]);
        if (item.key === "ultimate_scepter") {
          return (
            <TableItem
              overlay={true}
              updateMatchData={updateMatchData}
              role={role}
              key={i}
              itemKey="ultimate_scepter"
              type="scepter"
              heroName={heroName}
              time={time}
            ></TableItem>
          );
        } else {
          return (
            <TableItem
              time={time}
              overlay={true}
              updateMatchData={updateMatchData}
              role={role}
              key={i}
              itemId={item.id}
              itemKey={item.key}
              type="item"
            ></TableItem>
          );
        }
      })}
    </div>
  );
};

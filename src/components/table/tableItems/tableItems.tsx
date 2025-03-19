/* eslint-disable no-unused-vars */
import { TableCell } from "@mui/material";
import TableItem from "./tableItem";
import ArrowButton from "../../ui_elements/arrowButton";
import Draft from "../draft";
import { HeroAbility } from "../../types/matchData";
import { Abilities } from "../tableAbilities/tableAbilities";
import { PurchaseLog } from "./purchaseLog";
import { TableStartingItems } from "./tableStartingItems";
import { useTableContext } from "../tableContext";

export const humanReadableTime = (time: number | string) => {
  if (typeof time === "number" && time < 0) {
    time = 0;
  }
  let minutes, secs;
  if (typeof time === "string") {
    const spit = time.split(":");
    const hours = +spit[0].replace(/^0/, "");
    minutes = +spit[1].replace(/^0/, "") + hours * 60;
    secs = spit[2].replace(/^0/, "");
    secs = +secs >= 10 ? secs : `0${secs}`;
  } else {
    minutes = Math.floor(time / 60);
    secs = time % 60 >= 10 ? time % 60 : `0${time % 60}`;
  }
  const timeString = `${minutes}:${secs}`;
  return minutes > 0 ? timeString : "0";
};

const TableItems = ({ heroName }: { heroName?: string }) => {
  const { row, role, showStarter, updateMatchData } = useTableContext();
  const image_host = "https://ailhumfakp.cloudimg.io/v7/";
  const consumables = [
    "tango",
    "flask",
    "ward_observer",
    "ward_sentry",
    "smoke_of_deceit",
    "enchanted_mango",
    "clarity",
    "tpscroll",
    "dust",
    "tome_of_knowledge",
  ];
  const visitedTalents: HeroAbility[][] = [];
  const talents = row.abilities.filter(
    (ability) => ability["type"] === "talent"
  );
  const s = new Set();
  for (const talent of talents) {
    const t: HeroAbility[] = [];
    if (!s.has(talent["id"])) {
      s.add(talent["id"]);
      const newA = Array.from(s);
      for (const _id of newA) {
        const f = talents.filter((x) => _id === x["id"]);
        t.push(f[0]);
      }
    }
    visitedTalents.push(t);
  }
  const width = "900";
  const tableItemProps = {
    matchId: row.id,
    overlay: true,
    heroName: row.hero,
    role: role,
    updateMatchData: updateMatchData,
  };
  return (
    <TableCell
      sx={{
        padding: "6px 0px 6px 10px",
        maxWidth: `${width}px`,
        minWidth: `${width}px`,
        width: width + "px",
        height: "200px",
        maxHeight: "200px",
      }}
    >
      <div className="items flex">
        <PurchaseLog tableItemProps={tableItemProps} />
        {row.item_neutral && !showStarter && (
          <TableItem
            {...tableItemProps}
            itemKey={row.item_neutral}
            type="neutral"
          ></TableItem>
        )}
        {
          row.aghanims_shard && !showStarter && (
            <TableItem
              {...tableItemProps}
              time={humanReadableTime(row.aghanims_shard[0]["time"])}
              itemKey="aghanims_shard"
              type="shard"
            ></TableItem>
          )
          // time={humanReadableTime(row.aghanims_shard['time'])}
        }
      </div>
      {showStarter && row.starting_items && (
        <TableStartingItems row={row} consumables={consumables} />
      )}
      {row.items && (
        <ArrowButton transition="collapse">
          <div className="purchase-log">
            {row.items.map((item, i: number) => {
              const time = humanReadableTime(item["time"]);
              if (!consumables.includes(item["key"])) {
                return (
                  <TableItem
                    {...tableItemProps}
                    key={i}
                    time={time}
                    itemKey={item.key}
                    type="item"
                  ></TableItem>
                );
              }
            })}
          </div>
        </ArrowButton>
      )}
      <>
        <Abilities
          visitedTalents={visitedTalents}
          imageHost={image_host}
          width={width}
        />
      </>
      {row.radiant_draft && (
        <div className="draft">
          <div className="radiant-draft">
            <Draft
              heroName={heroName}
              updateMatchData={updateMatchData}
              draft={row.radiant_draft}
            ></Draft>
          </div>
          <div className="dire-draft">
            <Draft
              heroName={heroName}
              updateMatchData={updateMatchData}
              draft={row.dire_draft}
            ></Draft>
          </div>
        </div>
      )}
    </TableCell>
  );
};
// const ConditionalLink = (props: { condition: any; to: string; children: any }) => {
//     return (
//         (condition && to)
//             ? <a href={to} target='_blank' rel='noreferrer'>{children}</a>
//             : <>{children}
//             </>
//     )
// }

export default TableItems;

import ItemTooltip from "../../tooltip/itemTooltip";
import React from "react";
import Tip from "../../tooltip/tooltip";
import DotaMatch from "../../types/matchData";
import { MatchDataAdj } from "../../stat_page/page";
import { RoleStrings } from "../../home/home";
import { usePageContext } from "../../stat_page/pageContext";
type TItemProp = {
  type: "item" | "neutral" | "shard" | "scepter";
  height?: string;
  width?: string;
  heroName?: string;
  starter?: boolean;
  itemKey: string;
  itemId?: number | undefined;
  children?: React.ReactNode;
  time?: string;
  overlay: boolean;
  updateMatchData?: MatchDataAdj["updateMatchData"];
  row?: DotaMatch;
  role?: RoleStrings;
  enchant?: string;
};
const TableItem = (props: TItemProp) => {
  const image_host = "https://ailhumfakp.cloudimg.io/v7/";

  const link = `${image_host}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${props.itemKey}.png`;
  // console.log(props.item)
  const { updateSearchResults, itemData } = usePageContext();
  const updateTable = () => {
    // updateMatchData(data[itemKey]['matches'], { 'items': data })
    if (
      props.type === "shard" ||
      props.type === "item" ||
      props.type === "scepter"
    ) {
      updateSearchResults(props.itemKey, "items", "items");
    } else {
      updateSearchResults(props.itemKey, "items", "item_neutral");
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!event.ctrlKey && itemData) {
      updateTable();
    } else if (
      props.row &&
      (event.ctrlKey || event.button === 1) &&
      props.row.match_id
    ) {
      event.preventDefault();
      // return <Link to={{ 'pathname': "https://example.zendesk.com/hc/en-us/articles/123456789-Privacy-Policies" }} target="_blank" />
      const url = `https://www.opendota.com/matches/${props.row.match_id}`;
      const w = window.open(url, "_blank");
      if (w) {
        w.focus();
      }
    }
  };
  return (
    <Tip
      component={
        <ItemTooltip
          type={props.type}
          heroName={props.heroName}
          img={link}
          itemId={props.itemId}
          itemKey={props.itemKey}
          enchant={props.enchant}
        />
      }
    >
      <ItemDisplay
        {...props}
        link={link}
        handleClick={handleClick}
        updateTable={updateTable}
      />
    </Tip>
  );
};
const ItemDisplay = (
  props: TItemProp & {
    link: string;
    handleClick: (event: React.MouseEvent) => void;
    updateTable: () => void;
  }
) => {
  return (
    <>
      {(props.type === "item" ||
        props.type === "shard" ||
        props.type === "scepter") && (
        <div
          className="item-cell table-cell-outline"
          onClick={props.handleClick}
        >
          <img
            className="item-img"
            height={props.height || "55px"}
            width={props.width || "100%"}
            alt={props.itemKey}
            src={props.link}
            loading="lazy"
          ></img>
          {props.type === "shard" && props.overlay && (
            <div
              className="overlay"
              style={{
                bottom: props.type !== "shard" ? "10px" : "0px",
              }}
            >
              {props.time || 0}
            </div>
          )}
          {!props.starter && props.overlay && props.type !== "shard" && (
            <div className="overlay">{props.time}</div>
          )}
          {props.starter && props.overlay && (
            <div
              className="overlay"
              style={{ backgroundColor: "inherit" }}
            ></div>
          )}
        </div>
      )}

      {props.type === "neutral" && (
        <div
          className="neutral-cell table-cell-outline"
          onClick={props.updateTable}
        >
          <div className="circle" style={{ height: "55px", width: "55px" }}>
            <img
              id="neutral-item"
              className="item-img"
              height="55px"
              alt={props.itemKey}
              src={props.link}
              loading="lazy"
            ></img>
          </div>
        </div>
      )}
    </>
  );
};
export default TableItem;

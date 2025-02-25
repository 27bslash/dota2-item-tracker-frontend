import { useEffect, useState } from "react";
import AghanimTooltip from "./aghanimTooltip";
import TooltipAttributes from "./tooltipAttributes";
import TooltipDescription from "./tooltipDescription";
import TooltipLore from "./tooltipLore";
import { usePageContext } from "../stat_page/pageContext";
import { Typography } from "@mui/material";
import { Item } from "../types/Item";
import { grey } from "@mui/material/colors";

interface ItemTooltipProps {
  itemId?: number;
  itemKey: string;
  type: string;
  img: string;
  heroName?: string;
}
const ItemTooltip = (props: ItemTooltipProps) => {
  const [itemProperties, setItemProperties] = useState<Item>();
  const { itemData } = usePageContext();
  useEffect(() => {
    if (itemData) {
      setItemProperties(itemData.items[props.itemKey]);
    }
  }, []);
  const tierBackgroundColours = [
    "hsl(200,3%,41%)",
    "#517A50",
    "#485688",
    "#714B88",
    "#F5DFA6",
  ];
  //   tier 4 C783E8;
  const tierTextColours = [
    "hsl(0,0%,75%)",
    "hsl(108, 65%, 70%)",
    "hsl(230, 95%, 75%)",
    "hsl(281, 100%, 74%)",
    "hsl(43,100%,79%)",
  ];
  return (
    <>
      {itemProperties && (
        <>
          {props.type !== "scepter" && props.type !== "shard" ? (
            <div className="tooltip">
              <div
                className="tooltip-line-one item-tooltip-line-one"
                style={{
                  background: `linear-gradient(to right, ${
                    tierBackgroundColours[itemProperties["tier"]! - 1]
                  }, #11171c)`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundImage:
                      'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/ripple_texture.png")',
                    backgroundSize: "cover",
                    height: "100%",
                    width: "97%",
                    position: "absolute",
                    opacity: 0.1,
                  }}
                ></div>
                <img
                  className="tooltip-img"
                  alt={props.img}
                  src={props.img}
                  width="75px"
                  style={{ marginRight: "10px" }}
                ></img>
                <div className="item-tooltip-title">
                  <h3>{itemProperties.dname}</h3>
                  {!!itemProperties.cost && itemProperties.cost > 0 && (
                    <div className="cost-wrapper">
                      <img
                        alt="gold"
                        className="gold-img"
                        src="https://steamcdn-a.akamaihd.net/apps/dota2/images/tooltips/gold.png"
                        style={{ marginRight: "5px" }}
                      ></img>
                      <h4>{itemProperties.cost}</h4>
                    </div>
                  )}
                  {!!itemProperties["tier"] && (
                    <Typography
                      fontWeight={600}
                      color={tierTextColours[itemProperties["tier"] - 1]}
                      sx={{ textShadow: "1px 1px black" }}
                    >
                      Tier {itemProperties["tier"]}
                      <span
                        style={{
                          color: grey[500],
                          fontWeight: "600",
                          marginLeft: "5px",
                        }}
                      >
                        Artifact
                      </span>
                    </Typography>
                  )}
                </div>
              </div>
              <div className="tooltip-content">
                <TooltipAttributes
                  itemProperties={itemProperties}
                ></TooltipAttributes>
                <TooltipDescription
                  itemProperties={itemProperties}
                ></TooltipDescription>
                <TooltipLore itemProperties={itemProperties}></TooltipLore>
              </div>
            </div>
          ) : (
            <AghanimTooltip
              heroName={props.heroName}
              type={props.type}
            ></AghanimTooltip>
          )}
        </>
      )}
    </>
  );
};
export default ItemTooltip;

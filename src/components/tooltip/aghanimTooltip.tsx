import TooltipAttributes from "./tooltipAttributes";
import CdMc from "./cdmc";
import Color from "color-thief-react";
import { usePageContext } from "../stat_page/pageContext";
import { HeroAbilities } from "../types/heroData";
import { extractHiddenValues } from "./abilityTooltip";

interface AghanimTooltipProps {
  heroName?: string;
  type: "shard" | "scepter";
}

const AghanimTooltip = (props: AghanimTooltipProps) => {
  let abilities: Record<string, HeroAbilities> = {};
  const { heroData, nameParam } = usePageContext();
  const heroName = props.heroName || nameParam;
  if (heroData[heroName]) {
    abilities = heroData[heroName]["abilities"];
  }
  const aghanimAbility = extractAghanim(abilities, props.type) as HeroAbilities;
  const aghText =
    aghanimAbility[`${props.type}_loc`] || aghanimAbility["desc_loc"];
  const aghanimDescription = extractHiddenValues(
    aghText,
    aghanimAbility["special_values"]
  );
  const img = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//abilities/${aghanimAbility.name}.png`;
  return (
    <Color src={img} crossOrigin="anonymous" format="hex">
      {({ data }) => {
        return (
          <div className="tooltip" id="aghanim-tooltip">
            <div
              className="tooltip-line-one"
              style={{
                flexDirection: "column",
                padding: "20px 20px 0px",
                position: "relative",
                background: `linear-gradient(to right, ${data} , #182127 160px`,
              }}
            >
              <div
                style={{
                  backgroundImage:
                    'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/ripple_texture.png")',
                  backgroundSize: "cover",
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  opacity: 0.2,
                }}
              ></div>
              <div className="tooltip-title">
                <img
                  className="tooltip-img"
                  alt={img}
                  src={img}
                  width="55px"
                ></img>
                <h3>{aghanimAbility.name_loc}</h3>
              </div>
              <div className="aghanim-wrapper">
                <p style={{ fontSize: "12px" }} className="aghanim-title">
                  {props.type} ability upgrade
                </p>
              </div>
            </div>
            <div className="tooltip-content">
              <div
                className="tooltip-description"
                style={{ marginBottom: "10px" }}
              >
                {aghanimDescription.split(/\s|,/).map((x, i: number) => {
                  if (x.match(/\d+/g)) {
                    return (
                      <span key={i} className="tooltip-text-highlight">
                        {x}{" "}
                      </span>
                    );
                  } else {
                    return <span key={i}>{x + " "}</span>;
                  }
                })}
              </div>
              <div className="tooltip-attributes">
                <TooltipAttributes
                  type={props.type}
                  abilityProperties={aghanimAbility}
                ></TooltipAttributes>
              </div>
            </div>
            <div className="tooltip-footer">
              <CdMc
                mana_costs={aghanimAbility.mana_costs}
                cooldowns={aghanimAbility.cooldowns}
              ></CdMc>
            </div>
          </div>
        );
      }}
    </Color>
  );
};

export default AghanimTooltip;

export const extractAghanim = (
  result: Record<string, HeroAbilities>,
  s: "shard" | "scepter"
) => {
  for (const _id in result) {
    if (result[_id][`ability_is_granted_by_${s}`]) {
      result[_id]["newAbility"] = true;
      return result[_id];
    } else if (result[_id][`ability_has_${s}`] && result[_id][`${s}_loc`]) {
      result[_id]["modifier"] = true;
      return result[_id];
    }
  }
};

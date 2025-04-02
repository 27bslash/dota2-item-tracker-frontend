/* eslint-disable no-unused-vars */
import TooltipAttributes from "./tooltipAttributes";
import CdMc from "./cdmc";
import Color from "color-thief-react";
import { usePageContext } from "../stat_page/pageContext";
import { HeroAbilities } from "../types/heroData";
import { extractHiddenValues } from "./abilityTooltip";

const AghanimTooltip = (props: any) => {
  let abilities: Record<string, HeroAbilities> = {};
  const { heroData, nameParam } = usePageContext();
  const heroName = props.heroName || nameParam;
  if (heroData[heroName]) {
    abilities = heroData[heroName]["abilities"];
  }
  const aghanimAbility = extractAghanim(abilities, props.type);
  const aghText =
    aghanimAbility[`${props.type}_loc`] || aghanimAbility["desc_loc"];
  const aghanimDescription = extractHiddenValues(
    aghText,
    aghanimAbility["special_values"]
  );
  const img = `https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//abilities/${aghanimAbility.name}.png`;
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
                  aghanimAbility={aghanimAbility}
                  type={props.type}
                  itemProperties={aghanimAbility}
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

// const highlightPattern = (text: string, pattern: RegExp) => {
//     const splitText = text.split(pattern);

//     if (splitText.length <= 1) {
//         return [];
//     }

//     const matches = text.match(pattern) || [];

//     return splitText.reduce((arr: any, element: string) => {
//         if (!element) return arr;
//         console.log(element, matches)
//         if (matches.includes(element)) {
//             return [...arr, <span className="tooltip-text-highlight">{element}</span>];
//         }

//         return [...arr, element];
//     },
//         []
//     );
// };

const extractAghanim = (result: { [x: string]: any }, s: string) => {
  for (const ability in result) {
    if (result[ability][`ability_is_granted_by_${s}`]) {
      result[ability]["newAbility"] = true;
      return result[ability];
    } else if (
      result[ability][`ability_has_${s}`] &&
      result[ability][`${s}_loc`]
    ) {
      result[ability]["modifier"] = true;
      return result[ability];
    }
  }
};

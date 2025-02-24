import { useState, useEffect } from "react";
import { highlight_numbers } from "./tooltipDescription";
import { FacetObj, HeroAbilities, HeroStats } from "../types/heroData";
import { Box, Typography } from "@mui/material";
import TooltipAttributes from "./tooltipAttributes";
import { extractHiddenValues } from "./abilityTooltip";

type facetToolipProps = {
  img: string;
  facet: FacetObj;
  heroStats: HeroStats;
};
export const facetBackground = (facet: FacetObj) => {
  const gradientMap = [
    [
      "linear-gradient(to right, #9F3C3C, #4A2040)",
      "linear-gradient(to right, #954533, #452732)",
      "linear-gradient(to right, #A3735E, #4F2A25)",
    ],
    [
      "linear-gradient(to right, #C8A45C, #6F3D21)",
      "linear-gradient(to right, #C6A158, #604928)",
      "linear-gradient(to right, #CAC194, #433828)",
      "linear-gradient(to right, #C3A99A, #4D352B)",
    ],
    [
      "linear-gradient(to right, #A2B23E, #2D5A18)",
      "linear-gradient(to right, #7EC2B2, #29493A)",
      "linear-gradient(to right, #538564, #1C3D3F)",
      "linear-gradient(to right, #9A9F6A, #223824)",
      "linear-gradient(to right, #9FAD8E, #3F4129)",
    ],
    [
      "linear-gradient(to right, #727CB2, #342D5B)",
      "linear-gradient(to right, #547EA6, #2A385E)",
      "linear-gradient(to right, #6BAEBC, #135459)",
      "linear-gradient(to right, #94B5BA, #385B59)",
    ],
    [
      "linear-gradient(to right, #B57789, #412755)",
      "linear-gradient(to right, #9C70A4, #282752)",
      "linear-gradient(to right, #675CAE, #261C44)",
    ],
    [
      "linear-gradient(to right, #565C61, #1B1B21)",
      "linear-gradient(to right, #6A6D73, #29272C)",
      "linear-gradient(to right, #95A9B1, #3E464F)",
      "linear-gradient(to right, #ADB6BE, #4E5557)",
    ],
  ];
  return {
    background: gradientMap[facet.color][facet.gradient_id],
    filter: facet.filter,
  };
};
type facetAbilityObj = {
  ability: HeroAbilities;
  innateAbility: boolean;
};
export const FacetTooltip = ({ img, facet, heroStats }: facetToolipProps) => {
  const [facetAbilityObj, setFacetAbilityObj] = useState<facetAbilityObj>();

  useEffect(() => {
    // clean facets
    let abilitySet = false;
    for (const [i, f] of heroStats.facets.entries()) {
      if (
        f.Deprecated ||
        facet.Deprecated ||
        f.title_loc.toLowerCase() !== facet.title_loc.toLowerCase()
      ) {
        continue;
      }
      for (const key in heroStats.abilities) {
        const fs = heroStats.abilities[key].facets_loc[i];
        if (fs) {
          f.ability_loc = fs;
          const s = extractHiddenValues(
            f.ability_loc,
            heroStats.abilities[key].special_values,
            true
          );
          f.ability_loc = s;
          setFacetAbilityObj({
            innateAbility: false,
            ability: heroStats.abilities[key],
          });
          abilitySet = true;
        }
      }
    }
    if (!abilitySet) {
      const idx = heroStats.facets.findIndex(
        (x) => x.title_loc === facet.title_loc
      );
      //   heroStats.facet_abilities[idx].abilities[0]
      const innatefacetAbility = heroStats.facet_abilities[idx].abilities[0];
      setFacetAbilityObj({
        innateAbility: true,
        ability: innatefacetAbility,
      });
    }
  }, [facet, heroStats]);
  if (!facet || facet.Deprecated) return null;
  const { background, filter } = facetBackground(facet);

  return (
    <>
      {facet && !facet.Deprecated && (
        <div
          style={{ width: "400px", letterSpacing: "1px" }}
          className="tooltip"
          id="facet-tooltip"
        >
          <div
            className="bg"
            style={{
              background: background,
            }}
          >
            <div
              style={{
                backgroundImage:
                  'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/ripple_texture.png")',
                backgroundSize: "cover",
                height: "70px",
                width: "100%",
                position: "absolute",
                filter: filter,
                opacity: 0.2,
              }}
            ></div>
            <div
              className="tooltip-line-one"
              style={{
                padding: "0px 10px 0px 0px",
                height: "70px",
              }}
            >
              <Box
                alignItems={"center"}
                justifyContent={"center"}
                justifyItems={"center"}
                sx={{
                  height: "100%",
                  width: "20%",
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
                  display: "flex",
                }}
              >
                <img
                  className="tooltip-img"
                  id="facet-icon"
                  alt={img}
                  src={img}
                  width="35px"
                ></img>
              </Box>
              <div className="tooltip-title">
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: "22px !important",
                    marginLeft: "auto",
                    textTransform: "uppercase",
                    zIndex: 1,
                  }}
                >
                  {facet.title_loc}
                </Typography>
              </div>
            </div>
          </div>
          <div
            className="tooltip-content"
            style={{ backgroundColor: "#181f24" }}
          >
            {!facetAbilityObj &&
              facet["description_loc"] &&
              facet.ability_loc != facet["description_loc"] &&
              facet["description_loc"].length && (
                <div className="tooltip-description">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: highlight_numbers(
                        facet["description_loc"].replace(
                          "{s:facet_ability_name}",
                          `<span class='tooltip-text-highlight'>${facet.title_loc}</span>`
                        )
                      ),
                    }}
                  ></p>
                </div>
              )}
            {facet.ability_loc && facetAbilityObj && (
              <>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  sx={{
                    background:
                      "linear-gradient(to right, #9bcdff17 0%, #9bcdff09 30%, #d0e8ff00 100%)",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    height="30px"
                    src={
                      !facetAbilityObj["innateAbility"]
                        ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${facetAbilityObj.ability.name}.png`
                        : `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${facet.icon}.png`
                    }
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/innate_icon.png";
                    }}
                  ></img>
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      color: "white",
                      paddingLeft: "12px",
                      fontWeight: "bold",
                      fontFamily: "reaver, serif",
                    }}
                  >
                    {!facetAbilityObj["innateAbility"]
                      ? facetAbilityObj["ability"]["name_loc"]
                      : "Passive effect"}
                  </Typography>
                </Box>
                <div
                  style={{
                    letterSpacing: "1px",
                    marginBottom: "15px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlight_numbers(facet["ability_loc"]),
                  }}
                ></div>
              </>
            )}
            {facet.ability_loc && !facetAbilityObj && (
              <div
                style={{
                  letterSpacing: "1px",
                  marginBottom: "15px",
                }}
                dangerouslySetInnerHTML={{
                  __html: highlight_numbers(facet["ability_loc"]),
                }}
              ></div>
            )}
            {facet.notes && !!facet.notes.length && (
              <div
                style={{
                  backgroundColor: "#253844",
                  padding: "10px",
                }}
                dangerouslySetInnerHTML={{
                  __html: highlight_numbers(facet["notes"]),
                }}
              ></div>
            )}
            {facetAbilityObj && facetAbilityObj["ability"] && (
              <TooltipAttributes
                itemProperties={facetAbilityObj["ability"]}
                type={!facetAbilityObj["innateAbility"] ? "facet" : "ability"}
              ></TooltipAttributes>
            )}
          </div>
        </div>
      )}
    </>
  );
};

import { useEffect, useState } from "react";
import { usePageContext } from "../../stat_page/pageContext";
import { FacetObj } from "../../types/heroData";
import { Box } from "@mui/material";
import { FacetTooltip } from "../../tooltip/facetTooltip";
import Tip from "../../tooltip/tooltip";

type FacetProps = {
  hero: string;
  variant?: number;
  imgWidth: number;
};
export const Facet = ({ hero, variant, imgWidth }: FacetProps) => {
  const { heroData, updateSearchResults } = usePageContext();
  const [facet, setFacet] = useState<FacetObj>();

  useEffect(() => {
    if (!variant || !heroData || !hero) return;
    const data = heroData[hero];
    if (!data) return;
    const facets = data["facets"];
    let decrement = 1;
    while (decrement <= facets.length) {
      if (!facets[variant - decrement]) {
        decrement += 1;
        continue;
      }
      setFacet(facets[variant - decrement]);
      //   console.log(
      //     "facet choice",
      //     facets[variant - decrement],
      //     variant,
      //     decrement,
      //     heroData[nameParam].facets
      //   );
      break;
    }
  }, [heroData, variant, hero]);
  const icon =
    facet && !facet.Deprecated
      ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${facet.icon}.png`
      : "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/skull.png";
  return (
    <>
      {facet && (
        <Tip
          component={
            <FacetTooltip img={icon} facet={facet} heroStats={heroData[hero]} />
          }
        >
          <Box
            onClick={() =>
              updateSearchResults(
                variant,
                "facet",
                "variant",
                facet.title_loc,
                hero
              )
            }
          >
            <img
              className="table-img"
              id="facet-icon"
              src={icon}
              height={`${imgWidth}px`}
            ></img>
          </Box>
        </Tip>
      )}
    </>
  );
};

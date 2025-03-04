import { useEffect, useState } from "react";
import { usePageContext } from "../../stat_page/pageContext";
import { FacetObj } from "../../types/heroData";
import { Box } from "@mui/material";
import { FacetTooltip } from "../../tooltip/facetTooltip";
import Tip from "../../tooltip/tooltip";

type FacetProps = {
  variant?: number;
  imgWidth: number;
};
export const Facet = ({ variant, imgWidth }: FacetProps) => {
  const { nameParam, heroData } = usePageContext();
  const [facet, setFacet] = useState<FacetObj>();
  const { updateSearchResults } = usePageContext();

  useEffect(() => {
    if (!variant || !heroData || !nameParam) return;
    const data = heroData[nameParam];
    if (!data) return;
    const facets = data["facets"];
    let decrement = 1;
    while (decrement <= facets.length) {
      if (!facets[variant - decrement]) {
        decrement += 1;
        continue;
      }
      setFacet(facets[variant - decrement]);
      break;
    }
  }, [heroData, variant, nameParam]);
  const icon =
    facet && !facet.Deprecated
      ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${facet.icon}.png`
      : "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/skull.png";
  return (
    <>
      {facet && (
        <Tip
          component={
            <FacetTooltip
              img={icon}
              facet={facet}
              heroStats={heroData[nameParam]}
            />
          }
        >
          <Box
            onClick={() =>
              updateSearchResults(variant, "facet", "variant", facet.title_loc)
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

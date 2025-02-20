import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { cleanDecimal } from "../../../utils/cleanDecimal";
import colourWins from "../../../utils/colourWins";
import { usePageContext } from "../../stat_page/pageContext";
import { facetBackground, FacetTooltip } from "../../tooltip/facetTooltip";
import Tip from "../../tooltip/tooltip";
import { FacetObj } from "../../types/heroData";
type FacetContentProps = {
  facets: FacetObj[];
  facetStats: { key: number; count: number; perc: string; title: string };
};

export const FacetContent = ({ facets, facetStats }: FacetContentProps) => {
  const { updateSearchResults, heroData, nameParam } = usePageContext();
  let facet: FacetObj | null = null;
  for (const f of facets) {
    if (
      !f.Deprecated &&
      facetStats.title.toLowerCase() === f.title_loc.toLowerCase()
    ) {
      facet = f;
      break;
    }
  }
  if (!facet) return null;
  const icon = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${facet.icon}.png`;
  const { background } = facetBackground(facet);
  return (
    <div
      onClick={() =>
        updateSearchResults(
          facetStats["key"],
          "facet",
          "variant",
          facet.title_loc
        )
      }
    >
      <Tip
        placement={"left-end"}
        component={
          <FacetTooltip
            img={icon}
            facet={facet}
            heroStats={heroData[nameParam]}
          />
        }
      >
        <div
          style={{
            background: background,
            display: "flex",
            alignItems: "center",
            height: "fit-content",
            padding: "5px",
            width: "300px",
          }}
        >
          <img
            height={30}
            src={icon}
            style={{
              filter: "drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.3))",
            }}
          ></img>
          <Box paddingLeft={2} paddingRight={2}>
            {facetPicks(facetStats)}
            <Typography
              letterSpacing={1.3}
              fontFamily="Reaver"
              textTransform="uppercase"
              fontWeight="bold"
            >
              {facet.title_loc}
            </Typography>
          </Box>
        </div>
      </Tip>
    </div>
  );
};
function facetPicks(x: { key: number; count: number; perc: string }) {
  return (
    <div className="flex">
      <Typography
        color={grey["400"]}
        marginRight={1}
        letterSpacing={1}
        fontSize={"0.9rem"}
      >
        Picks:
        <span
          style={{
            marginLeft: "5px",
            color: "orange",
          }}
        >
          {x["count"]}
        </span>
      </Typography>
      <Typography color={grey["400"]} letterSpacing={1} fontSize={"0.9rem"}>
        Pick Rate:
        <span
          style={{
            marginLeft: "5px",
            color: +x["perc"] > 50 ? colourWins(x["perc"]) : grey["200"],
          }}
        >
          {cleanDecimal(x["perc"])}%
        </span>
      </Typography>
    </div>
  );
}

import { PageHeroData } from "../../types/heroData";
import DotaMatch from "../../types/matchData";

export const facetFilter = (buildData: DotaMatch[], heroData: PageHeroData) => {
  const facetCount: { [key: string]: number } = {};
  let total = 0;
  if (!heroData || !Object.keys(heroData).length) {
    return [];
  }
  const k = Object.keys(heroData);
  const hero = heroData[k[0]];
  const heroFacets = hero?.["facets"] || [];
  const findFacet = (match: DotaMatch) => {
    if (match["variant"]) {
      if (!heroFacets[match["variant"] - 1]) return heroFacets.length;
      return match["variant"];
    }
    return 0;
  };

  for (const match of buildData) {
    total += 1;
    const facetIdx = findFacet(match);
    if (facetIdx in facetCount) {
      facetCount[facetIdx] += 1;
    } else {
      facetCount[facetIdx] = 1;
    }
  }
  // [{key: 1, count: 42, perc: 95}]
  const facets = [];
  for (const k in facetCount) {
    const o = {
      key: +k,
      count: facetCount[k],
      perc: ((facetCount[k] / total) * 100).toFixed(2),
      title: k,
    };
    facets.push(o);
  }
  return facets;
};

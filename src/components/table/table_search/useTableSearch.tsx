import Hero from "../../types/heroList";
import Items from "../../types/Item";
import DotaMatch from "../../types/matchData";
import search from "./search";
import { combineMatches } from "./table_search";

export const useTableSearch = (
  searchTerms: string[],
  totalMatchData: DotaMatch[],
  heroList: Hero[],
  playerList: string[] | undefined,
  items: Items,
  role: string | undefined,
  heroName: string
) => {
  const data = role
    ? totalMatchData.filter((match) => match.role === role)
    : totalMatchData;
  const minLengthResults = searchTerms.some((term) => term.length >= 2);
  if (!minLengthResults) {
    return { matches: [], searchResults: {} };
  }
  const searchResults = search(
    searchTerms,
    data,
    items!,
    heroList,
    playerList,
    heroName
  );
  const combinedMatches = combineMatches(searchResults);
  const matchIds: number[] = [];
  const targetArr = combinedMatches.find((arr) => arr && arr.length > 0) || [];
  for (const matchId of targetArr) {
    const tempArr = [];
    for (const comparisonArr of combinedMatches) {
      if (
        !comparisonArr ||
        comparisonArr.includes(matchId) ||
        !comparisonArr.length
      ) {
        tempArr.push(matchId);
      }
    }
    if (tempArr.length === combinedMatches.length) {
      matchIds.push(tempArr[0]);
    }
  }
  const matches = [...totalMatchData].filter(
    (x) =>
      (matchIds.includes(x.id) && x.role === role) ||
      (matchIds.includes(x.id) && !role)
  );
  return { matches, searchResults };
};

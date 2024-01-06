import DotaMatch from "../../../types/matchData";

export type TableSearchResult = { [key: string]: { index: number; matches: DotaMatch[]; totalFilteredMatches?: DotaMatch[] } };

export type TableSearchResults = {
    [key: string]: TableSearchResult;
};
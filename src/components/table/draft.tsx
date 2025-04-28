import { usePageContext } from "../stat_page/pageContext";
import DotaMatch from "../types/matchData";
import DraftImage from "./draftImg";
import DraftSearch from "./table_search/draft_search";
import {
  TableSearchResult,
  TableSearchResults,
} from "./table_search/types/tableSearchResult.types";
type DraftProps = {
  draft: string[];
  heroName: string;
  updateMatchData: (
    data: DotaMatch[],
    searchValue?: TableSearchResults,
    types?: string[]
  ) => void;
  team?: DotaMatch["radiant_team"];
};
const Draft = (props: DraftProps) => {
  const { totalMatchData, nameParam } = usePageContext();
  const dr = props.draft.includes(nameParam);
  const draftS = new DraftSearch();

  const updateData = (search: string, symbol: string) => {
    const dict: TableSearchResult = {};
    if (totalMatchData.length === 0) return;
    const matches = new Set<DotaMatch>();
    // const data = draftS.handleDraftSearch(totalMatchData, nameParamList, search, nameParam)
    for (const match of totalMatchData) {
      const draf = draftS.draftChecker(match, nameParam, search, symbol);
      if (draf) {
        const key = `${symbol || ""}${search}`;
        if (dict[key]) {
          dict[key]["matches"].push(match);
        } else {
          dict[key] = { matches: [match], index: 0 };
        }
        matches.add(match);
      }
    }
    props.updateMatchData(Array.from(matches), { draft: dict });
  };
  return (
    <>
      {props.draft.map((x: string, i: number) => {
        // src\assets\images
        let searchPrefix: "+" | "-" = "-";
        if (dr) {
          searchPrefix = "+";
        }
        return x === nameParam || x === props.heroName ? (
          <DraftImage key={i} highlight={true} heroName={x}></DraftImage>
        ) : (
          <DraftImage
            key={i}
            heroName={x}
            highlight={false}
            onClick={() => updateData(x, searchPrefix)}
          ></DraftImage>
        );
      })}
      {props.team && (
        <img
          style={{
            marginLeft: props.team.name !== "Team Liquid" ? "0px" : "10px",
            marginBottom: "3px",
          }}
          height="28px"
          src={props.team.logo_url}
          alt={props.team.name}
          className="team-logo"
        ></img>
      )}
    </>
  );
};
export default Draft;

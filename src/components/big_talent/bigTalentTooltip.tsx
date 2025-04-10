import { useMemo } from "react";
import { Fragment } from "react";
import { cleanDecimal } from "../../utils/cleanDecimal";
import { usePageContext } from "../stat_page/pageContext";
import { TableSearchResults } from "../table/table_search/types/tableSearchResult.types";
import DotaMatch from "../types/matchData";
type TalentT = {
  count: number;
  slot: number;
  total_picks: number;
  level: number;
  key: string;
};

type BigTalentTooltipProps = {
  talents: [string, TalentT][];
  open: boolean;
  children: React.ReactNode;
  filteredData: DotaMatch[];
  updateMatchData: (
    data: DotaMatch[],
    searchValue?: TableSearchResults,
    types?: string[]
  ) => void;
};
const BigTalentTooltip = (props: BigTalentTooltipProps) => {
  const pairTalents = () => {
    const keys = Object.keys(props.talents);
    let j = 0;
    const rows = [];
    if (!keys.length) return;
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 4; i++) {
        const firstKey = props.talents[j][1]["key"];
        const secondKey = props.talents[j + 1][1]["key"];
        rows[i] = [
          { [firstKey]: props.talents[j][1] },
          { [secondKey]: props.talents[j + 1][1] },
        ];
        j += 2;
      }
      return rows.reverse();
    }
  };
  const memo = useMemo(() => pairTalents(), [props.talents]);
  return (
    <div className="toltip">
      {props.children}
      {props.open && props.talents.length > 0 && memo && (
        <div
          className="tooltip"
          id="talents"
          style={{ marginRight: "105px", marginTop: "11px" }}
        >
          {memo.map((talentObj, i: number) => {
            const k = Object.keys(talentObj[0])[0];
            const level = talentObj[0][k]["level"];
            return (
              <Fragment key={i}>
                <TalentRow
                  side="talent-left"
                  talent={talentObj[0]}
                  matchData={props.filteredData}
                  updateMatchData={props.updateMatchData}
                ></TalentRow>
                <div className="talent-center">
                  <div className="talent-level">{level}</div>
                  <p>pick</p>
                </div>
                <TalentRow
                  side="talent-right"
                  talent={talentObj[1]}
                  matchData={props.filteredData}
                  updateMatchData={props.updateMatchData}
                ></TalentRow>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
type TalentRowProps = {
  side: string;
  talent: {
    [key: string]: TalentT;
  };
  matchData: DotaMatch[];
  updateMatchData: (
    data: DotaMatch[],
    searchValue?: TableSearchResults,
    types?: string[]
  ) => void;
};
const TalentRow = (props: TalentRowProps) => {
  const { totalMatchData } = usePageContext();
  const k = Object.keys(props.talent)[0];
  const perc =
    (props.talent[k]["count"] / props.talent[k].total_picks) * 100 || 0;
  const talentKey = props.talent[k]["key"];
  const filterByTalents = (talentName: string) => {
    const filtered = totalMatchData.filter((match) =>
      match["abilities"].map((ability) => ability["key"]).includes(talentName)
    );
    props.updateMatchData(filtered, {
      talents: { [talentKey]: { index: 0, matches: totalMatchData } },
    });
  };
  return (
    <div className={props.side} onClick={() => filterByTalents(talentKey)}>
      <p className="talent-text">{talentKey}</p>
      <div className="talent-bar" style={{ width: perc + "%" }}></div>
      <p>{cleanDecimal(perc)}%</p>
    </div>
  );
};
export default BigTalentTooltip;

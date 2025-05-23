import { useEffect } from "react";
import { useState } from "react";
import heroSwitcher from "../../utils/heroSwitcher";
import stringSearch from "../table/table_search/string_search";
import RoleCounter from "./roleCounter";
import DotaMatch from "../types/matchData";
import { TableSearchResults } from "../table/table_search/types/tableSearchResult.types";
import PickStats from "../types/pickStats";
import { RoleStrings } from "../home/home";
import { SearchResultsText } from "./tableSearchResults/tableSearchResults";
import { HeroPicks } from "./heroPicks";
import { PlayerPicks } from "./playerPicks";
import {
  PickCounterContextProvider,
  usePickCounterContext,
} from "./pickCounterContext";
import { usePageContext } from "../stat_page/pageContext";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";

export interface pickProps {
  matchData: DotaMatch[];
  filteredData: DotaMatch[];
  nameParam: string;
  role: RoleStrings;
  updateMatchData: (
    data: DotaMatch[],
    searchRes?: TableSearchResults,
    types?: string[]
  ) => void;
  updateRole: (role: RoleStrings) => void;
  type: string;
  totalPicks: PickStats;
  count: number;
  heroColor: string;
}
const PickCounter = (props: pickProps) => {
  const [searching, setSearching] = useState(false);
  const { searchRes, updateSearchResults } = usePageContext();
  useEffect(() => {
    if (searchRes) {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [props.filteredData]);

  const roleSearch = (data: DotaMatch[], role: RoleStrings) => {
    if (data.length) {
      const m = stringSearch(data, "role", role);
      props.updateRole(role);
      props.updateMatchData(m);
    }
  };
  const reset = () => {
    updateSearchResults();
    setSearching(false);
    props.updateRole("");
  };
  const contextValues = {
    matchData: props.matchData,
    updateMatchData: props.updateMatchData,
    type: props.type,
    heroColor: props.heroColor,
    role: props.role,
    roleSearch: roleSearch,
    reset,
    totalPicks: props.totalPicks,
    nameParam: props.nameParam,
  };
  return (
    <PickCounterContextProvider value={contextValues}>
      {!!props.matchData.length && (
        <div className="pick-counter" style={{ color: "white" }}>
          {searching ? (
            <SearchResultsText />
          ) : (
            props.type === "hero" &&
            props.heroColor && (
              <>
                <div className="flex">
                  <TotalPickCounter />
                  <RoleCounter />
                </div>
                <PlayerPicks matchKey="account_id" />
              </>
            )
          )}
          {props.type === "player" && !searching && (
            <>
              <TotalPickCounter />
              {/* <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter> */}
            </>
          )}
        </div>
      )}
    </PickCounterContextProvider>
  );
};
export const BoldName = (props: {
  reset: () => void;
  color: string;
  name: string;
}) => {
  const navigate = useNavigate();
  return (
    <p
      onClick={() => {
        navigate(`/hero/${props.name}`);

        return props.reset();
      }}
      className="bold-name"
      id="hero-name"
      style={{ color: props.color, textTransform: "capitalize" }}
    >
      <strong>{heroSwitcher(props.name).replace(/_/g, " ")}</strong>
    </p>
  );
};
const TotalPickCounter = () => {
  const {
    role,
    type,
    totalPicks,
    matchData,
    nameParam,
    heroColor,
    reset,
  } = usePickCounterContext();
  const base = role && type === "hero" ? totalPicks[role] : totalPicks;
  return (
    <>
      {type === "hero"
        ? heroColor && base && <HeroPicks base={base} />
        : matchData && (
            <>
              <Typography className="bold-name" onClick={() => reset()}>
                {nameParam} has played {matchData.length} times. He mostly
                plays:
              </Typography>
              <PlayerPicks matchKey="hero" />
            </>
          )}
    </>
  );
};


export default PickCounter;

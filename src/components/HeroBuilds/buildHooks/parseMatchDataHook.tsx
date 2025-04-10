import { useEffect, useState } from "react";
import PickStats from "../../types/pickStats";
import { RoleStrings } from "../../home/home";
import { TableSearchResults } from "../../table/table_search/types/tableSearchResult.types";
import DotaMatch from "../../types/matchData";

const calc_common_roles = (
  props: { picks: PickStats },
  pickData?: Record<string, { [key: string]: number }>,
  threshold?: number
) => {
  const picks = pickData || props.picks;
  threshold = threshold || 0.1;
  const combinedRoles = ["Support", "Roaming"];
  let totalPicks = 0;
  for (const o of Object.entries(picks)) {
    totalPicks += o[1]["picks"];
  }

  const roles: string[] = [];
  const sorted = Object.entries(picks)
    .filter((x) => typeof x[1] === "object")
    .sort((a, b) => b[1]["picks"] - a[1]["picks"]);
  let combinedRole = null;
  for (const [i, k] of sorted.entries()) {
    const role = k[0] as RoleStrings;
    if (role) {
      let totalRolePicks = picks[role].picks;
      if (!combinedRole && combinedRoles.includes(role)) {
        const otherRole = combinedRoles.find(
          (pos) => pos !== role && pos in picks
        );
        if (otherRole) {
          const otherRolePicks = otherRole
            ? picks[otherRole as RoleStrings].picks
            : 0;
          totalRolePicks = picks[role].picks + otherRolePicks;
          combinedRole = true;
        }
      }
      if (i === 0) {
        roles.push(role);
      } else {
        const perc = totalRolePicks / totalPicks;
        if (perc > threshold && totalRolePicks > 1) {
          roles.push(role);
        }
      }
    }
  }
  return roles;
};
type UseParseMatchDataArgs = {
  proData: boolean;
  totalMatchData: DotaMatch[];
  props: {picks: PickStats, role?: string};
  searchRes?: TableSearchResults;
  threshold?: number;
  proFilter?: boolean;
};

export const useParseMatchData = ({
  proData,
  totalMatchData,
  props,
  searchRes,
  threshold,
  proFilter,
}: UseParseMatchDataArgs) => {
  const [data, setData] = useState<DotaMatch[]>();
  const [filteredData, setFilteredData] = useState<{
    [k: string]: DotaMatch[];
  }>();
  const [displayedRoles, setDisplayedRoles] = useState<string[]>([]);
  useEffect(() => {
    if (props.picks) {
      console.log("runnn");
      setDisplayedRoles(calc_common_roles(props, undefined, threshold));
    }
  }, [props.picks]);
  const combinedRoles = ["Support", "Roaming"];
  useEffect(() => {
    if (proData && totalMatchData) {
      if (!proFilter) {
        setData(totalMatchData);
      } else {
        console.log("fileter rpo");
        setData(totalMatchData.filter((match: DotaMatch) => match["pro"]));
      }
      const roleCount: { [key: string]: { [key: string]: number } } = {};
      for (const match of totalMatchData) {
        if (roleCount[match["role"]]) {
          roleCount[match["role"]]["picks"] += 1;
          roleCount[match["role"]]["wins"] += 1;
        } else {
          roleCount[match["role"]] = {
            picks: 1,
            wins: match["win"],
          };
        }
      }
      setDisplayedRoles(calc_common_roles(props, roleCount));
    }
  }, [proData, totalMatchData, proFilter]);
  useEffect(() => {
    if (props.role && data) {
      const filtered = data.filter((match) => match.role === props.role);
      const o = { [props.role]: filtered };
      setFilteredData(o);
    } else if (data) {
      const tempObject: { [role: string]: DotaMatch[] } = {};
      let searchResItemKeys: string[] = [];
      if (searchRes) {
        searchResItemKeys = Object.keys(searchRes)
          .map((x) => Object.keys(searchRes[x]))
          .flat();
      }
      for (const role of displayedRoles) {
        const roleFiltered = data
          .filter(
            (match) =>
              match.role === role ||
              (combinedRoles.includes(role) &&
                combinedRoles.includes(match.role))
          )
          .filter((match) =>
            searchRes
              ? searchResItemKeys.some((k: string) => {
                  if (k.length > 1) {
                    return objectContainsString<DotaMatch>(match, k);
                  } else {
                    return match["variant"] ? match["variant"] === +k : false;
                  }
                })
              : true
          );
        tempObject[role] = roleFiltered;
      }
      setFilteredData(tempObject);
    }
  }, [props.role, data, searchRes]);
  return filteredData;
};
function objectContainsString<T>(obj: T, searchString: string) {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      // If the value is an object, recursively search within it
      if (objectContainsString(obj[key], searchString)) {
        return true;
      }
    } else if (
      typeof obj[key] === "string" &&
      obj[key].includes(searchString)
    ) {
      // If the value is a string and contains the search string
      return true;
    }
  }
  return false;
}

/* eslint-disable @typescript-eslint/no-var-requires */
import { Box, Typography } from "@mui/material";
import { cleanDecimal } from "../../utils/cleanDecimal";
import colourWins from "../../utils/colourWins";
import { usePickCounterContext } from "./pickCounterContext";
import { usePageContext } from "../stat_page/pageContext";
import DraftImage from "../table/draftImg";

type PlayerPickProps = {
  matchKey: "hero" | "name" | "account_id";
};
export const PlayerPicks = ({ matchKey }: PlayerPickProps) => {
  const heroCount: Record<
    string,
    Record<string, { picks: number; win: number; key: string }>
  > = {};
  const { matchData } = usePickCounterContext();
  const { updateSearchResults } = usePageContext();
  for (const match of matchData) {
    if (!match[matchKey]) continue;
    const dictKey = matchKey === "account_id" ? "name" : matchKey;
    const role = match["role"];
    heroCount[match[matchKey]] = heroCount[match[matchKey]] || {};
    const roleStats = heroCount[match[matchKey]][role] || {
      picks: 0,
      win: 0,
      key: match[dictKey],
    };
    roleStats.picks += 1;
    if (match["win"]) {
      roleStats.win += 1;
    }
    heroCount[match[matchKey]][role] = roleStats;
  }
  Object.entries(heroCount).forEach((element) => {
    const pickDataObj = element[1];
    const roleKeys: string[] = Object.keys(pickDataObj);
    let temp = 0;
    let highestRole = "";
    for (const roleKey of roleKeys) {
      const pickData = pickDataObj[roleKey];
      if (pickData["picks"] > temp) {
        temp = pickData["picks"];
        highestRole = roleKey;
      } else if (pickData["picks"] === temp) {
        if (pickDataObj[highestRole]["win"] < pickData["win"]) {
          highestRole = roleKey;
        }
      }
    }
    for (const roleKey of roleKeys) {
      if (roleKey !== highestRole) {
        delete pickDataObj[roleKey];
      }
    }
  });

  let sortedData = Object.entries(heroCount).sort(([, aValue], [, bValue]) => {
    // Compare first by picks
    const aRole = Object.keys(aValue)[0];
    const bRole = Object.keys(bValue)[0];
    if (aValue[aRole].picks !== bValue[bRole].picks) {
      return bValue[bRole].picks - aValue[aRole].picks;
    }

    // If picks are equal, compare by wins
    return bValue[bRole].win - aValue[aRole].win;
  });
  sortedData = sortedData.filter(([, x]) => {
    const xR = Object.keys(x)[0];
    return x[xR]["picks"] > 1;
  });
  sortedData = sortedData.slice(0, 8);
  const updateData = (
    targetVal: string,
    searchKey?: string,
    key?:
      | "items"
      | "item_neutral"
      | "starting_items"
      | "name"
      | "role"
      | "hero"
      | "abilities"
  ) => {
    // const searchRes = { role: { index: 0, 'matches': filteredMatches } }
    // updateMatchData(filteredMatches, searchRes)
    updateSearchResults(targetVal, searchKey, key);
  };
  return (
    <Box className="flex boxContainer" sx={{ marginLeft: "-8px" }}>
      {sortedData.map((x, i) => {
        const roleKey = Object.keys(x[1])[0];
        if (!x[1][roleKey].key) return null;
        const cleanName = x[1][roleKey].key.replace(/\(smurf.*/, "");
        return (
          <Box
            key={i}
            className="player-pick-cell"
            bgcolor="primary.main"
            padding={1}
            margin={1}
            sx={{
              minWidth: "100px",
              border: "solid 2px black",
              borderRadius: "5px",
            }}
          >
            <div
              className="flex"
              style={{
                justifyContent: "space-around",
                marginLeft: "-6px",
              }}
            >
              {matchKey === "hero" ? (
                <DraftImage
                  heroName={cleanName}
                  highlight={false}
                  onClick={() => updateData(cleanName, "hero", "hero")}
                ></DraftImage>
              ) : (
                <Typography
                  style={{
                    marginRight: "10px",
                    marginLeft: "5px",
                  }}
                  className="hover-text"
                  onClick={() =>
                    updateData(x[1][roleKey].key, "player", "name")
                  }
                >
                  {cleanName}
                </Typography>
              )}
              <div
                className="svg-icon"
                id={roleKey.replace(" ", "-")}
                onClick={() => updateData(roleKey, "role", "role")}
              ></div>
            </div>
            <div className="flex" style={{ justifyContent: "space-around" }}>
              <Typography>{x[1][roleKey]["picks"]}</Typography>
              <Typography
                color={colourWins(
                  (x[1][roleKey]["win"] / x[1][roleKey]["picks"]) * 100
                )}
              >
                {cleanDecimal(
                  (x[1][roleKey]["win"] / x[1][roleKey]["picks"]) * 100
                )}
                %
              </Typography>
            </div>
          </Box>
        );
      })}
    </Box>
  );
};

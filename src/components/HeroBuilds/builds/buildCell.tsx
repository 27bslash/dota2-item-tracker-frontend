import { Button, Typography } from "@mui/material";
import { SetStateAction, useState } from "react";
import { RoleIcon } from "./roleIcons";
import AbilityBuilds from "../abillityBuild/abilityBuild";
import ItemBuild from "../itemBuild/itemBuild";
import SixItemBuild from "../itemBuild/sixItemBuild/SixItemBuild";
import { NeutralItems } from "../itemBuild/neutralItems/neutralItems";
import StartingItems from "../itemBuild/startingItems/startingItems";
import { RoleStrings } from "../../home/home";
import { MatchDataAdj } from "../../stat_page/page";
import { FacetBuild } from "../facets/FacetBuild";
import DotaMatch from "../../types/matchData";
import { HeroBuild } from "../buildHooks/buildTypes";

export interface Talent {
  level: number;
  count: number;
  slot: number;
  id: string;
  perc: number;
}
export type AbilityBuildEntry = [
  string,
  number,
  AbilityBuildEntry[]?, // Recursive type
];
export type Talents = [string, Talent][];

type BuildCellProps = {
  dataLength: number;
  totalGames: number;
  totalProGames: number;
  // itemData: Items,
  role: RoleStrings;
  data?: DotaMatch[];
  buildData: HeroBuild;
  // heroData: PageHeroData,
  updateMatchData: MatchDataAdj["updateMatchData"];
  setFilterType: React.Dispatch<SetStateAction<string | undefined>>;
};
export const BuildCell = ({
  dataLength,
  totalGames,
  totalProGames,
  data,
  role,
  buildData,
  updateMatchData,
  setFilterType,
}: BuildCellProps) => {
  const roleProGames =
    data?.filter((m) => m.pro && m.role === role).length ?? 0;
  const roleNormalGames = (data?.length ?? 0) - roleProGames;
  const totalNormalGames = totalGames - totalProGames;
  const [open, setOpen] = useState(dataLength === 1);
  const [legacyBuild, setLegacyBuild] = useState<boolean>(false);
  // maybe a hook for once

  return (
    // <TableContextProvider value={contextValues} >
    <div className="buildData">
      <Typography
        variant="h4"
        fontWeight="bold"
        padding={1.3}
        sx={{ "&:hover": { cursor: "pointer", opacity: 0.7 } }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RoleIcon role={role} />
          <span>{role}</span>
          <span
            style={{ fontSize: "0.55em", opacity: 0.6, fontWeight: "normal" }}
          >
            {roleProGames > 0 && `${roleProGames}/${totalProGames} pro games`}
            {roleProGames > 0 && roleNormalGames > 0 && " · "}
            {roleNormalGames > 0 &&
              `${roleNormalGames}/${totalNormalGames} public games in ${role}`}
          </span>
        </span>
      </Typography>
      {open && (
        <div className="builds">
          <Button
            onClick={() =>
              setFilterType((prev) =>
                prev === "consumables" ? "" : "consumables",
              )
            }
            variant="contained"
          >
            consumables
          </Button>
          <div
            className="flex"
            style={{
              justifyContent: "space-between",
            }}
          >
            <StartingItems data={data} startingItemData={buildData} />
            <FacetBuild data={buildData["facet_builds"]}></FacetBuild>
          </div>
          <Button
            onClick={() => setLegacyBuild((prev) => !prev)}
            variant="contained"
          >
            {legacyBuild ? "LEGACY" : "FLOW CHART"}
          </Button>
          {legacyBuild ? (
            <ItemBuild data={buildData["item_builds"]} />
          ) : (
            <SixItemBuild data={buildData["item_builds"]} />
          )}
          <NeutralItems neutralItems={buildData["neutral_items"]} />
          <AbilityBuilds
            data={data}
            abilityBuilds={buildData}
            updateMatchData={updateMatchData}
          />
        </div>
      )}
    </div>
    // </TableContextProvider>
  );
};

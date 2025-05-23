import { Button, Typography } from "@mui/material";
import { SetStateAction, useState } from "react";
import AbilityBuilds from "../abillityBuild/abilityBuild";
import ItemBuild from "../itemBuild/itemBuild";
import { NeutralItems } from "../itemBuild/neutralItems/neutralItems";
import StartingItems from "../itemBuild/startingItems/startingItems";
import { RoleStrings } from "../../home/home";
import { MatchDataAdj } from "../../stat_page/page";
import { HeroBuild } from "../buildHooks/buildHook";
import { FacetBuild } from "../facets/FacetBuild";
import DotaMatch from "../../types/matchData";

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
  AbilityBuildEntry[]? // Recursive type
];
export type Talents = [string, Talent][];

type BuildCellProps = {
  dataLength: number;
  // itemData: Items,
  role: RoleStrings;
  data?: DotaMatch[];
  buildData: HeroBuild;
  // heroData: PageHeroData,
  updateMatchData: MatchDataAdj["updateMatchData"];
  setFilterType: React.Dispatch<SetStateAction<string | undefined>>;
  // heroName: string
  // heroList: Hero[]
  // totalMatchData?: DotaMatch[]
};
export const BuildCell = ({
  dataLength,
  data,
  role,
  buildData,
  updateMatchData,
  setFilterType,
}: BuildCellProps) => {
  const [open, setOpen] = useState(dataLength === 1);
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
        {role}
        {/* pos 4 svg */}
        {softSupportSvg()}
      </Typography>
      {open && (
        <div className="builds">
          <Button
            onClick={() =>
              setFilterType((prev) =>
                prev === "consumables" ? "" : "consumables"
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
          <ItemBuild data={buildData["item_builds"]} />
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
function softSupportSvg() {
  return (
    <svg height="30" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.442 18.141l2.167-1.25c.398-.23.898-.219 1.286.03l1.93 1.238a.373.373 0 01.005.63c-1.77 1.183-8 5.211-10.744 5.211-.926 0-7.725-2.034-7.725-2.034v-6.999h2.704c.881 0 1.741.265 2.46.755l1.635 1.117h3.671c.438 0 1.482 0 1.482 1.302 0 1.41-1.14 1.41-1.482 1.41h-5.395a.555.555 0 00-.565.543c0 .3.254.543.565.543h5.75s.82.004 1.473-.56c.414-.359.783-.944.783-1.936z"
        fill="#FFFFFF"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.399 15.02c0-.583-.494-1.058-1.1-1.058h-2.2c-.606 0-1.099.475-1.099 1.059v6.998c0 .583.493 1.057 1.099 1.057h2.2c.606 0 1.1-.474 1.1-1.057v-6.998z"
        fill="url(#wrist_66_dark)"
        fillOpacity="0.7"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.895 6.395a.32.32 0 00-.202-.246.336.336 0 00-.32.043c-.91.64-1.942.965-1.942.965.04-3.622-2.211-5.914-5.873-7.13a.51.51 0 00-.541.141.463.463 0 00-.065.537c.833 1.5 1.205 2.868 1.068 4.825 0 0-.924-.426-1.26-1.51a.314.314 0 00-.205-.21.344.344 0 00-.3.043c-3.528 2.588-2.893 10.11 4.131 10.11 5.095 0 5.928-4.594 5.51-7.568zm-5.31-.56a.14.14 0 00-.03-.152.149.149 0 00-.158-.03c-2.764 1.222-3.878 6.061-.325 6.061 3.384 0 2.143-3.47.852-4.149a.111.111 0 00-.116.01.108.108 0 00-.05.106c.065.512-.148.819-.686.779-.209-.812.152-1.83.513-2.624z"
        fill="url(#flame_66_dark)"
      ></path>
      <defs>
        <linearGradient
          id="wrist_66_dark"
          x1="2.19928"
          y1="13.9623"
          x2="2.19928"
          y2="23.0759"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DEDEDE"></stop>
          <stop offset="1" stopColor="#7B7373"></stop>
        </linearGradient>
        <linearGradient
          id="flame_66_dark"
          x1="20.1087"
          y1="-1.17264e-7"
          x2="10.053"
          y2="15.0821"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(29,76%,39%)"></stop>
          <stop offset="1" stopColor="hsl(335,57.99999999999999%,51%)"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

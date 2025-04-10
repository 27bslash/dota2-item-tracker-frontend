/* eslint-disable no-unused-vars */
import Build from "../HeroBuilds/builds/build";
import BestGames from "../best_games/bestGames";
import BigTalent from "../big_talent/bigTalent";
import HeroImg from "../heroImg";
import { RoleStrings } from "../home/home";
import MostUsed from "../most_used/mostUsed";

import DotaMatch from "../types/matchData";
import PickStats from "../types/pickStats";
import { usePageContext } from "../stat_page/pageContext";
import { UnparsedBuilds } from "../HeroBuilds/buildHooks/shortBuildHook";

export const HeroPageTopSection = (props: {
  role: string;
  updatePageNumber: (idx: number) => void;
  updateMatchData: (match: DotaMatch[]) => void;
  updateRole: (role: RoleStrings) => void;
  totalPicks?: PickStats;
  shortBuilds?: { [key: string]: UnparsedBuilds };
}) => {
  const {
    heroData,
    nameParam,
    totalMatchData,
    filteredData,
    itemData,
    searchRes,
    heroList,
  } = usePageContext();
  const { role, updateRole, updateMatchData, totalPicks, shortBuilds } = props;
  console.log("short",shortBuilds)
  return (
    <>
      <div className="flex" style={{ minHeight: "87px" }}>
        <div className="hero-img-wrapper" style={{ width: "250px" }}>
          <HeroImg />
          {!!totalMatchData.length && <MostUsed role={role}></MostUsed>}
        </div>
        <BestGames
          updatePageNumber={props.updatePageNumber}
          updateRole={updateRole}
        ></BestGames>
        {!!Object.keys(heroData).length && !!filteredData.length && (
          <BigTalent
            width="100px"
            margin="2% 0px 0px 230px"
            updateMatchData={updateMatchData}
          />
        )}
      </div>
      <div style={{ minHeight: "45px", marginTop: "20px" }}>
        {itemData && shortBuilds && totalPicks && (
          <Build
            shortBuilds={shortBuilds}
            heroList={heroList}
            role={role}
            picks={totalPicks}
            searchRes={searchRes}
            data={filteredData}
            heroData={heroData}
            heroName={nameParam}
            itemData={itemData}
            totalMatchData={totalMatchData}
            updateMatchData={updateMatchData}
          />
        )}
      </div>
    </>
  );
};

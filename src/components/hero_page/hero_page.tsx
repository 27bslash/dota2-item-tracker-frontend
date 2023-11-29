/* eslint-disable no-unused-vars */
import { baseApiUrl } from "../../App"
import Build from "../builds/build"
import BestGames from "../best_games/bestGames"
import BigTalent from "../big_talent/bigTalent"
import HeroImg from "../heroImg"
import { RoleStrings } from "../home/home"
import MostUsed from "../most_used/mostUsed"
import { TableSearchResults } from "../table/table_search/types/tableSearchResult.types"
import { Items } from "../types/Item"
import { PageHeroData } from "../types/heroData"
import Hero from "../types/heroList"
import DotaMatch from "../types/matchData"
import PickStats from "../types/pickStats"
import { usePageContext } from "../stat_page/pageContext"

export const HeroPageTopSection = (props: {
    role: string; updatePageNumber: (idx: number) => void;
    updateMatchData: (match: DotaMatch[]) => void; updateRole: (role: RoleStrings) => void
    totalPicks?: PickStats;
}) => {
    const { heroData, nameParam, totalMatchData, filteredData, itemData, searchRes, heroList } = usePageContext()
    const { role, updateRole, updateMatchData, totalPicks } = props;
    return (
        <>
            <div className="flex" style={{ 'minHeight': '87px' }}>
                <div className="hero-img-wrapper" style={{ width: '250px' }} >
                    <HeroImg />
                    {!!totalMatchData.length &&
                        <MostUsed role={role} ></MostUsed>
                    }
                </div>
                <BestGames updatePageNumber={props.updatePageNumber} updateRole={updateRole}></BestGames>
                {!!Object.keys(heroData).length && !!filteredData.length &&
                    <BigTalent width='100px' margin='2% 0px 0px 230px' updateMatchData={updateMatchData} />
                }

            </div>
            <div style={{ 'minHeight': '45px', marginTop: '20px' }}>
                {itemData && totalPicks &&
                    < Build heroList={heroList} role={role} picks={totalPicks} searchRes={searchRes}
                        data={filteredData} heroData={heroData} heroName={nameParam} itemData={itemData} totalMatchData={totalMatchData} updateMatchData={updateMatchData} />
                }
            </div>
        </>
    )
}
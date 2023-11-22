/* eslint-disable no-unused-vars */
import { baseApiUrl } from "../../App"
import Build from "../HeroBuilds/build"
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

export const HeroPageTopSection = (props: {
    heroData: PageHeroData; nameParam: string; totalMatchData: DotaMatch[]; role: string; updatePageNumber: (idx: number) => void;
    updateMatchData: (match: DotaMatch[]) => void; itemData?: Items; filteredData: DotaMatch[]; updateRole: (role: RoleStrings) => void; searchRes?: TableSearchResults
    totalPicks?: PickStats, heroList: Hero[]
}) => {
    const { heroData, nameParam, totalMatchData, filteredData, role, updateRole, updateMatchData, itemData, searchRes, totalPicks } = props
    return (
        <>
            <div className="flex" style={{ 'minHeight': '87px' }}>
                <div className="hero-img-wrapper" style={{ width: '250px' }} >
                    <HeroImg heroData={heroData} heroName={nameParam} />
                    {!!totalMatchData.length &&
                        <MostUsed matchData={totalMatchData} role={role} updateMatchData={updateMatchData} itemData={itemData}></MostUsed>
                    }
                </div>
                <BestGames matchData={filteredData} totalMatchData={totalMatchData} updatePageNumber={props.updatePageNumber} updateRole={updateRole}></BestGames>
                {!!Object.keys(heroData).length && !!filteredData.length &&
                    <BigTalent totalMatchData={totalMatchData} matchData={filteredData} heroData={heroData} heroName={nameParam} width='100px' margin='2% 0px 0px 230px' updateMatchData={updateMatchData} />
                }

            </div>
            <div style={{ 'minHeight': '45px', marginTop: '20px' }}>
                {itemData && totalPicks &&
                    < Build heroList={props.heroList} role={role} picks={totalPicks} searchRes={searchRes}
                        data={filteredData} heroData={heroData} heroName={nameParam} itemData={itemData} totalMatchData={totalMatchData} updateMatchData={updateMatchData} />
                }
            </div>
        </>
    )
}
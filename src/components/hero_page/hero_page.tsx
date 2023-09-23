import { baseApiUrl } from "../../App"
import Build from "../HeroBuilds/build"
import BestGames from "../best_games/bestGames"
import BigTalent from "../big_talent/bigTalent"
import HeroImg from "../heroImg"
import MostUsed from "../most_used/mostUsed"
import Items from "../types/Item"
import Match from "../types/matchData"

export const HeroPageTopSection = (props: {
    heroData: {}; nameParam: string; totalMatchData: any[]; Role: string;
    updateMatchData: (match: Match[]) => void; itemData?: Items; filteredData: any[]; updateRole: (role: string) => void; searchRes?: any
    totalPicks: any
}) => {
    const { heroData, nameParam, totalMatchData, filteredData, Role, updateRole, updateMatchData, itemData, searchRes, totalPicks } = props
    return (
        <>
            <div className="flex" style={{ 'minHeight': '87px' }}>
                <div className="hero-img-wrapper" style={{ width: '250px' }} >
                    <HeroImg baseApiUrl={baseApiUrl} heroData={heroData} heroName={nameParam} />
                    {!!totalMatchData.length &&
                        <MostUsed baseApiUrl={baseApiUrl} matchData={totalMatchData} role={Role} updateMatchData={updateMatchData} itemData={itemData}></MostUsed>
                    }
                </div>
                <BestGames matchData={filteredData} totalMatchData={totalMatchData} updateRole={updateRole}></BestGames>
                {!!Object.keys(heroData).length && !!filteredData.length &&
                    <BigTalent totalMatchData={totalMatchData} matchData={filteredData} heroData={heroData} heroName={nameParam} width='100px' margin='2% 0px 0px 230px' updateMatchData={updateMatchData} />
                }

            </div>
            <div style={{ 'minHeight': '45px', marginTop: '20px' }}>
                {itemData &&
                    < Build baseApiUrl={baseApiUrl} role={Role} picks={totalPicks} searchRes={searchRes}
                        data={filteredData} heroData={heroData} heroName={nameParam} itemData={itemData} updateMatchData={updateMatchData} />
                }
            </div>
        </>
    )
}
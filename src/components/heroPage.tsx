import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BestGames from "./best_games/bestGames";
import BigTalent from "./big_talent/bigTalent";
import Build from "./HeroBuilds/build";
import HeroImg from "./heroImg";
import heroSwitcher from "./heroSwitcher";
import MostUsed from "./most_used/mostUsed";
import { baseApiUrlContext } from './../App';
import { filteredDataContext, totalMatchDataContext } from './page';

const HeroPage = (props: { type: string; updateMatchData: any; role: string, itemData: any; heroData: any; totalPicks: { [key: string]: any; }; searchRes: any; }) => {
    const [query] = useSearchParams();
    let t = useParams()
    const nameParam = heroSwitcher(t['name'])
    const baseApiUrl = useContext(baseApiUrlContext)
    const filteredData = useContext(filteredDataContext)
    const totalMatchData = useContext(totalMatchDataContext)
    return (
        <>
            <div className="flex" style={{}}>
                {props.type === 'hero' &&
                    <>
                        <div className="hero-img-wrapper">
                            <HeroImg baseApiUrl={baseApiUrl} heroData={props.heroData} heroName={nameParam} />
                            <MostUsed baseApiUrl={baseApiUrl} role={props.role} updateMatchData={props.updateMatchData} itemData={props.itemData}></MostUsed>
                        </div>
                        <div className="best-games-container" style={{ 'width': '1200px', 'height': '140px' }}>
                            <BestGames></BestGames>
                        </div>
                        {props.heroData.length && !!filteredData.length && props.type === 'hero' &&
                            <BigTalent heroData={props.heroData} heroName={nameParam} width='100px' margin='2% 0px 0px 230px' />
                        }
                    </>
                }
            </div>
            {!!props.heroData.length && props.itemData && nameParam && props.type === 'hero' &&
                < Build baseApiUrl={baseApiUrl} role={props.role} picks={props.totalPicks}
                    searchRes={props.searchRes} data={totalMatchData} heroData={props.heroData} heroName={nameParam} itemData={props.itemData} />
            }
        </>
    )
}
export default HeroPage
import { useState, useEffect } from 'react';
import BigTalentTooltip from './bigTalentTooltip';
import heroSwitcher from '../heroSwitcher';

const BigTalent = (props: { matchData: any, heroName: string,  heroData: any }) => {
    const [talents, setTalents] = useState<any>([])
    useEffect(() => {
        countTalents()

    }, [props.matchData])
    const countTalents = () => {
        const talentCount: any = {}
        // initialise object 
        for (let k in props.heroData['talents']) {
            const talent = props.heroData['talents'][k]
            let lvl = 0
            if (talent['slot'] === 0 || talent['slot'] === 1) {
                lvl = 10
            }
            else if (talent['slot'] === 2 || talent['slot'] === 3) {
                lvl = 15
            }
            else if (talent['slot'] === 4 || talent['slot'] === 5) {
                lvl = 20
            }
            else if (talent['slot'] === 6 || talent['slot'] === 7) {
                lvl = 25
            }
            talentCount[talent['name_loc']] = { count: 0, slot: talent['slot'], total_picks: 0, level: lvl }

        }
        for (let match of props.matchData) {
            for (let ability of match['abilities']) {
                if (ability['type'] === 'talent') {
                    const k = ability['key']
                    const slot = ability['slot']
                    const count = talentCount[k]['count']
                    talentCount[k] = { count: count + 1, slot: slot, total_picks: talentCount[k]['total_picks'], level: talentCount[k]['level'] }
                }
            }

        }
        for (let k in talentCount) {
            const slot = talentCount[k]['slot']
            if (talentCount[k]['slot'] % 2 === 0) {
                const found = Object.keys(talentCount).find(key => {
                    return talentCount[key]['slot'] === slot + 1
                });
                if (found) {
                    talentCount[found]['total_picks'] = talentCount[k]['count'] + talentCount[found]['count']
                    talentCount[k]['total_picks'] = talentCount[k]['count'] + talentCount[found]['count']
                }
            }
        }
        const sortO = (a: any, b: any) => {
            return talentCount[a]['slot'] - talentCount[b]['slot']
        }
        const ordered = Object.keys(talentCount).sort((a, b) => sortO(a, b)).reduce(
            (obj: any, key: string) => {
                obj[key] = talentCount[key];
                return obj;
            },
            {}
        );
        setTalents(ordered)
    }

    return (
        <div className="talent-wrapper">
            {talents &&
                <BigTalentTooltip talents={talents}>
                    <div className="big-talent talents" >
                        {Object.entries(talents).reverse().map((x, i) => {
                            const v: any = x[1]
                            const side = v['slot'] % 2 === 0 ? 'l-talent' : 'r-talent'
                            if (v['count'] * 2 >= v['total_picks'] && v['count']) {
                                return <div key={i} className={'lvl' + v['level'] + ' ' + side}></div>
                            }

                        })}
                    </div>
                </BigTalentTooltip >
            }
        </div >
    )
}
export default BigTalent
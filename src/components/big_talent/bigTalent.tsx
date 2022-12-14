import { useState, useEffect } from 'react';
import BigTalentTooltip from './bigTalentTooltip';

const BigTalent = (props: { matchData: any, heroName: string, heroData: any }) => {
    const [talents, setTalents] = useState<any>([])
    useEffect(() => {
        countTalents()
    }, [props.matchData])
    const heroData = props.heroData[0][props.heroName]
    const countTalents = () => {
        const talentCount: any = {}
        // initialise object 
        for (let k in heroData['talents']) {
            const talent = heroData['talents'][k]
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
            talentCount[String(talent['id'])] = { count: 0, slot: talent['slot'], total_picks: 0, level: lvl, key: talent['name_loc'] }

        }
        for (let match of props.matchData) {
            for (let ability of match['abilities']) {
                if (ability['type'] === 'talent') {
                    const k = ability['id']
                    const count = talentCount[k]['count']
                    talentCount[k]['count'] = count + 1
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
                    const totalPicks = talentCount[k]['count'] + talentCount[found]['count']
                    talentCount[found]['total_picks'] = totalPicks
                    talentCount[k]['total_picks'] = totalPicks
                }
            }
        }
        const sorted =
            Object.entries(talentCount).sort((a: any, b: any) => a[1].slot - b[1].slot)

        setTalents(sorted)
    }

    return (
        <div className="talent-wrapper">
            {talents &&
                <BigTalentTooltip talents={talents}>
                    <div className="big-talent talents" >
                        {[...talents].reverse().map((x: any, i: number) => {
                            const v: any = x[1]
                            const side = v['slot'] % 2 !== 0 ? 'l-talent' : 'r-talent'
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
import { useState, useEffect, useContext } from 'react';
import { totalMatchDataContext } from '../page';
import BigTalentTooltip from './bigTalentTooltip';
import { filteredDataContext } from './../page';

const BigTalent = (props: { heroName: string, heroData: any, width: string, margin: string }) => {
    const [talents, setTalents] = useState<any>([])
    const filteredData = useContext(filteredDataContext)
    const totalMatchData = useContext(totalMatchDataContext)

    const matchData = totalMatchData || filteredData
    console.log(matchData)
    useEffect(() => {
        const heroData = props.heroData[0][props.heroName]
        const sorted = countTalents(heroData, matchData)
        setTalents(sorted)
    }, [matchData])

    return (
        <div className="talent-wrapper">
            {talents &&
                <BigTalentTooltip talents={talents}>
                    <div className="talents" style={{ width: props.width, height: props.width, margin: props.margin }}>
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
export const countTalents = (heroData: any, matchData: any) => {
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
    for (let match of matchData) {
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
    return sorted
}
export default BigTalent
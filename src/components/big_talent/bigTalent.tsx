import { useState, useEffect } from 'react';
import BigTalentTooltip from './bigTalentTooltip';
import heroSwitcher from '../heroSwitcher';

const BigTalent = (props: { heroName: string, baseApiUrl: string }) => {
    const [talents, setTalents] = useState<any[]>([])
    useEffect(() => {
        (async () => {
            const heroName = heroSwitcher(props.heroName)
            const data = await fetch(`${props.baseApiUrl}files/talent-data/${heroName}`)
            const json = await data.json()
            setTalents(json)
            console.log(json)
        })()
    }, [])
    return (
        <div className="talent-wrapper">
            <BigTalentTooltip talents={talents}>
                <div className="big-talent talents" >
                    {talents.reverse().map((x, i) => {
                        const side = x['slot'] % 2 !== 0 ? 'l-talent' : 'r-talent'
                        const lvl = x['level']
                        if (x['talent_count'] * 2 >= x['total_pick_count']) {
                            return <div key={i} className={'lvl' + lvl + ' ' + side}></div>
                        }
                    })}
                </div>
            </BigTalentTooltip >
        </div >
    )
}
export default BigTalent
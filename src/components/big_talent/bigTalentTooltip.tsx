import { useMemo } from 'react';
import { useState, Fragment } from 'react';

const BigTalentTooltip = (props: any) => {
    const pairTalents = () => {
        const keys = Object.keys(props.talents)
        let j = 0
        const rows = []
        if (!keys.length) return
        for (let i = 0; i < 4; i++) {
            const firstKey = props.talents[j + 1][1]['key']
            const secondKey = props.talents[j][1]['key']
            rows[i] = [{ [firstKey]: props.talents[j + 1][1] }, { [secondKey]: props.talents[j][1] }]
            j += 2
        }
        return rows.reverse()
    }
    const memo = useMemo(() => pairTalents(), [props.talents])
    return (
        <div className="toltip">
            {props.children}
            {props.open && props.talents.length > 0 && memo &&
                <div className="tooltip" id='talents' style={{ marginRight: '105px', marginTop: '11px' }}>
                    {memo.map((talentObj: any, i: number) => {
                        const k = Object.keys(talentObj[0])[0]
                        const level = talentObj[0][k]['level']
                        return (
                            <Fragment key={i}>
                                <TalentRow side='talent-left' talent={talentObj[0]} matchData={props.filteredData} updateMatchData={props.updateMatchData} ></TalentRow>
                                <div className="talent-center">
                                    <div className="talent-level">{level}</div>
                                    <p>pick</p>
                                </div>
                                <TalentRow side='talent-right' talent={talentObj[1]} matchData={props.filteredData} updateMatchData={props.updateMatchData}></TalentRow>
                            </Fragment>
                        )
                    })}
                </div>
            }
        </div >
    )
}
const TalentRow = (props: any) => {
    const k = Object.keys(props.talent)[0]
    const perc = props.talent[k]['count'] / props.talent[k].total_picks * 100 || 0
    const talentKey = props.talent[k]['key']
    const filterByTalents = (matchData: any, talentName: string) => {
        const filteredData = matchData.filter((match: any) => match['abilities'].map((ability: any) => ability['key']).includes(talentName))
        props.updateMatchData(filteredData, { 'talents': { [talentKey]: { 'matches': filteredData } } })
    }
    return (
        <div className={props.side} onClick={() => filterByTalents(props.matchData, talentKey)}>
            <p className='talent-text'>
                {talentKey}
            </p>
            <div className="talent-bar" style={{ width: perc + '%' }}></div>
            <p>{perc.toFixed(2).replace(/\.00/, '')}%</p>
        </div>
    )
}
export default BigTalentTooltip
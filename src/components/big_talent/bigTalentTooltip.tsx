import { useMemo } from 'react'
import { Fragment } from 'react'
import { cleanDecimal } from '../../utils/cleanDecimal'
import { usePageContext } from '../stat_page/pageContext'

const BigTalentTooltip = (props: any) => {
    const pairTalents = () => {
        const keys = Object.keys(props.talents)
        let j = 0
        const rows = []
        if (!keys.length) return
        for (let i = 0; i < 4; i++) {
            for (let i = 0; i < 4; i++) {
                const firstKey = props.talents[j][1]['key']
                const secondKey = props.talents[j + 1][1]['key']
                rows[i] = [
                    { [firstKey]: props.talents[j][1] },
                    { [secondKey]: props.talents[j + 1][1] },
                ]
                j += 2
            }
            return rows.reverse()
        }
    }
    const memo = useMemo(() => pairTalents(), [props.talents])
    return (
        <div className="toltip">
            {props.children}
            {props.open && props.talents.length > 0 && memo && (
                <div
                    className="tooltip"
                    id="talents"
                    style={{ marginRight: '105px', marginTop: '11px' }}
                >
                    {memo.map((talentObj: any, i: number) => {
                        const k = Object.keys(talentObj[0])[0]
                        const level = talentObj[0][k]['level']
                        return (
                            <Fragment key={i}>
                                <TalentRow
                                    side="talent-left"
                                    talent={talentObj[0]}
                                    matchData={props.filteredData}
                                    updateMatchData={props.updateMatchData}
                                ></TalentRow>
                                <div className="talent-center">
                                    <div className="talent-level">{level}</div>
                                    <p>pick</p>
                                </div>
                                <TalentRow
                                    side="talent-right"
                                    talent={talentObj[1]}
                                    matchData={props.filteredData}
                                    updateMatchData={props.updateMatchData}
                                ></TalentRow>
                            </Fragment>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
const TalentRow = (props: any) => {
    const k = Object.keys(props.talent)[0]
    const perc =
        (props.talent[k]['count'] / props.talent[k].total_picks) * 100 || 0
    const talentKey = props.talent[k]['key']
    const { totalMatchData } = usePageContext()
    const filterByTalents = (talentName: string) => {
        const filtered = totalMatchData.filter((match) =>
            match['abilities']
                .map((ability) => ability['key'])
                .includes(talentName)
        )
        props.updateMatchData(filtered, {
            talents: { [talentKey]: { matches: totalMatchData } },
        })
    }
    return (
        <div className={props.side} onClick={() => filterByTalents(talentKey)}>
            <p className="talent-text">{talentKey}</p>
            <div className="talent-bar" style={{ width: perc + '%' }}></div>
            <p>{cleanDecimal(perc)}%</p>
        </div>
    )
}
export default BigTalentTooltip

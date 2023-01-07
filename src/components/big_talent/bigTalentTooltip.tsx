import { useMemo } from 'react';
import { useState, Fragment } from 'react';

const BigTalentTooltip = (props: any) => {
    const [open, setOpen] = useState(false)
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
        <div className="toltip" onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}>
            {props.children}
            {open && props.talents.length > 0 && memo &&
                <div className="tooltip" id='talents' style={{ marginRight: '105px', marginTop: '11px' }}>
                    {memo.map((x: any, i: number) => {
                        const k = Object.keys(x[0])[0]
                        const level = x[0][k]['level']
                        return (
                            <Fragment key={i}>
                                <TalentRow side='talent-left' talent={x[0]}></TalentRow>
                                <div className="talent-center">
                                    <div className="talent-level">{level}</div>
                                    <p>pick</p>
                                </div>
                                <TalentRow side='talent-right' talent={x[1]}></TalentRow>
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
    return (
        <div className={props.side}>
            <p className='talent-text'>
                {talentKey}
            </p>
            <div className="talent-bar" style={{ width: perc + '%' }}></div>
            <p>{perc.toFixed(2).replace(/\.00/, '')}%</p>
        </div>
    )
}
export default BigTalentTooltip
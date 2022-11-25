import { useMemo } from 'react';
import { useState, Fragment } from 'react';

const BigTalentTooltip = (props: any) => {
    const [open, setOpen] = useState(false)
    const comp = () => {
        const keys = Object.keys(props.talents)
        let j = 0
        const rows = []
        for (let i = 0; i < 4; i++) {
            rows[i] = [{ [keys[j]]: props.talents[keys[j]] }, { [keys[j + 1]]: props.talents[keys[j + 1]] }]
            j += 2
        }
        return rows.reverse()
    }

    const memo = useMemo(() => comp(), [props.talents])
    return (
        <div className="toltip" onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}>
            {props.children}
            {open && memo.length > 0 &&
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
    return (
        <div className={props.side}>
            <p className='talent-text'>
                {k}
            </p>
            <div className="talent-bar" style={{ width: perc + '%' }}></div>
            <p>{Math.round(perc)}%</p>
        </div>
    )
}
export default BigTalentTooltip
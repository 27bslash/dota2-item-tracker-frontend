import  { useMemo } from 'react';
import { useState, Fragment } from 'react';

const BigTalentTooltip = (props: any) => {
    const [open, setOpen] = useState(false)
    const comp = () => {
        console.log('momo')
        let j = 0
        const rows = []
        for (let i = 0; i < 4; i++) {
            rows[i] = [props.talents[j], props.talents[j + 1]]
            j += 2
        }
        return rows
    }
    const memo = useMemo(() => comp(), [props.talents])

    return (
        <div className="toltip" onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}>
            {props.children}
            {open && props.talents.length > 0 &&
                <div className="tooltip" id='talents' style={{ marginRight: '105px', marginTop: '11px' }}>
                    {memo.map((x: any, i: number) => {
                        // console.log('ros', props.talents)
                        const level = x[0]['level']
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
    const perc = props.talent.talent_count / props.talent.total_pick_count * 100
    return (
        <div className={props.side}>
            <p className='talent-text'>
                {props.talent.key}
            </p>
            <div className="talent-bar" style={{ width: perc + '%' }}></div>
            <p>{Math.round(perc)}%</p>
        </div>
    )
}
export default BigTalentTooltip
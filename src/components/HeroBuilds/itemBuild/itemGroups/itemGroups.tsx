import { Typography } from "@mui/material";
import { ItemBuildCell } from "../itemBuildCell/itemBuildCell";
import Items from "../../../types/Item";
import { RawItemBuild } from "../itemFitltering/itemFiltering";

export const ItemGroups = (props: { buildObject: any; timing: string; offset?: { left: number, top: number }, ObjectKey: 'core' | 'situational' }) => {
    const { buildObject, offset, timing, ObjectKey } = props
    const odf = buildObject[ObjectKey].flat().some((x: any) => {
        // const key = Object.keys(x)[0]
        return x['option']
    })
    const optionMargin = () => {
        const len = buildObject[ObjectKey][0].length >= 6 ? 6 : buildObject[ObjectKey][0].length
        return odf ? (7 - len) * 5 * 6 : 0
    }
    const disassembleMargin = () => {
        let ret = 0
        buildObject[ObjectKey][0].forEach((x: any) => {
            // const key = Object.keys(x)[0]
            if (x['dissassembledComponents']) {
                // console.log(x)
                ret += x['dissassembledComponents'].length
            }
            // console.log(ret)
        })
        return ret
    }
    // console.log(disassembleMargin())

    return (
        <>
            {buildObject[ObjectKey] && buildObject[ObjectKey].length !== 0 &&
                <>
                    <Typography variant={'h6'} className='build-header'>{`${timing} ${ObjectKey}`}</Typography>
                    <div className={`${ObjectKey} flex`} style={{ flexDirection: 'column', marginLeft: `${optionMargin()}px` }}>
                        {buildObject[ObjectKey].map((itemGroup: any, i: number) => {
                            const centerOffset = itemGroup.length % 2 === 0 || i === 0 ? 0 : -54
                            const leftOffset = offset ? offset.left + 'px' : '0px'
                            const underMarginLeft = i === 1 && disassembleMargin() ? disassembleMargin() * 27 : centerOffset
                            const style = !odf ? { marginLeft: underMarginLeft + 'px', justifyContent: 'center' } : { marginLeft: leftOffset }
                            return (
                                <div key={i} className='flex' style={style}>
                                    {itemGroup.map((group: any, j: number) => {
                                        const itemkey = group['key']
                                        const itemOffset = group['offset'] || { top: '0px', left: '0px' }
                                        return (
                                            <div key={j} className="item-offset" style={{ marginTop: itemOffset['top'], marginLeft: itemOffset['left'] }}>
                                                <ItemBuildCell itemkey={itemkey} item={group} />
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })
                        }
                    </div>
                </>
            }
        </>
    )
}
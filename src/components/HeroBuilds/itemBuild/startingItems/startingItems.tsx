import { Typography } from '@mui/material'
import TableItem from '../../../table/tableItems/tableItem'
import { HeroBuild } from '../../buildHooks/buildHook'
type StartingItemsProps = {
    startingItemData: HeroBuild
    data?: any
}
const StartingItems = (props: StartingItemsProps) => {
    const exp = (
        props.data ? props.data!.length : props.startingItemData['length']!
    ).toFixed(2)

    return (
        <div className="most-used-starting-items">
            {props.startingItemData['starting_items'].map((arr, idx) => {
                return (
                    <div
                        className="starting-items flex"
                        style={{ alignItems: 'center', paddingBottom: '5px' }}
                        key={idx}
                    >
                        {arr[0].split('__').map((item, i: number) => {
                            return (
                                <TableItem
                                    key={i}
                                    type="item"
                                    height="40px"
                                    itemKey={item}
                                    overlay={false}
                                />
                            )
                        })}
                        <Typography
                            align={'center'}
                            sx={{ color: 'white', marginLeft: '10px' }}
                        >
                            {((arr[1] / +exp) * 100).toFixed(2)}%
                        </Typography>
                    </div>
                )
            })}
        </div>
    )
}

export default StartingItems

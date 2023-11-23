import { Typography } from "@mui/material"
import TableItem from "../../../table/tableItems/tableItem"
type StartingItemsProps = {
    startingItemData: [string, number][],
    data: any
}
const StartingItems = (props: StartingItemsProps) => {
    return (
        <div className="most-used-starting-items">
            {props.startingItemData.map((arr, idx) => {
                return (
                    <div className="starting-items flex" style={{ alignItems: 'center', paddingBottom: '5px' }} key={idx}>
                        {arr[0].split('__').map((item, i: number) => {
                            return (
                                <TableItem key={i} type='item' height='40px' itemKey={item} overlay={false} />
                            )
                        })}
                        <Typography align={'center'} sx={{ color: 'white', marginLeft: '10px' }}>{(arr[1] / props.data.length * 100).toFixed(2)}%</Typography>
                    </div>
                )
            })}
        </div>
    )
}

export default StartingItems
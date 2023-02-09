import TableItem from "../../../table/tableItem"
type StartingItemsProps = {
    data: [string, number][],
    itemData: any,
}
const StartingItems = (props: StartingItemsProps) => {
    return (
        <div className="most-used-starting-items">
            {props.data.map((arr, idx) => {
                return (
                    <div className="starting-items flex" key={idx}>
                        {arr[0].split('__').map((item, i: number) => {
                            return (
                                <TableItem key={i} type='item' height='40px' itemKey={item} filteredData={props.data} totalMatchData={props.data} items={props.itemData} role='' overlay={false} />
                            )
                        })}
                        <p style={{ color: 'white' }}>{arr[1]}/{props.data.length}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default StartingItems
import TableItem from "../../../table/tableItem"
import countStartingItems from "./startingItemsFilter"

const StartingItems = (props: any) => {
    const items = countStartingItems(props.data)
    return (
        <div className="most-used-starting-items">
            {items.map((arr, idx) => {
                return (
                    <div className="starting-items flex" key={idx}>
                        {arr[0].split('__').map((item, i: number) => {
                            return (
                                <TableItem type='item' height='40px' itemKey={item} filteredData={props.data} totalMatchData={props.data} items={props.itemData} role='' overlay={false} />
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
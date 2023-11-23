import { cleanDecimal } from "../../../../utils/cleanDecimal";
import TableItem from "../../../table/tableItems/tableItem";


export const ItemBuildImage = (props: { k: string, avgTime?: number, disassemble?: any; perc: string | number; orText?: string, }) => {
    return < div className="item-build-img">
        {props.avgTime &&
            <p style={{ margin: '0', color: 'white' }}>{props.avgTime}m {props.disassemble ? 'D' : ''}</p>
        }
        <TableItem type='item' height='40px' width='55px' itemKey={props.k.replace(/__\d+/g, '')} overlay={false} />
        {/* <p style={{ margin: '0', color: 'white' }}>{perc}%</p> */}
        <p style={{ margin: '0', color: 'white', textAlign: 'center' }}>{cleanDecimal(props.perc)}%</p>
        <p style={{ margin: 0, color: 'white' }}>{props.orText}</p>
    </div>;
}
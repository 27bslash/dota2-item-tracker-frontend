import { cleanDecimal } from "../../../../utils/cleanDecimal";
import TableItem from "../../../table/tableItems/tableItem";

type ItemBuildImageProps = {
  k: string;
  avgTime?: number;
  disassemble?: boolean;
  perc: string | number;
  orText?: string;
  enchant?: string;
};
export const ItemBuildImage = ({
  k,
  avgTime,
  disassemble,
  perc,
  orText,
  enchant,
}: ItemBuildImageProps) => {
  return (
    <div className="item-build-img">
      {avgTime && (
        <p style={{ margin: "0", color: "white" }}>
          {avgTime}m {disassemble ? "D" : ""}
        </p>
      )}
      <TableItem
        enchant={enchant}
        type="item"
        height="40px"
        width="55px"
        itemKey={k.replace(/__\d+/g, "")}
        overlay={false}
      />
      {/* <p style={{ margin: '0', color: 'white' }}>{perc}%</p> */}
      <p style={{ margin: "0", color: "white", textAlign: "center" }}>
        {cleanDecimal(perc)}%
      </p>
      <p style={{ margin: 0, color: "white" }}>{orText}</p>
    </div>
  );
};

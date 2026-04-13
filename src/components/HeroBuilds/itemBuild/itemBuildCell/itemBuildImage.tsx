import { cleanDecimal } from "../../../../utils/cleanDecimal";
import TableItem from "../../../table/tableItems/tableItem";

const PRO_RATIO_THRESHOLD = 1.3;

type ItemBuildImageProps = {
  k: string;
  avgTime?: number;
  disassemble?: boolean;
  perc: string | number;
  orText?: string;
  enchant?: string;
  type?: string;
  proRatio?: number;
  proAdjustedValue?: number;
};
export const ItemBuildImage = ({
  k,
  avgTime,
  disassemble,
  perc,
  orText,
  enchant,
  proRatio,
  proAdjustedValue,
}: ItemBuildImageProps) => {
  const isProFavoured = proRatio !== undefined && proRatio >= PRO_RATIO_THRESHOLD;
  let type: "item" | "shard" | "scepter" = "item";
  if (k === "aghanims_shard") {
    type = "shard";
  } else if (k === "ultimate_scepter") {
    type = "scepter";
  }
  return (
    <div className="item-build-img">
      {avgTime && (
        <p style={{ margin: "0", color: "white" }}>
          {avgTime}m {disassemble ? "D" : ""}
        </p>
      )}
      <TableItem
        enchant={enchant}
        type={type}
        height="40px"
        width="55px"
        itemKey={k.replace(/__\d+/g, "")}
        overlay={false}
      />
      {/* <p style={{ margin: '0', color: 'white' }}>{perc}%</p> */}
      
      <p style={{ margin: "0", color: "white", textAlign: "center" }}>
        {cleanDecimal(perc)}%
      </p>
      {isProFavoured && proAdjustedValue !== undefined && (
        <p style={{ margin: 0, fontSize: "0.85em", color: "hsl(45,100%,65%)", textAlign: "center", lineHeight: 1 }}>
          {cleanDecimal(proAdjustedValue)}% pro
        </p>
      )}
      <p style={{ margin: 0, color: "white" }}>{orText}</p>
    </div>
  );
};

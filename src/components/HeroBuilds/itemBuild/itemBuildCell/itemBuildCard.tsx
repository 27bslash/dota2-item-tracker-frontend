import { Typography } from "@mui/material";
import { CoreItem } from "../itemGroups/groupBytime";
import { cleanDecimal } from "../../../../utils/cleanDecimal";
import TableItem from "../../../table/tableItems/tableItem";
import { ItemComponents } from "../itemComponents/itemComponents";

const itemType = (key: string) =>
  key === "aghanims_shard"
    ? "shard"
    : key === "ultimate_scepter"
      ? "scepter"
      : "item";

type CardProps = {
  item: CoreItem;
  keyName: string;
  minutes: number;
  value: number;
  disassemble?: boolean;
  proAdjustedValue?: number;
  showPro?: boolean;
  dimmed?: boolean;
};

const Card = ({
  item,
  keyName,
  minutes,
  value,
  disassemble,
  proAdjustedValue,
  showPro,
  dimmed,
}: CardProps) => (
  <div
    style={{
      textAlign: "center",
      opacity: dimmed ? 0.75 : 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "55px",
    }}
  >
    <Typography
      variant="caption"
      color="grey.400"
      style={{ lineHeight: 1, display: "block" }}
    >
      {minutes}m{disassemble ? " D" : ""}
    </Typography>
    <TableItem
      enchant={undefined}
      type={itemType(keyName)}
      height="55px"
      width="55px"
      itemKey={keyName.replace(/__\d+/g, "")}
      overlay={false}
    />
    <Typography
      variant="caption"
      color="white"
      style={{ lineHeight: 1, display: "block" }}
    >
      {cleanDecimal(value)}%
    </Typography>
    {showPro && proAdjustedValue !== undefined && (
      <Typography
        variant="caption"
        style={{
          lineHeight: 1,
          display: "block",
          color: "hsl(45,100%,65%)",
          fontSize: "0.63em",
        }}
      >
        {cleanDecimal(proAdjustedValue, 1)}% pro
      </Typography>
    )}
    <Typography variant="caption">
      {item.itemCount} / {item.totalMatches}
    </Typography>
  </div>
);

function ItemBuildCard({ itemkey, item }: { itemkey: string; item: CoreItem }) {
  const option = item.option;
  const components = item.disassembledComponents;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "2px" }}>
      {components && (
        <div style={{ marginTop: "14px" }}>
          <ItemComponents components={components} dimmed={true} />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Card
          item={item}
          keyName={itemkey}
          minutes={Math.floor(item.time / 60)}
          value={item.adjustedValue}
          disassemble={item.disassemble}
          proAdjustedValue={item.proAdjustedValue}
          showPro
        />
        {option && (
          <>
            <Typography
              variant="caption"
              color="grey.500"
              style={{ lineHeight: 1, alignSelf: "center", padding: "0 2px" }}
            >
              or
            </Typography>
            <Card
              item={item}
              keyName={option.choice}
              minutes={Math.floor(option.time / 60)}
              showPro
              value={option.targetValue}
              dimmed
            />
          </>
        )}
      </div>
    </div>
  );
}
export default ItemBuildCard;

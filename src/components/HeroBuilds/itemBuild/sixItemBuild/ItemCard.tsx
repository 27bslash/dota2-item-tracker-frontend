import { Typography } from "@mui/material";
import TableItem from "../../../table/tableItems/tableItem";
import {
  SixItemEntry,
  effectiveValue,
  getItemType,
  normalizeItemKey,
} from "./sixItemBuildTypes";

const ItemCard = ({
  item,
  dimmed,
}: {
  item: SixItemEntry;
  dimmed?: boolean;
}) => {
  const normalizedKey = normalizeItemKey(item.key);
  const displayValue = effectiveValue(item);
  const isProFavoured = displayValue > item.adjustedValue;
  const isGreatlyProFavoured = isProFavoured && item.proRatio >= 1.3;
  return (
    <div
      style={{
        opacity: dimmed && !isGreatlyProFavoured ? 0.65 : 1,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: isGreatlyProFavoured
          ? "rgba(255,200,50,0.08)"
          : "rgba(255,255,255,0.05)",
        borderRadius: "4px",
        padding: "6px 8px",
        border: isGreatlyProFavoured
          ? "1px solid rgba(255,200,50,0.7)"
          : "1px solid transparent",
        boxShadow: isGreatlyProFavoured
          ? "0 0 6px rgba(255,200,50,0.3)"
          : "none",
      }}
    >
      <TableItem
        enchant={undefined}
        type={getItemType(normalizedKey)}
        height="40px"
        width="40px"
        itemKey={normalizedKey}
        overlay={false}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="caption"
          color="grey.400"
          style={{ lineHeight: 1 }}
        >
          {Math.floor(item.time / 60)}m
        </Typography>
        <Typography variant="caption" color="white" style={{ lineHeight: 1 }}>
          `${item.adjustedValue.toFixed(1)}%`
        </Typography>
        <Typography
          variant="caption"
          style={{
            lineHeight: 1,
            color: "hsl(45,100%,65%)",
            fontSize: "0.65em",
          }}
        >
          {item.proAdjustedValue !== null && item.proAdjustedValue !== undefined
            ? `${item.proAdjustedValue.toFixed(1)}% pro`
            : "-"}
        </Typography>
        <Typography
          variant="caption"
          style={{
            lineHeight: 1,
            color: "gray",
            fontSize: "0.65em",
          }}
        >
          {`${item.itemCount} / ${item.totalMatches} Matches`}
        </Typography>
      </div>
    </div>
  );
};

export default ItemCard;

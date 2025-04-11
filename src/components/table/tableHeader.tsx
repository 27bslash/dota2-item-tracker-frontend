import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { JSX, useEffect, useState } from "react";
import DotaMatch from "../types/matchData";

interface OrderableCellProps<T> {
  align?: "inherit" | "left" | "center" | "right" | "justify";
  maxWidth?: string;
  maxHeight?: string;
  border?: string;
  fontSize?: string;
  color?: string;
  orderBy: string;
  order?: "asc" | "desc";
  sort: keyof T;
  sortDirection: "asc" | "desc";
  label: string;
  onRequestSort: (property: keyof T, sortDirection: string) => void;
}

export const OrderableCell = <T,>(props: OrderableCellProps<T>) => {
  const [sortDirection, setSortDirection] = useState(props.sortDirection);
  return (
    <TableCell
      size="small"
      align={props.align}
      sx={{
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight,
        border: props.border,
        fontSize: props.fontSize,
      }}
    >
      <TableSortLabel
        sx={{
          color: `${props.color} !important`,
          textTransform: "uppercase",
          fontWeight: "bold !important",
          ":hover": { opacity: `0.8 !important` },
          maxWidth: props.maxWidth,
        }}
        direction={props.orderBy === props.sort ? props.order : "asc"}
        onClick={() => {
          props.onRequestSort(props.sort, sortDirection);

          return setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        }}
        hideSortIcon
      >
        {props.label}
      </TableSortLabel>
    </TableCell>
  );
};
interface TableHeaderProps {
  onRequestSort: (property: keyof DotaMatch, sortDirection: string) => void;
  orderBy: string;
  sortDirection: string;
  showStarter: boolean;
  type: string;
}
const TableHeader = (props: TableHeaderProps) => {
  const [header, setHeader] = useState<JSX.Element>();
  const commonProps = {
    onRequestSort: props.onRequestSort,
    orderBy: props.orderBy,
  };
  useEffect(() => {
    const head = (
      <TableHead>
        <TableRow>
          <OrderableCell
            label=""
            sort="win"
            {...commonProps}
            sortDirection="asc"
            maxWidth="0px"
          />
          <TableCell
            padding="normal"
            sx={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            <TableSortLabel hideSortIcon sx={{ color: "white !important" }}>
              ITEMS
            </TableSortLabel>
          </TableCell>
          <OrderableCell
            label="Played"
            sort="unix_time"
            {...commonProps}
            sortDirection="desc"
            color="white"
          />
          {props.type === "hero" ? (
            <OrderableCell
              label="Player"
              sort="name"
              {...commonProps}
              sortDirection="desc"
              color="white"
            />
          ) : (
            <OrderableCell
              label="Hero"
              sort="hero"
              {...commonProps}
              sortDirection="desc"
              color="white"
            />
          )}
          <TableCell sx={{ minWidth: "20px" }}>
            {/* copy match -id */}
          </TableCell>
          <TableCell align="left" sx={{ color: "white", fontWeight: "600" }}>
            <TableSortLabel hideSortIcon sx={{ color: "white !important" }}>
              ROLE
            </TableSortLabel>
          </TableCell>
          {!props.showStarter ? (
            <>
              <OrderableCell
                label="LVL"
                sort="lvl"
                {...commonProps}
                sortDirection="asc"
                color="white"
              />
              <OrderableCell
                label="K"
                sort="kills"
                {...commonProps}
                sortDirection="asc"
                color="green"
              />
              <OrderableCell
                label="D"
                sort="deaths"
                {...commonProps}
                sortDirection="desc"
                color="red"
              />
              <OrderableCell
                label="A"
                sort="assists"
                {...commonProps}
                sortDirection="asc"
                color="gray"
              />
              <OrderableCell
                label="CS"
                sort="last_hits"
                {...commonProps}
                sortDirection="asc"
                color="white"
              />
              <OrderableCell
                label="NET"
                color="gold"
                sort="gold"
                {...commonProps}
                sortDirection="asc"
              />
              <OrderableCell
                label="GPM"
                align="right"
                sort="gpm"
                {...commonProps}
                sortDirection="asc"
                color="gold"
              />
              <OrderableCell
                label="/XPM"
                align="left"
                sort="xpm"
                {...commonProps}
                sortDirection="asc"
                color="gray"
              />
            </>
          ) : (
            <>
              <OrderableCell
                label="LVL"
                sort="lvl_at_ten"
                {...commonProps}
                sortDirection="asc"
                color="white"
              />
              <OrderableCell
                label="K"
                sort="kills_ten"
                {...commonProps}
                sortDirection="asc"
                color="green"
              />
              <OrderableCell
                label="D"
                sort="deaths_ten"
                {...commonProps}
                sortDirection="desc"
                color="red"
              />
              <OrderableCell
                label="A"
                sort="assists"
                {...commonProps}
                sortDirection="asc"
                color="gray"
              />
              <OrderableCell
                label="CS"
                sort="last_hits_ten"
                {...commonProps}
                sortDirection="asc"
                color="white"
              />
              <OrderableCell
                label="LANE EFF"
                color="gold"
                sort="lane_efficiency"
                {...commonProps}
                sortDirection="asc"
                maxWidth="40px"
              />
              <OrderableCell
                label="GPM"
                align="right"
                sort="gpm_ten"
                {...commonProps}
                sortDirection="asc"
                color="gold"
              />
              <OrderableCell
                label="/XPM"
                sort="xpm_ten"
                {...commonProps}
                sortDirection="asc"
                color="gray"
              />
            </>
          )}
          <OrderableCell
            label="HD"
            sort="hero_damage"
            {...commonProps}
            sortDirection="asc"
            color="white"
          />

          <OrderableCell
            label="TD"
            sort="tower_damage"
            {...commonProps}
            sortDirection="asc"
            color="white"
          />

          <OrderableCell
            label="Length"
            sort="duration"
            {...commonProps}
            sortDirection="asc"
            color="white"
          />

          <OrderableCell
            label="MMR"
            sort="mmr"
            {...commonProps}
            sortDirection="asc"
            color="white"
          />
        </TableRow>
      </TableHead>
    );
    setHeader(head);
  }, [props.sortDirection]);

  return <>{header}</>;
};
export default TableHeader;

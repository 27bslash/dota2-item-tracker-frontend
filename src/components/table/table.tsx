import {
  TableContainer,
  TableRow,
  Table,
  TableFooter,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import React, { useEffect, useState } from "react";
import TableHeader from "./tableHeader";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";
import CustomTableBody from "./tablebody";
import DotaMatch from "../types/matchData";
import { PageHeroData } from "../types/heroData";
import Hero from "../types/heroList";
import Items from "../types/Item";
import { RoleStrings } from "../home/home";

interface TableProps {
  showStarter: boolean;
  pageNumber?: number;
  heroList: Hero[];
  playerList: string[];
  heroData: PageHeroData;
  itemData: Items | undefined;
  nameParam: string;
  type: string;
  filteredData: DotaMatch[];
  count: number;
  updateMatchData: (data: DotaMatch[]) => void;
  totalMatchData: DotaMatch[];
  role: RoleStrings;
}
TimeAgo.addDefaultLocale(en);
const CustomTable = (props: TableProps) => {
  const [page, setPage] = useState(props.pageNumber || 0);
  const [count, setCount] = useState(props.count);
  const [orderBy, setOrderBy] = useState<keyof DotaMatch>("unix_time");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const { filteredData, totalMatchData } = props;
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    setCount(props.count);
    if (page * 10 > props.count) {
      // console.log(page)
      setPage(0);
    }
  }, [props.count, page]);
  useEffect(() => {
    if (props.pageNumber) {
      setPage(props.pageNumber);
    }
  }, [props.pageNumber]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event);
    setPage(newPage);
  };

  const handleRequestSort = (
    property: keyof DotaMatch,
    sortDirection: string
  ) => {
    const isAsc = sortDirection === "asc";
    const ern = isAsc ? "desc" : "asc";
    setSortDirection(ern);
    setOrderBy(property);
    setFirstLoad(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sortTable = () => {

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[orderBy as keyof DotaMatch];
      const bValue = b[orderBy as keyof DotaMatch];

      if (aValue === undefined || aValue === null)
        return sortDirection === "asc" ? 1 : -1;
      if (bValue === undefined || bValue === null)
        return sortDirection === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    });
    return firstLoad ? anomalyCheck(sortedData) : sortedData;
  };
  const anomalyCheck = (matches: DotaMatch[]) => {
    const indexs: number[] = [];
    const proMatches = [];
    const nonProMatches = [...matches].filter((match, idx) => {
      if (match.pro) {
        indexs.push(idx);
        return false;
      }
      return true;
    });
    for (const idx of indexs) {
      const match = matches[idx];
      proMatches.unshift(match);
    }
    return proMatches
      .sort((a, b) => {
        return b.unix_time - a.unix_time;
      })
      .concat(nonProMatches);
  };
  const removeDuplicates = (arr: DotaMatch[]) => {
    const data = arr.filter(
      (match, index) =>
        arr.findIndex((m) => m.id === match.id) === index
    );
    return data;
  };
  return (
    <div className="item-table">
      {!filteredData.length && (
        <CircularProgress sx={{ width: "100px", position: "absolute" }} />
      )}
      {!!filteredData.length && (
        <TableContainer>
          <Table padding="none">
            <TableHeader
              sortDirection={sortDirection}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              showStarter={props.showStarter}
              type={props.type}
            />
            <CustomTableBody
              data={removeDuplicates(sortTable())}
              heroData={props.heroData}
              type={props.type}
              page={page}
              nameParam={props.nameParam}
              totalMatchData={totalMatchData}
              heroList={props.heroList}
              playerList={props.playerList}
              itemData={props.itemData}
              showStarter={props.showStarter}
              role={props.role}
              updateMatchData={props.updateMatchData}
            ></CustomTableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  sx={{ color: "white" }}
                  rowsPerPageOptions={[10]}
                  colSpan={3}
                  count={count}
                  rowsPerPage={10}
                  page={page}
                  onPageChange={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                  showFirstButton
                  showLastButton
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CustomTable;

/* eslint-disable no-unused-vars */
import Nav from "../nav/nav";
import CustomTable from "../table/table";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import TableSearch, {
  combineMatches,
} from "../table/table_search/table_search";
import { useParams } from "react-router";
import heroSwitcher from "../../utils/heroSwitcher";
import { Link, useSearchParams } from "react-router-dom";
import PickCounter from "../pick_counter/pickCounter";
import DotaMatch from "../types/matchData";
import { HeroPageTopSection } from "../hero_page/hero_page";
import { exists } from "../../utils/exists";
import { useHeroColor } from "./hooks/heroColorHook";
import { useHeroData } from "./hooks/heroDataHook";
import { useFetchAllData } from "./hooks/fetchPageData";
import { StarterToggle } from "./starterToggle";
import Hero from "../types/heroList";
import { TableSearchResults } from "../table/table_search/types/tableSearchResult.types";
import { RoleStrings } from "../home/home";
import PageContextProvider from "./pageContext";
import { theme } from "../../main";

//  TODO
//  lazyload images
//  fix role url not being able to be changed when clicking pick counter options
interface pageProps {
  type: string;
  heroList: Hero[];
  playerList: string[];
  palette?: string;
}
export interface MatchDataAdj {
  updateMatchData: (
    data: DotaMatch[],
    searchValue?: TableSearchResults,
    types?: string[]
  ) => void;
  matchData?: DotaMatch[];
  totalMatchData?: DotaMatch[];
  filteredData?: DotaMatch[];
}

const Page = ({ type, heroList, playerList }: pageProps) => {
  const [filteredData, setFilteredData] = useState<DotaMatch[]>([]);
  const [totalMatchData, setTotalMatchData] = useState<DotaMatch[]>([]);
  const [showStarter, setShowStarter] = useState(false);
  const [searchResults, setSearchResults] = useState<TableSearchResults>();
  const params = useParams();
  const [query] = useSearchParams();
  const role = (query.get("role") || "") as RoleStrings;
  const [Role, setRole] = useState(role);
  const [pageNumber, setPageNumber] = useState(0);
  const [count, setCount] = useState(0);
  const [filteringByPatch, setFilteringByPatch] = useState(false);
  const [proFilter, setProFilter] = useState(false);
  const nameParam = params["name"] ? heroSwitcher(params["name"]) : "";
  const heroColor = useHeroColor(type, nameParam);
  const updateStarter = () => {
    setShowStarter((prev) => !prev);
  };

  document.title = heroSwitcher(nameParam);
  const {
    filteredMatchData,
    totalMatches,
    patch: patch_obj,
    itemData,
    totalPicks,
    shortBuilds,
  } = useFetchAllData(type);
  useEffect(() => {
    if (filteredMatchData) {
      setFilteredData(
        params["patch"]
          ? filteredMatchData.filter((match) => match.patch === params["patch"])
          : filteredMatchData
      );
    }
    if (totalMatches) {
      setTotalMatchData(
        params["patch"]
          ? totalMatches.filter((match) => match.patch === params["patch"])
          : totalMatches
      );
      setCount(totalMatches.length);
    }
  }, [filteredMatchData, totalMatches, params]);

  const scrollGameIntoView = (idx: number) => {
    let pageIdx = Math.ceil(idx / 10) - 1;
    pageIdx = pageIdx >= 0 ? pageIdx : 0;
    setPageNumber(pageIdx);
    const elPageIdx = idx - 10 * pageIdx;
    const tbodys = document.querySelectorAll("tbody");
    const element = tbodys[1].children[elPageIdx];
    element.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (Role) {
      const data = totalMatchData.filter(
        (match, index) =>
          match.role === Role &&
          totalMatchData.findIndex((m) => m.id === match.id) === index
      );
      setFilteredData(data);
      setCount(data.length);
    } else {
      setFilteredData(totalMatchData);
      setCount(totalMatchData.length);
    }
  }, [totalMatchData, Role]);

  const heroData = useHeroData(type, totalMatchData, nameParam);
  type SearchResultKeyType =
    | "items"
    | "item_neutral"
    | "starting_items"
    | "name"
    | "role"
    | "hero"
    | "abilities"
    | "variant";

  const updateSearchResults = (
    searchObj?: TableSearchResults | string | number,
    searchResKey?: string,
    matchKey?: SearchResultKeyType,
    resultKey?: string,
    hero?: string
  ) => {
    let obj: TableSearchResults = {};
    if (!searchObj && !searchResKey) {
      setFilteredData(totalMatchData);
      setSearchResults(undefined);
      return;
    }
    let newFilteredData: DotaMatch[] = [];
    if (
      matchKey === "variant" &&
      searchResKey &&
      resultKey &&
      typeof searchObj === "number"
    ) {
      console.log(matchKey, searchObj, searchResKey);
      newFilteredData = totalMatchData.filter((x) => {
        if (hero) {
          return x[matchKey] === searchObj && x.hero === hero;
        } else {
          return x[matchKey] === searchObj;
        }
      });
      obj = {
        [searchResKey]: {
          [searchObj]: {
            index: 0,
            matches: newFilteredData,
            displayKey: resultKey,
          },
        },
      };
    }
    if (typeof searchObj === "string" && matchKey && searchResKey) {
      if (["name", "role", "hero", "item_neutral"].includes(matchKey)) {
        newFilteredData = totalMatchData.filter(
          (x) => x[matchKey] === searchObj
        );
        console.log(searchObj, newFilteredData, {
          [matchKey]: {
            [searchObj]: {
              index: 0,
              matches: newFilteredData,
            },
          },
        });
        obj = {
          [searchResKey]: {
            [searchObj]: {
              index: 0,
              matches: newFilteredData,
            },
          },
        };
      } else if (matchKey === "items" || matchKey === "abilities") {
        newFilteredData = totalMatchData.filter(
          (x) =>
            x[matchKey] &&
            x[matchKey].map((item) => item["key"]).includes(searchObj)
        );
        obj = {
          [searchResKey]: {
            [searchObj]: {
              index: 0,
              matches: newFilteredData,
            },
          },
        };
      }
    } else if (typeof searchObj === "object" && !matchKey) {
      newFilteredData = totalMatchData.filter((x) =>
        combineMatches(searchObj).flat().includes(x.id)
      );
      obj = searchObj;
      setSearchResults(obj);
      setFilteredData(newFilteredData);
      setCount(newFilteredData.length);
      return;
    }
    const filtered = newFilteredData.filter((match) =>
      proFilter ? match.pro : true
    );
    obj[searchResKey!][searchObj as number | string].matches = filtered;
    setSearchResults(obj);
    setFilteredData(filtered);
    setCount(filtered.length);
  };
  // useEffect(() => {
  //     if (searchRes) updateSearchResults(searchRes)
  // }, [searchRes]);
  const updateMatchData = (
    data: DotaMatch[],
    searchValue?: TableSearchResults
  ) => {
    // setMatchData(data)
    if (!data.length) return;
    setFilteredData(data);
    // updateFilteredData(data)
    setCount(data.length);
    if (searchValue) {
      setSearchResults(searchValue);
    } else {
      setSearchResults(undefined);
    }
  };
  const updateRole = (role: RoleStrings) => {
    setRole(role);
    if (role) {
      setFilteredData([...filteredData].filter((x) => x.role === role));
    }
  };
  useEffect(() => {
    if (!totalMatches) return;
    if (filteringByPatch) {
      const patchFilteredData = filteredData.filter((match) => {
        return match["patch"] === patch_obj["patch"];
      });
      setTotalMatchData(patchFilteredData);
      setFilteredData(patchFilteredData);
      setCount(totalMatchData.length);
    } else {
      setTotalMatchData(totalMatches);
      setFilteredData(totalMatches);
      setCount(totalMatches.length);
    }
  }, [filteringByPatch]);
  const commonProps = {
    heroData: heroData,
    nameParam: nameParam,
    totalMatchData: totalMatchData,
    filteredData: filteredData,
    itemData: itemData,
    role: Role,
    updateMatchData: updateMatchData,
    type: type,
    heroList: heroList,
    playerList: playerList,
    shortBuilds: shortBuilds,
  };
  const renderHeroPageTopSection = () => {
    if (type === "hero") {
      return (
        <HeroPageTopSection
          {...commonProps}
          updatePageNumber={scrollGameIntoView}
          updateRole={updateRole}
          totalPicks={totalPicks}
        />
      );
    }
    return null;
  };
  const renderFilterByPatch = () => {
    if (!totalMatches) return null;
    const oldPatchGameList = totalMatches.filter(
      (match) =>
        patch_obj["patch_timestamp"] > 0 && match.patch !== patch_obj["patch"]
    );
    return (
      !!oldPatchGameList.length &&
      oldPatchGameList.length !== totalMatchData.length && (
        <Typography variant="h5" color="white" align="center">
          {!params["patch"] ? (
            <Link
              onClick={() => setFilteringByPatch(true)}
              to={`/${patch_obj["patch"]}/hero/${heroSwitcher(nameParam)}`}
            >
              Filter Matches By {patch_obj["patch"]}
            </Link>
          ) : (
            <Link
              onClick={() => setFilteringByPatch(false)}
              to={`/hero/${heroSwitcher(nameParam)}`}
            >
              Show All Games
            </Link>
          )}
        </Typography>
      )
    );
  };

  useEffect(() => {
    if (proFilter) {
      const proFilteredData = filteredData.filter((match) => match.pro);
      setFilteredData(proFilteredData);
      setCount(proFilteredData.length);
    } else {
      setFilteredData(totalMatchData);
      setCount(totalMatchData.length);
    }
  }, [proFilter]);
  const renderPageContent = () => {
    if (!exists(heroColor)) return null;
    const contextValues = {
      filteredData,
      totalMatchData,
      searchRes: searchResults,
      updateSearchResults,
      nameParam,
      itemData,
      heroData,
      heroList,
      playerList,
      proFilter,
      setProFilter,
    };
    return (
      <PageContextProvider value={contextValues}>
        <div className="stat-page">
          <Nav playerList={playerList} heroList={heroList} />
          {renderFilterByPatch()}
          {renderHeroPageTopSection()}
          <div style={{ width: "100%", minHeight: "53px" }}>
            {totalPicks && (
              <PickCounter
                {...commonProps}
                heroColor={heroColor}
                matchData={totalMatchData}
                count={count}
                totalPicks={totalPicks}
                updateRole={updateRole}
              />
            )}
          </div>
          <div className="flex">
            <StarterToggle updateStarter={updateStarter} />
            {filteredData && (
              <>
                <Button
                  variant="contained"
                  onClick={() => setProFilter((prev) => !prev)}
                  sx={{
                    padding: "4px 8px 4px 8px",
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "5px",
                    border: " solid 2px black",
                    margin: "0",
                    marginRight: "auto",
                  }}
                >
                  <Typography>
                    {!proFilter ? "pro games" : "all games"}
                  </Typography>
                </Button>
                <TableSearch
                  {...commonProps}
                  disabled={filteredData.length === 0 || !itemData || !heroList}
                  heroName={nameParam}
                  itemData={itemData}
                />
              </>
            )}
          </div>
          <CustomTable
            {...commonProps}
            count={count}
            pageNumber={pageNumber}
            heroList={heroList}
            playerList={playerList}
            showStarter={showStarter}
          />
        </div>
      </PageContextProvider>
    );
  };

  return <div className="page">{renderPageContent()}</div>;
};

export default Page;

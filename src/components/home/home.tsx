import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Nav from "../nav/nav";
import { baseApiUrl } from "../../App";
import { theme } from "../../main";
import { cleanDecimal } from "../../utils/cleanDecimal";
import GridContainer from "./heroGrid/gridContainer";
import HeroCard from "./heroGrid/heroCard";
import Hero from "../types/heroList";
import PickStats, { Trend } from "../types/pickStats";
import { SortTitle } from "./sortTitle";
import { SideBar } from "./sideBar/sideBar";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { bulkRequest, fetchData } from "../../utils/fetchData";
// import { PickStats } from './types/pickStats.types';

type HomeProps = {
  heroList: Hero[];
  playerList: string[];
  patch: { patch: string; patch_timestamp: number };
};
export type RoleStrings =
  | ""
  | "Hard Support"
  | "Support"
  | "Roaming"
  | "Offlane"
  | "Midlane"
  | "Safelane";

function Home({ heroList, playerList, patch }: HomeProps) {
  const [winStats, setWinStats] = useState<PickStats[]>();
  const [filteredHeroes, setFilteredHeroes] = useState<string[]>();
  const [filteredByButton, setfilteredByButton] = useState<string[]>();
  const [roleFilter, setRoleFilter] = useState<RoleStrings>("");
  const [searching, setSearching] = useState(false);
  const [highlight, setHighlight] = useState<number>();
  const [searchVal, setSearchVal] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const paramPatch = useParams()["patch"];

  useEffect(() => {
    document.title = "Dota2 Item Tracker";
    const async_get = async () => {
      if (!heroList.length) return;
      const version = localStorage.getItem("winStatsVersion");
      let url = `${baseApiUrl}files/win-stats?version=${version}&time=${Date.now()}`;
      const jsdon = await fetchData(url);
      if (
        version !== null &&
        version !== undefined &&
        version === jsdon["version"]
      ) {
        url = `${baseApiUrl}files/win-stats?version=${version}`;
      }
      const data = await bulkRequest(url, heroList.length + 1, 0);
      const m = data.map((x) => x["win_stats"]);
      const json = { win_stats: m.flat(), version: jsdon["version"] };
      const pickStats = json["win_stats"]
        .filter((doc) => (paramPatch ? doc.patch === paramPatch : doc))
        .sort((a, b) => a.hero.localeCompare(b.hero));
      localStorage.setItem("winStatsVersion", String(json["version"]));
      setWinStats(pickStats);
    };
    async_get();
  }, [heroList, paramPatch]);

  useEffect(() => {
    if (!heroList.length) {
      return;
    }
    const m = heroList.map((hero: Hero) => hero.name.replace(/\s/g, "_"));
    const hList = m.sort((a, b) => a.localeCompare(b));
    setFilteredHeroes(hList);
  }, [heroList]);
  const filterHeroes = (list: string[]) => {
    const newList = list.map((x) => x.replace(/\s/g, "_"));
    setFilteredHeroes(newList);
    if (!filteredByButton && newList.length !== heroList.length) {
      setSearching(true);
    } else if (!filteredByButton) {
      const hList = newList.sort((a, b) => a.localeCompare(b));
      setFilteredHeroes(hList);
      setSearching(false);
    } else if (filteredByButton.length === list.length) {
      setSearching(false);
    } else if (filteredByButton && filteredByButton.length !== list.length) {
      setSearching(true);
    }
  };
  const sortHeroes = (list: string[], search: string, role?: RoleStrings) => {
    setFilteredHeroes(list);
    setfilteredByButton(list);
    setSearchVal(search);
    setRoleFilter("");
    if (role) {
      setRoleFilter(role);
    }
  };
  let className: "" | "right" = "";
  let width = "1800px";
  if (searching) {
    className = "right";
    width = "1000px";
  }
  const highlightHero = (idx: number) => {
    setHighlight(idx);
  };
  document.body.style.background = theme.palette.background.default;
  theme.palette.primary.main = "#1d5455";
  theme.palette.secondary.main = "#486869";

  const calcTrends = (heroName: string, role?: RoleStrings) => {
    if (!winStats) return;

    const heroPickData = winStats.filter(
      (x) => x.hero === heroName.replaceAll(/\s/g, "_"),
    );
    const currentTrend = heroPickData[0]["trends"][0];
    let viableTrends = heroPickData[0]["trends"];
    if (paramPatch) {
      viableTrends = viableTrends.filter((x) => x.patch === currentTrend.patch);
    }
    const lastTrend = heroPickData[0]["trends"][viableTrends.length - 1];
    const { bans, winrate, picks, wins } = formatTrend(currentTrend, role);
    const lastTrendStats = formatTrend(lastTrend, role);
    const newBans = bans - lastTrendStats.bans;
    const newWins = wins - lastTrendStats.wins;
    const newWinrate = +cleanDecimal(
      winrate - Math.abs(winrate - lastTrendStats.winrate),
    );
    const newPicks = picks - lastTrendStats.picks;
    // console.log(newPicks)
    return {
      picks: newPicks,
      wins: newWins,
      bans: newBans,
      winrate: newWinrate,
    };

    function formatTrend(currentTrend: Trend, role?: RoleStrings) {
      let picks = 0;
      let wins = 0;
      if (role && currentTrend[role]) {
        picks = currentTrend[role].picks || 0;
        wins = currentTrend[role].wins || 0;
      } else {
        picks = currentTrend.picks || 0;
        wins = currentTrend.wins || 0;
      }
      const currentBans = currentTrend["bans"] || 0;
      const currentWinrate = picks ? +cleanDecimal((wins / picks) * 100) : 0;
      return {
        bans: currentBans,
        winrate: currentWinrate,
        picks: picks,
        wins: wins,
      };
    }
  };
  const sortByTrend = (role: RoleStrings | undefined) => {
    if (!winStats) return null;
    const sorted = winStats
      .slice()
      .sort((a, b) => {
        const patchStr = paramPatch ? "patch_" : "";
        const aObj =
          role && a[role] ? a[role][`${patchStr}picks`] : a[`${patchStr}picks`];
        const bObj =
          role && b[role] ? b[role][`${patchStr}picks`] : b[`${patchStr}picks`];
        const trends =
          a.bans <= 3000
            ? calcTrends(a.hero, role)!["picks"] + aObj || 0
            : aObj;
        const otherTrends =
          b.bans <= 3000
            ? calcTrends(b.hero, role)!["picks"] + bObj || 0
            : bObj;
        return otherTrends - trends;
      })
      .filter((x) => {
        if (role) {
          return x[role] && x[role]["picks"] > 10;
        } else {
          return x["picks"] > 10;
        }
      });
    sortHeroes(
      sorted.map((x) => x.hero),
      "trends",
      role,
    );
  };
  const nonPatchGames = () => {
    return winStats?.find(
      (doc) =>
        doc["trends"][doc["trends"].length - 1]["patch"] != patch["patch"],
    );
  };
  return (
    <div className="home">
      <Nav
        filterHeroes={filterHeroes}
        filteredByButton={filteredByButton}
        heroList={heroList}
        playerList={playerList}
        highlightHero={highlightHero}
      />
      {(() => {
        if (!nonPatchGames()) return null;
        if (paramPatch) {
          return (
            <Typography variant="h4" color="white" align="center">
              <Link to={`/`}>Show All Games</Link>
            </Typography>
          );
        } else {
          return (
            <Typography variant="h4" color="white" align="center">
              <Link to={`/${patch["patch"]}`}>
                Filter By Patch {patch["patch"]}
              </Link>
            </Typography>
          );
        }
      })()}
      {/* total games */}
      {winStats && (
        <Typography
          color={"darkgrey"}
          marginRight={15}
          textAlign={"right"}
          className="test"
        >
          Total Games:
          {winStats.reduce((acc, curr) => acc + curr.picks, 0)}
        </Typography>
      )}
      {winStats && (
        <Button className="side-bar" onMouseLeave={() => setDrawerOpen(false)}>
          <SideBar
            open={drawerOpen}
            winStats={winStats}
            sortHeroes={sortHeroes}
            sortByTrend={sortByTrend}
          />
        </Button>
      )}
      {searchVal && !searching && (
        <SortTitle role={roleFilter} sort={searchVal} />
      )}
      <GridContainer className={className} width={width}>
        {filteredHeroes?.map((heroName: string) => {
          const displayName = heroName === "anti_mage" ? "anti-mage" : heroName;
          const stats = winStats?.find(
            (x) => x.hero === displayName.replaceAll(/\s/g, "_"),
          );
          let picks = 0,
            wins = 0,
            bans = 0,
            winrate = 0,
            trend = 0;
          if (stats) {
            if (roleFilter && stats[roleFilter]) {
              picks = stats[roleFilter]["picks"] || 0;
              wins = stats[roleFilter]["wins"] || 0;
              if (paramPatch) {
                picks = stats[roleFilter]["patch_picks"] || picks;
                wins = stats[roleFilter]["patch_wins"] || wins;
              }
            } else {
              picks = paramPatch
                ? stats["patch_picks"] || 0
                : stats["picks"] || 0;
              wins = paramPatch ? stats["patch_wins"] || 0 : stats["wins"] || 0;
            }
            bans = stats["bans"] || 0;
            winrate = picks ? +cleanDecimal((wins / picks) * 100) : 0;
            trend = calcTrends(displayName, roleFilter)?.["picks"] || 0;
          }
          const pickStatsObj = {
            picks,
            trend,
            wins,
            bans,
            winrate,
          };
          return (
            <Grid
              key={displayName}
              className={`grid-item-${className}`}
              item
              sx={{ paddingTop: "10px !important" }}
            >
              <HeroCard
                highlight={highlight}
                idx={filteredHeroes.indexOf(heroName)}
                searching={searching}
                sortByTrend={sortByTrend}
                heroName={displayName}
                stats={pickStatsObj}
                role={roleFilter}
              />
            </Grid>
          );
        })}
      </GridContainer>
    </div>
  );
}

export default Home;

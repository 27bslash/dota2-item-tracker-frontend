import { Grid } from "@mui/material";
import ArrowButton from "../ui_elements/arrowButton";
import { theme } from "../../main";
import { PickStats } from "./types/pickStats.types";
import { RoleStrings } from "./home";

// import { RoleStrings } from "./home";

type PanelProps = {
  sortHeroes: (list: string[], search: string, role?: RoleStrings) => void;
  winStats: PickStats[];
};
const ControlPanel = ({ sortHeroes, winStats }: PanelProps) => {
  return (
    <ArrowButton
      transition="fade"
      style={{
        transform: "rotate(-90deg)",
        position: "absolute",
        top: "17%",
        left: "-20px",
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <div className="control-panel">
        <Grid
          container
          spacing={0}
          sx={{
            marginLeft: "10px",
            backgroundColor: "rgb(58, 61, 61)",
            width: "270px",
            zIndex: 5,
            position: "absolute",
            left: "23px",
            top: "88px",
          }}
        >
          <RoleSelector
            sortHeroes={sortHeroes}
            winStats={winStats}
          ></RoleSelector>
          <Grid item>
            <div
              className="flex"
              style={{ width: "100%", borderTop: "2px solid black" }}
            >
              <button
                onClick={() =>
                  sortHeroes(roleSort(winStats, `picks`, "total"), "picks")
                }
                className="sort-button"
              >
                PICKS
              </button>
              <button
                onClick={() =>
                  sortHeroes(roleSort(winStats, `winrate`, "total"), "winrate")
                }
                className="sort-button"
              >
                winrate
              </button>
              <button
                onClick={() =>
                  sortHeroes(roleSort(winStats, `bans`, "total"), "bans")
                }
                className="sort-button"
              >
                bans
              </button>
            </div>
          </Grid>
        </Grid>
      </div>
    </ArrowButton>
  );
};
const roleSort = (
  stats: PickStats[],
  field: keyof PickStats | string,
  type?: "total" | "picks"
): string[] => {
  const filtered = stats.filter((item) => {
    if (type === "total") {
      const value = item[field as keyof PickStats];
      return typeof value === "number" && value > 10;
    } else {
      const picksKey = `${field}_picks` as keyof PickStats;
      const picks = item[picksKey];
      return typeof picks === "number" && picks > 10;
    }
  });

  const sorted = [...filtered].sort((a, b) => {
    if (type === "total") {
      const aVal = Number(a[field as keyof PickStats]) || 0;
      const bVal = Number(b[field as keyof PickStats]) || 0;
      return bVal - aVal;
    }

    const picksKey = `${field}_picks` as keyof PickStats;
    const winsKey = `${field}_wins` as keyof PickStats;

    const aPicks = Number(a[picksKey]) || 0;
    const bPicks = Number(b[picksKey]) || 0;
    const aWins = Number(a[winsKey]) || 0;
    const bWins = Number(b[winsKey]) || 0;

    if (field !== "winrate") {
      return bPicks - aPicks;
    } else {
      const winrateA = aPicks ? (aWins / aPicks) * 100 : 0;
      const winrateB = bPicks ? (bWins / bPicks) * 100 : 0;
      return winrateB - winrateA;
    }
  });

  return sorted.map((x) => x.hero);
};
type RoleSelectorProps = {
  sortHeroes: PanelProps["sortHeroes"];
  winStats: PickStats[];
};
const RoleSelector = ({ sortHeroes, winStats }: RoleSelectorProps) => {
  const r2: RoleStrings[] = [
    "Safelane",
    "Midlane",
    "Offlane",
    "Roaming",
    "Support",
    "Hard Support",
  ];
  return (
    <>
      {r2.map((x, i) => {
        return (
          <Grid
            key={i}
            item
            padding={0}
            sx={{ paddingLeft: "0px", paddingTop: "0px" }}
          >
            <button
              className="sort-button"
              onClick={() =>
                sortHeroes(roleSort(winStats, `${x}`, "picks"), "picks", x)
              }
            >
              {x}
            </button>
          </Grid>
        );
      })}
    </>
  );
};
export default ControlPanel;

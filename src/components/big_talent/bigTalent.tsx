import { FC, useState, useEffect } from "react";
import BigTalentTooltip from "./bigTalentTooltip";
import { MatchDataAdj } from "../stat_page/page";
import { usePageContext } from "../stat_page/pageContext";
import { HeroStats } from "../types/heroData";
import DotaMatch from "../types/matchData";

interface BigTalentProps extends MatchDataAdj {
  width: string;
  margin: string;
}
const BigTalent: FC<BigTalentProps> = (props) => {
  const [talents, setTalents] = useState<
    [
      string,
      {
        count: number;
        slot: number;
        total_picks: number;
        level: number;
        key: string;
      }
    ][]
  >([]);
  const [open, setOpen] = useState(false);
  const { filteredData, totalMatchData, heroData, nameParam } =
    usePageContext();
  useEffect(() => {
    const heroTalentData = heroData[nameParam];
    if (!heroTalentData) return;
    const sorted = countTalents(heroTalentData, filteredData);
    setTalents(sorted);
  }, [filteredData, totalMatchData, heroData, nameParam]);

  return (
    <div
      className="talent-wrapper"
      style={{ height: "100%" }}
      onMouseLeave={() => setOpen(false)}
    >
      {talents && filteredData && (
        <BigTalentTooltip
          talents={talents}
          updateMatchData={props.updateMatchData}
          filteredData={filteredData}
          open={open}
        >
          <div
            className="talents"
            style={{
              width: props.width,
              height: props.width,
              margin: props.margin,
            }}
            onMouseEnter={() => setOpen(true)}
          >
            {[...talents].reverse().map((x, i: number) => {
              const v = x[1];
              const side = v["slot"] % 2 === 0 ? "l-talent" : "r-talent";
              if (v["count"] * 2 >= v["total_picks"] && v["count"]) {
                return (
                  <div
                    key={i}
                    className={"lvl" + v["level"] + " " + side}
                  ></div>
                );
              }
            })}
          </div>
        </BigTalentTooltip>
      )}
    </div>
  );
};
const countTalents = (heroData: HeroStats, matchData: DotaMatch[]) => {
  const talentCount: {
    [key: string]: {
      count: number;
      slot: number;
      total_picks: number;
      level: number;
      key: string;
    };
  } = {};
  // initialise object
  for (const k in heroData["talents"]) {
    const talent = heroData["talents"][k];
    let lvl = 0;
    if (talent["slot"] === 0 || talent["slot"] === 1) {
      lvl = 10;
    } else if (talent["slot"] === 2 || talent["slot"] === 3) {
      lvl = 15;
    } else if (talent["slot"] === 4 || talent["slot"] === 5) {
      lvl = 20;
    } else if (talent["slot"] === 6 || talent["slot"] === 7) {
      lvl = 25;
    }
    talentCount[String(talent["id"])] = {
      count: 0,
      slot: talent["slot"]!,
      total_picks: 0,
      level: lvl,
      key: talent["name_loc"],
    };
  }
  for (const match of matchData) {
    for (const ability of match["abilities"]) {
      if (ability["type"] === "talent") {
        try {
          const k = ability["id"];
          const count = talentCount[k]["count"];
          talentCount[k]["count"] = count + 1;
        } catch {
          console.log("pass");
        }
      }
    }
  }
  for (const k in talentCount) {
    const slot = talentCount[k]["slot"];
    if (talentCount[k]["slot"] % 2 === 0) {
      const found = Object.keys(talentCount).find((key) => {
        return talentCount[key]["slot"] === slot + 1;
      });
      if (found) {
        const totalPicks =
          talentCount[k]["count"] + talentCount[found]["count"];
        talentCount[found]["total_picks"] = totalPicks;
        talentCount[k]["total_picks"] = totalPicks;
      }
    }
  }
  const sorted = Object.entries(talentCount).sort(
    (a, b) => a[1].slot - b[1].slot
  );
  return sorted;
};
export default BigTalent;

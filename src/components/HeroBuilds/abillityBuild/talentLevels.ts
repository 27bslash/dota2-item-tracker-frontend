import DotaMatch from "../../types/matchData";
import { Talent } from "../builds/buildCell";

export const mostUsedTalents = (MatchData: DotaMatch[]) => {
  const talents: [string, number, number, number][] = [];
  for (const match of MatchData) {
    for (const ability of match["abilities"]) {
      if (ability["type"] === "talent") {
        if (ability["level"] > 30) {
          ability["level"] = 25;
        }
        talents.push([
          ability["img"],
          ability["level"],
          ability["slot"]!,
          +ability["id"],
        ]);
      }
    }
  }

  const talentLevelsTable = talentLevels(talents);
  const count: { [key: string]: Talent } = {};
  for (const talent of talents) {
    const level = lookupTalentLevel(talentLevelsTable, talent[0])!;
    if (talent[0] in count) {
      count[talent[0]] = {
        level: level,
        count: count[talent[0]]["count"] + 1,
        slot: talent[2],
        id: "" + talent[3],
        perc: 0,
      };
    } else {
      count[talent[0]] = {
        level: level,
        count: 1,
        slot: talent[2],
        id: "" + talent[3],
        perc: 0,
      };
    }
  }

  const srt = Object.entries(count).sort((a, b) => a[1]["slot"] - b[1]["slot"]);
  return filterTalents(srt);
};
const talentLevels = (talents: [string, number, number, number][]) => {
  const ret: { talent: string; level: number }[] = [];
  const checkedTalents: Set<string> = new Set();
  for (const talent of talents) {
    const talentName: string = talent[0];
    const sameTalents: [string, number, number, number][] = [];
    if (checkedTalents.has(talentName)) {
      continue;
    }
    for (const other of talents) {
      if (other[0] === talentName) {
        sameTalents.push(other);
        checkedTalents.add(talentName);
      }
    }
    const isolatedLevels: number[] = sameTalents.map((tal) => tal[1]);
    const mostCommonLevel = findMode(isolatedLevels);

    ret.push({ talent: talentName, level: mostCommonLevel });
  }
  return ret;
};
const findMode = (arr: number[]): number => {
  const frequency: { [key: string]: number } = {};
  let maxFrequency = 0;
  let mode;

  arr.forEach((item) => {
    frequency[item] = (frequency[item] || 0) + 1;
    if (frequency[item] > maxFrequency) {
      maxFrequency = frequency[item];
      mode = item;
    }
  });

  return mode!;
};

const lookupTalentLevel = (
  talents: { talent: string; level: number }[],
  talentName: string
): number | undefined => {
  for (const talentDict of talents) {
    if (talentDict.talent === talentName) {
      return talentDict.level;
    }
  }
};
const filterTalents = (data: [string, Talent][]) => {
  const ret: [string, Talent][] = [];
  for (let i = 0; i < 7; i += 2) {
    let pair;
    const total_count = data
      .filter((x) => x[1]["slot"] === i || x[1]["slot"] === i + 1)
      .reduce((acc, curr) => acc + curr[1]["count"], 0);

    for (const x of data) {
      if (x[1]["slot"] === i || x[1]["slot"] === i + 1) {
        const perc = (x[1]["count"] / total_count) * 100;
        x[1]["perc"] = Math.round(perc * 100) / 100;
        if (perc >= 50) {
          pair = x;
        }
      }
    }
    if (pair) {
      ret.push(pair);
    }
  }
  const sortedTalents = ret.sort((a, b) => a[1]["level"] - b[1]["level"]);
  return sortedTalents;
};

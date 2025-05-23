import DotaMatch from "../../types/matchData";
import { UnparsedBuilds } from "../buildHooks/shortBuildHook";
import { AbilityBuildEntry } from "../builds/buildCell";

const abilityFilter = (
  data?: DotaMatch[],
  shortBuild?: UnparsedBuilds
): false | [AbilityBuildEntry[]] => {
  const aCount = shortBuild
    ? shortBuild["abilities"]["a_count"]
    : groupAbilities(data!)["aCount"];

  // {'antimage_mana_break': {'count': 103, 'level': [...]}, 'antimage_blink': {'count': 103, 'level': [...]}, 'antimage_counterspell': {'count': 98, 'level': [...]}, 'antimage_mana_void': {'count': 100, 'level': [...]}}
  if (!aCount) {
    return false;
  }
  // const abilityBuilds = genAbilityArr(res, ab, totalCount, max_abilities)
  const mostCommonBuilds = genMostCommonBuilds(aCount);
  return [mostCommonBuilds];
};
export default abilityFilter;
export const testForSimilarBuilds = (
  abilityBuild: string,
  targetAbilityBuild: string,
  threshold: number
) => {
  const split = abilityBuild.split("__");
  const mostPickedSplit = targetAbilityBuild.split("__");
  let difference = 0;
  let lastSwap = 0;
  // console.log(split, mostPickedSplit)
  if (split[0] !== mostPickedSplit[0]) difference = 1;
  for (const [i, ability] of split.entries()) {
    const sl = split.slice(7, 9).sort().join();
    const sl2 = mostPickedSplit.slice(7, 9).sort().join();
    if (lastSwap + 2 === i) lastSwap = 0;
    if (threshold > 3 && ability !== mostPickedSplit[i]) {
      difference++;
      continue;
    }
    if (sl === sl2) {
      // console.log('last equal')
      // continue
    }
    if (
      split[i] === mostPickedSplit[i + 1] &&
      split[i + 1] === mostPickedSplit[i] &&
      lastSwap === 0
    ) {
      // console.log('swapsises')
      lastSwap = i;
      difference -= 1;
      continue;
    }
    if (
      split[6] === mostPickedSplit[6] &&
      split[2] === mostPickedSplit[2] &&
      sl === sl2
    ) {
      // console.log('max ability')
      break;
    }
    if (ability !== mostPickedSplit[i]) {
      difference++;
      // console.log(ability, difference)
    }
  }
  return difference < threshold;
};

export const genMostCommonBuilds = (aCount: { [key: string]: number }) => {
  const srt = Object.entries(aCount).sort((a, b) => b[1] - a[1]);
  // console.log([...srt])
  const sorted = groupSimilarBuilds(srt);
  let mostPickedBuild: AbilityBuildEntry;
  const DEBUG = process.env.NODE_ENV !== "production";
  const abilityThreshold = DEBUG ? 1 : 35;
  const mostCommonBuilds = sorted
    .sort((a, b) => b[1] - a[1])
    .filter((build, i) => {
      if (i === 0) mostPickedBuild = build;
      const buildPerc = (build[1] / mostPickedBuild[1]) * 100;
      if (buildPerc > abilityThreshold) {
        return true;
      }
    });

  return mostCommonBuilds;
};

const jackSort = (abilityString: string, testAbilityString: string) => {
  // assign ability to number
  const testAbilityArr = testAbilityString.split("__").slice(0, 8);
  const abilityArr = abilityString.split("__").slice(0, 8);
  const abilitySet = new Set<string>();
  const abilityValues: string[] = [];
  for (const ability of testAbilityArr) {
    if (!abilitySet.has(ability)) {
      abilitySet.add(ability);
      abilityValues.push(ability);
    }
  }
  const sumval = (testAbilityArr: string[]) => {
    let total = 0;
    for (const ability of testAbilityArr) {
      const valueIndex = abilityValues.findIndex((ab) => ab === ability);
      const convertedVal = Math.pow(10, valueIndex);
      total += convertedVal;
    }
    return total;
  };
  // get sum of ability numbers
  const testTotal = String(sumval(testAbilityArr));
  const total = String(sumval(abilityArr));
  // calculate difference between totals
  let difference = 0;
  for (const [i, digit] of testTotal.split("").entries()) {
    if (digit !== total[i]) {
      difference += Math.abs(+digit - +total[i]);
    }
  }
  if (difference < 1 && abilityString !== testAbilityString) {
    // console.log(total, abilityArr, testTotal, testAbilityArr)
    return true;
  }
};

export const groupSimilarBuilds = (srt: AbilityBuildEntry[]) => {
  for (const b of srt) {
    for (const [i, testBuild] of srt.entries()) {
      if (b[0] === testBuild[0]) {
        continue;
      }
      if (b[1] < testBuild[1]) continue;
      if (
        testForSimilarBuilds(b[0], testBuild[0], 1) &&
        jackSort(b[0], testBuild[0])
      ) {
        b[1] += testBuild[1];
        if (b[2]) {
          b[2].push(testBuild);
        } else {
          b[2] = [testBuild];
        }
        srt.splice(i, 1);
      }
    }
  }
  return srt;
};

const groupAbilities = (data: DotaMatch[]) => {
  const abilities = [];
  const aCount: { [key: string]: number } = {};
  for (const match of data) {
    if ("abilities" in match && match["abilities"].length > 9) {
      const abilityArray = match["abilities"]
        .filter((ability) => ability.type !== "talent")
        .map((ability) => ability.img)
        .slice(0, 9);
      abilities.push(abilityArray);
      // console.log(match)
      const key = match["abilities"]
        .filter((ability) => ability.type !== "talent")
        .slice(0, 9)
        .map((ability) => ability.img)
        .join("__");
      aCount[key] = aCount[key] + 1 || 1;
    }
  }
  return { abilities, aCount };
};

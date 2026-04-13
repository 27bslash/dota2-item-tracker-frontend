import { AbilityBuildEntry, Talents } from "../builds/buildCell";
import { CoreItem } from "../itemBuild/itemGroups/groupBytime";
import { NeutralItemCounts } from "../itemBuild/neutralItems/mostUsedNeutrals";

export type HeroBuild = {
  item_builds: {
    [key: string]: CoreItem[];
  }[];
  ability_builds: AbilityBuildEntry[] | never[];
  starting_items: [string, number][];
  neutral_items: Record<
    string,
    {
      neutral_items: NeutralItemCounts[];
      enchants: NeutralItemCounts[];
    }
  >;
  talents: Talents;
  ultimate_ability: string | undefined;
  facet_builds: {
    key: number;
    count: number;
    perc: string;
    title: string;
  }[];
  length?: number;
};

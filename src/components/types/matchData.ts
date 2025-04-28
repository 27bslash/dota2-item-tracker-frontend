import { RoleStrings } from "../home/home";
import BenchmarksData from "./benchmarks";

export type HeroAbility = {
  id: string;
  img: string;
  key: string;
  level: number;
  type: string;
  slot?: number;
};
type ProTeam = {
    tag? : string;
    name: string;
    logo_url: string;
    team_id?: number;
}
type DotaMatch = {
  abilities: HeroAbility[];
  accountId: null | number;
  aghanims_shard: null | SimpleItems[];
  additional_units?: SimpleItems[];
  pro?: boolean;
  radiant_team?: ProTeam;
  dire_team?: ProTeam;
  assists: number;
  backpack: SimpleItems[];
  bans: string[];
  benchmarks: BenchmarksData;
  deaths: number;
  deaths_ten: number;
  dire_draft: string[];
  duration: number;
  final_items: SimpleItems[];
  gold: number;
  gold_adv: number;
  gpm: number;
  gpm_ten: number;
  hero: string;
  hero_damage: number;
  id: number;
  match_id: number;
  item_neutral: string;
  neutral_item_history?: {
    item_neutral: string;
    item_neutral_enhancement: string;
  }[];
  items: SimpleItems[];
  kills: number;
  kills_ten: number;
  lane_efficiency: number;
  last_hits: number;
  last_hits_ten: number;
  lvl: number;
  lvl_at_ten: number;
  mmr: number;
  name: string;
  parsed: boolean;
  patch: string;
  radiant_draft: string[];
  replay_url: string;
  role: RoleStrings;
  starting_items: SimpleItems[];
  tower_damage: number;
  unix_time: number;
  variant?: number;
  win: number;
  xpm: number;
  xpm_ten: number;
};
export type SimpleItems = {
  id: number;
  key: string;
  time: number | string;
};

export default DotaMatch;

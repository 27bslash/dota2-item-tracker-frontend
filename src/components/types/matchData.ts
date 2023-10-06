import Items from "./Item";
import BenchmarksData from "./benchmarks";

type Ability = {
    id: string;
    img: string;
    key: string;
    level: number;
    type: string;
};

type Match = {
    abilities: Ability[];
    account_id: null | number;
    aghanims_shard: null | boolean;
    assists: number;
    backpack: Items;
    bans: string[];
    benchmarks: BenchmarksData;
    deaths: number;
    deaths_ten: number;
    dire_draft: string[];
    duration: number;
    final_items: Items;
    gold: number;
    gold_adv: number;
    gpm: number;
    gpm_ten: number;
    hero: string;
    hero_damage: number;
    id: number;
    match_id?: number;
    item_neutral: string;
    items: Items; // Update this to the appropriate item type
    kills: number;
    kills_ten: number;
    lane_efficiency: number;
    last_hits: number;
    last_hits_ten: number;
    lvl: number;
    lvl_at_ten: number;
    mmr: string;
    name: string;
    parsed: boolean;
    patch: string,
    radiant_draft: string[];
    replay_url: string;
    role: string;
    starting_items: Items;
    tower_damage: number;
    unix_time: number;
    win: number;
    xpm: number;
    xpm_ten: number;
}

export default Match
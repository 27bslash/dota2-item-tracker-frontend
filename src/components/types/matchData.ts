import Items from "./Item";
import BenchmarksData from "./benchmarks";

export type HeroAbility = {
    id: string;
    img: string;
    key: string;
    level: number;
    type: string;
    slot?: number;
};

type DotaMatch = {
    abilities: HeroAbility[];
    accountId: null | number;
    aghanims_shard: null |  SimpleItems[];
    additional_units?: SimpleItems[],
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
    items: SimpleItems[];
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
    starting_items: SimpleItems[];
    tower_damage: number;
    unix_time: number;
    win: number;
    xpm: number;
    xpm_ten: number;
}
export type SimpleItems = {
    id: number;
    key: string;
    time: number | string;
}

export default DotaMatch
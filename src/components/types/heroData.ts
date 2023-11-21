export type HeroStats = {
    abilities: Record<string, HeroAbilities>
    agi_base: number;
    agi_gain: number;
    armor: number;
    attack_capability: number;
    attack_range: number;
    attack_rate: number;
    bio_loc: string;
    complexity: number;
    damage_max: number;
    damage_min: number;
    health_regen: number;
    hero: string;
    hype_loc: string;
    id: number;
    int_base: number;
    int_gain: number;
    magic_resistance: number;
    mana_regen: number;
    max_health: number;
    max_mana: number;
    movement_speed: number;
    name: string;
    name_loc: string;
    npe_desc_loc: string;
    order_id: number;
    primary_attr: number;
    projectile_speed: number;
    role_levels: number[];
    sight_range_day: number;
    sight_range_night: number;
    str_base: number;
    str_gain: number;
    talents: Record<string, HeroAbilities>
    turn_rate: number
}
export type HeroAbilities = {
    ability_has_scepter: boolean;
    ability_has_shard: boolean;
    ability_is_granted_by_scepter: boolean;
    ability_is_granted_by_shard: boolean;
    behavior: string;
    cast_points: number[];
    cast_ranges: number[];
    channel_times: number[];
    cooldowns: number[];
    damage: number;
    damages: number[];
    desc_loc: string;
    dispellable: number;
    durations: number[];
    flags: number;
    gold_costs: number[];
    health_costs: number[];
    id: number;
    immunity: number;
    is_item: boolean;
    item_cost: number;
    item_initial_charges: number;
    item_neutral_tier: number;
    item_quality: number;
    item_stock_max: number;
    item_stock_time: number;
    lore_loc: string;
    mana_costs: number[];
    max_level: number;
    name: string;
    name_loc: string;
    notes_loc: string[];
    scepter_loc: string;
    shard_loc: string;
    special_values: {
        bonuses: unknown[];
        heading_loc: string;
        is_percentage: boolean;
        name: string;
        values_float: number[];
        values_scepter: number[];
        values_shard: number[];
    }[];
}
export type PageHeroData = Record<string, HeroStats>

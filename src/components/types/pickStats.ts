export interface PickRoleStat {
    losses: number;
    picks: number;
    winrate: number;
    wins: number;
    patch_picks: number;
    patch_wins: number;
    patch_losses: number;
}

export interface Trend {
    "Hard Support"?: PickRoleStat;
    Midlane?: PickRoleStat;
    Offlane?: PickRoleStat;
    Roaming?: PickRoleStat;
    Safelane?: PickRoleStat;
    Support?: PickRoleStat;
    '': PickRoleStat
    bans: number;
    hero: string;
    patch: string;
    patch_picks: number;
    patch_wins: number;
    winrate: number;
    wins: number;
    picks: number;
}

interface PickStats {
    "Hard Support": PickRoleStat;
    Midlane: PickRoleStat;
    Offlane: PickRoleStat;
    Roaming: PickRoleStat;
    Safelane: PickRoleStat;
    Support: PickRoleStat;
    '': PickRoleStat
    bans: number;
    hero: string;
    patch: string;
    patch_picks: number;
    patch_wins: number;
    picks: number;
    trends: Trend[];
    winrate: number;
    wins: number;
}
export default PickStats
export interface PickRoleStat {
    losses: number;
    picks: number;
    winrate: number;
    wins: number;
}

export interface Trend {
    "Hard Support": PickRoleStat;
    Midlane: PickRoleStat;
    Offlane: PickRoleStat;
    Roaming: PickRoleStat;
    Safelane: PickRoleStat;
    Support: PickRoleStat;
    bans: number;
    hero: string;
    picks: number;
    winrate: number;
    wins: number;
}

interface PickStats {
    "Hard Support": PickRoleStat;
    Midlane: PickRoleStat;
    Offlane: PickRoleStat;
    Roaming: PickRoleStat;
    Safelane: PickRoleStat;
    Support: PickRoleStat;
    bans: number;
    hero: string;
    picks: number;
    trends: Trend[];
    winrate: number;
    wins: number;
}
export default PickStats
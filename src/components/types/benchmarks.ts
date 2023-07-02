type Benchmark = {
    pct: string;
    raw: string;
};

type BenchmarksData = {
    gold_per_min: Benchmark;
    hero_damage_per_min: Benchmark;
    hero_healing_per_min: Benchmark;
    kills_per_min: Benchmark;
    last_hits_per_min: Benchmark;
    lhten: Benchmark;
    stuns_per_min: Benchmark;
    tower_damage: Benchmark;
    xp_per_min: Benchmark;
};
export default BenchmarksData
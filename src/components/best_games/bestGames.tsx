/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useEffect } from 'react';
import blurred from '../../images/blurred-best-games.jpg'
import DotaMatch from '../types/matchData';
import BenchmarksData from '../types/benchmarks';
import { RoleStrings } from '../home/home';
import { usePageContext } from '../stat_page/pageContext';
import BestGamesTableHeader from './bestGamesTableHeader';
import BestGamesTableBody from './bestGamesBody';
import { cleanDecimal } from '../../utils/cleanDecimal';

export type BenchMarksKeys = keyof BenchmarksData
type BestGamesProps = {
    updateRole: (role: RoleStrings) => void;
    updatePageNumber: (idx: number) => void
}
// TODO
// best games relative to best stat of my data not opendota

const BestGames = ({ updateRole, updatePageNumber }: BestGamesProps) => {
    const [bestgames, setBestgames] = useState<DotaMatch[]>([])
    const [benchmarkKeys, setbenchmarkKeys] = useState<BenchMarksKeys[]>()
    const [loading, setLoading] = useState(true)
    const { totalMatchData, filteredData } = usePageContext()
    const [sortKey, setSortKey] = useState<BenchMarksKeys>()
    useEffect(() => {
        if (totalMatchData.length) {
            getBenchMarksFromData()
            if (sumBenchmarks()) {
                setLoading(false)
            }
        }
    }, [filteredData, totalMatchData, sortKey])
    const sortByKey = (header: BenchMarksKeys) => {
        setSortKey(header)
    }
    const getBenchMarksFromData = () => {
        const benchmarkKeyArr = ['gpm', 'xpm', 'kills', 'last_hits', 'hero_damage',
            'hero_healing_per_minute', 'tower_damage', 'stuns_per_minute', 'last_hits_ten'];
        const cleanVal = (match: DotaMatch, key: keyof DotaMatch | BenchMarksKeys) => {
            if (key in match) {
                return +cleanDecimal(match[key as keyof DotaMatch] as number) / (['gpm', 'xpm', 'tower_damage', 'last_hits_ten'].includes(key) ? 1 : Math.floor(match['duration'] / 60));
            } else if (match['benchmarks']) {
                const bKey = key as BenchMarksKeys
                console.log(match['benchmarks'], bKey, match['benchmarks'][bKey], match, match['benchmarks']['gold_per_min'])
                return match['benchmarks'][bKey] ? +cleanDecimal(+match['benchmarks'][bKey]['raw']) : 1
            }
            return 1
        }
        const calculateMaxValues = (key: string) => filteredData.reduce((max, match) => {
            const value = cleanVal(match, key as keyof DotaMatch)
            return Math.max(max, value);
        }, 0);

        const maxValues = benchmarkKeyArr.map(calculateMaxValues);
        const matchBenchmarkKeys = ['gold_per_min', 'xp_per_min', 'kills_per_min', 'last_hits_per_min',
            'hero_damage_per_min', 'hero_healing_per_min', 'tower_damage', 'stuns_per_min', 'lhten'];
        filteredData.forEach(match => {
            benchmarkKeyArr.forEach((k, i) => {
                const value = cleanVal(match, k as keyof DotaMatch)
                if (maxValues[i] !== 0) {
                    const pct = cleanDecimal((value / maxValues[i]) * 100);
                    match['benchmarks'] = { ...match['benchmarks'], [matchBenchmarkKeys[i]]: { 'pct': pct, 'raw': String(value) } };
                }
            });

        });
    }
    const sumBenchmarks = () => {
        const bmarks: [number, number][] = []
        for (const match of filteredData) {
            if (!match['benchmarks']) continue
            let sum = 0
            const benchmarks = match['benchmarks']
            sum = Object.values(benchmarks).reduce((a, b) => {
                const benchmarkPct = +b['pct'] || 0
                return a + benchmarkPct
            }, sum)
            bmarks.push([match['id'], sum])
        }
        let sorted: [number, number][]
        if (sortKey) {
            const s = filteredData.sort((a, b) => +b['benchmarks'][sortKey]['raw'] - +a['benchmarks'][sortKey]['raw']);
            // console.log(s);
            sorted = filteredData.map((match) => bmarks.find((m) => m[0] === match['id']) as [number, number])
        } else {
            sorted = bmarks.sort((a, b) => {
                return b[1] - a[1]
            })
        }
        const filtered = filteredData.filter((x) => sorted.slice(0, 2).map((x) => x[0]).includes(x['id']))
        setBestgames(filtered)

        const sortingArr = ['gold_per_min', 'xp_per_min',
            'kills_per_min', 'last_hits_per_min', 'hero_damage_per_min', 'hero_healing_per_min', 'tower_damage', 'stuns_per_min', 'lhten']
        if (filtered.length) {
            // sort benchmarks into correct order based on sortingArr
            const sortedBenchmarks = Object.keys(filtered[0]['benchmarks']).sort((a, b) => {
                return sortingArr.indexOf(a) - sortingArr.indexOf(b)
            }) as (BenchMarksKeys)[]
            setbenchmarkKeys(sortedBenchmarks)
            return true
        }
    }
    return (
        loading ? (
            <img src={blurred} alt='blurred benchmarks' />
        ) : (
            <>
                {benchmarkKeys &&
                    <div className="best-games" style={{ 'width': '1200px', 'maxHeight': '140px', height: 'fit-content' }}>
                        <table>
                            <BestGamesTableHeader benchmarkKeys={benchmarkKeys} sortByKey={sortByKey}></BestGamesTableHeader>
                            <BestGamesTableBody updateRole={updateRole} updatePageNumber={updatePageNumber}
                                benchmarkKeys={benchmarkKeys!} bestgames={bestgames}></BestGamesTableBody>
                        </table>
                    </div>
                }
            </>
        )
    )
}



export default BestGames
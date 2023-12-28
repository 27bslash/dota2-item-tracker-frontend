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
    useEffect(() => {
        if (totalMatchData.length) {
            if (sumBenchmarks()) {
                setLoading(false)
            }
        }
    }, [filteredData, totalMatchData])
    const sumBenchmarks = () => {
        const bmarks = []
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
        const sorted = bmarks.sort((a, b) => {
            return b[1] - a[1]
        }).slice(0, 2).map((x) => x[0])
        const filtered = filteredData.filter((x) => sorted.includes(x['id']))
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
                            <BestGamesTableHeader benchmarkKeys={benchmarkKeys}></BestGamesTableHeader>
                            <BestGamesTableBody updateRole={updateRole} updatePageNumber={updatePageNumber} benchmarkKeys={benchmarkKeys!} bestgames={bestgames}></BestGamesTableBody>
                        </table>
                    </div>
                }
            </>
        )
    )
}



export default BestGames
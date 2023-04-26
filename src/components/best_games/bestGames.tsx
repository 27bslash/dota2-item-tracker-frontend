import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useEffect } from 'react';
import stringSearch from '../table/table_search/string_search';
import blurred from '../../images/blurred-best-games.jpg'

interface BenchmarksProps {
    benchmarks: {},
    display_role: null
    hero: string,
    id: number,
    name: string,
    role: string
}


const BestGames = (props: any) => {
    const [bestgames, setBestgames] = useState<any>([])
    const [benchmarkKeys, setbenchmarkKeys] = useState<any>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!!props.totalMatchData.length) {
            sumBenchmarks()
            setLoading(false)
        }
    }, [props.matchData, props.totalMatchData])
    const sumBenchmarks = () => {
        const bmarks = []
        for (let match of props.matchData) {
            let sum: any = 0
            const benchmarks = match['benchmarks']
            sum = Object.values(benchmarks).reduce((a: any, b: any) => {
                b = +b['pct']
                return a + b
            }, sum)
            bmarks.push([match['id'], sum])
        }
        const sorted = bmarks.sort((a: any, b: any) => {
            return b[1] - a[1]
        }).slice(0, 2).map((x) => x[0])
        const filtered = props.matchData.filter((x: any) => sorted.includes(x['id']))
        setBestgames(filtered)

        const sortingArr = ['player', '', 'gold_per_min', 'xp_per_min',
            'kills_per_min', 'last_hits_per_min', 'hero_damage_per_min', 'hero_healing_per_min', 'tower_damage', 'stuns_per_min', 'lhten']
        if (filtered.length) {
            const sortedBenchmarks = Object.keys(filtered[0]['benchmarks']).sort((a: any, b: any) => {
                return sortingArr.indexOf(a) - sortingArr.indexOf(b)
            })
            setbenchmarkKeys(['player', '', 'role'].concat(sortedBenchmarks))
        }
    }
    return (
        <>
            {loading &&
                <img src={blurred} alt='blurred image' />
            }
            {!!bestgames.length && !loading &&
                <div className="best-games-wrapper">
                    <div className="best-games">
                        <table>
                            <thead>
                                <tr>
                                    {benchmarkKeys.map((x: any, i: number) => {
                                        let header = x.split('_').map((char: string) => char[0]).join('')
                                        if (i < 3) {
                                            header = x
                                        } else if (header.length === 4) {
                                            header = header.replace('p', '')
                                        } else if (x === 'lhten') {
                                            header = "LH@10"
                                        }
                                        header = header.toUpperCase()
                                        return <th key={i}>{header}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody className="best-games-body">
                                {bestgames.map((match: any, i: number) => {
                                    return (
                                        <tr className="best-games-row" key={i}>
                                            <td className="benchmark-cell">
                                                <a className="player-name" href={`/player/${match['name']}`}>{match['name'].replace(/\(smurf.*\)/, '')}</a>
                                            </td>
                                            <td className="benchmark-cell ">
                                                <FontAwesomeIcon className='copy-match-id' icon={faCopy} color='white' onClick={() => navigator.clipboard.writeText(match.id)} />
                                            </td>
                                            <td className="benchmark-cell">
                                                <div className='svg-icon' id={match.role ? match.role.replace(' ', '-') : ''}
                                                    onClick={() => props.updateMatchData(stringSearch(props.data, 'role', match.role))}></div>
                                            </td>
                                            {benchmarkKeys.map((k: any, idx: number) => {
                                                if (k in match.benchmarks) {
                                                    let pct = match.benchmarks[k]['pct']
                                                    let raw = match.benchmarks[k]['raw']
                                                    if (typeof pct == 'number') {
                                                        pct = (pct * 100).toFixed(2)
                                                        raw = raw.toFixed(2)
                                                    }
                                                    let color = '#EC494B'
                                                    if (pct >= 80) color = '#5AA563'
                                                    else if (pct >= 60) color = '#5499D2'
                                                    else if (pct >= 40) color = '#C9AF1D'
                                                    else if (pct >= 25) color = '#D89740'
                                                    return (
                                                        <td key={idx} className='benchmark-cell'>
                                                            <p>
                                                                {pct &&
                                                                    <>
                                                                        <span className='benchmark-pct' style={{ color: color }}>{String(pct).replace(/\.00+/, '')}% </span>
                                                                        <span className='benchmark-raw'>{String(raw).replace(/\.00+/, '')}</span>
                                                                    </>
                                                                }
                                                            </p>
                                                        </td>
                                                    )
                                                }
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
    )
}
export default BestGames
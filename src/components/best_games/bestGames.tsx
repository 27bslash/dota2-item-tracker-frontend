import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useEffect } from 'react';
import stringSearch from '../table/table_search/string_search';

interface BenchmarksProps {
    benchmarks: {},
    display_role: null
    hero: string,
    id: number,
    name: string,
    role: string
}


const BestGames = (props: any) => {
    const [bestGames, setBestGames] = useState<any>()
    useEffect(() => {
        if ('best_games' in props.benchmarks) {
            setBestGames(props.benchmarks['best_games'])
            console.log(props.benchmarks)
        }
    }, [props.benchmarks])
    return (
        <>
            {bestGames &&
                <div className="best-games-wrapper">
                    <div className="best-games">
                        <table>
                            <thead>
                                <tr>
                                    <th className="benchmarks">PLAYER</th>
                                    <th className="benchmarks"></th>
                                    <th className="benchmarks">Role</th>
                                    <th className="benchmarks">GPM</th>
                                    <th className="benchmarks">XPM</th>
                                    <th className="benchmarks">KPM</th>
                                    <th className="benchmarks">LHM</th>
                                    <th className="benchmarks">HDM</th>
                                    <th className="benchmarks">HH</th>
                                    <th className="benchmarks">TD</th>
                                    <th className="benchmarks">SPM</th>
                                    <th className="benchmarks">LH@10</th>
                                </tr>
                            </thead>
                            <tbody className="best-games-body">
                                {bestGames.map((match: any, i: number) => {
                                    const benchmarkKeys = Object.keys(match.benchmarks)
                                    return (
                                        <tr className="best-games-row" key={i}>
                                            <td className="benchmark-cell">
                                                <a className="player-name" href={`/player/${match['name']}`}>{match['name']}</a>
                                            </td>
                                            <td className="benchmark-cell ">
                                                <FontAwesomeIcon className='copy-match-id' icon={faCopy} color='white' onClick={() => navigator.clipboard.writeText(match.id)} />
                                            </td>
                                            <td className="benchmark-cell">
                                                <div className='svg-icon' id={match.role ? match.role.replace(' ', '-') : ''}
                                                    onClick={() => props.updateMatchData(stringSearch(props.data, 'role', match.role))}></div>
                                            </td>
                                            {benchmarkKeys.map((k: any, idx: number) => {
                                                let pct = match.benchmarks[k]['pct']
                                                let raw = match.benchmarks[k]['raw']
                                                let color = '#EC494B'
                                                if (pct >= 80) color = '#5AA563'
                                                else if (pct >= 60) color = '#5499D2'
                                                else if (pct >= 40) color = '#C9AF1D'
                                                else if (pct >= 25) color = '#D89740'
                                                return (
                                                    <td key={idx} className='benchmark-cell'>
                                                        <p>
                                                            <span className='benchmark-pct' style={{ color: color }}>{pct}% </span>
                                                            <span className='benchmark-raw'>{raw}</span>
                                                        </p>
                                                    </td>
                                                )
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
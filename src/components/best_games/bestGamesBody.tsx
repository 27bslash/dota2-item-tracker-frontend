import { faSearch, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { theme } from "../..";
import { cleanDecimal } from "../../utils/cleanDecimal";
import { usePageContext } from "../stat_page/pageContext";
import DotaMatch from "../types/matchData";
import { BenchMarksKeys } from "./bestGames";

const BestGamesTableBody = (props: {
    updateRole: any; updatePageNumber: (idx: number) => void, bestgames: DotaMatch[]; benchmarkKeys: BenchMarksKeys[]
}) => {
    const { bestgames, benchmarkKeys, updatePageNumber } = props
    const { filteredData } = usePageContext()
    const findGame = (matchId: number) => {
        const index = filteredData.findIndex((match) => match.id === matchId)
        updatePageNumber(index)
    }
    return (
        <tbody className="best-games-body">
            {bestgames.map((match, i: number) => {
                return (
                    <tr className="best-games-row" key={i} style={{ backgroundColor: i % 2 === 0 ? theme.palette.table.main : theme.palette.table.secondary }} >
                        <td className="benchmark-cell">
                            <a className="benchmark-icon" href={`/player/${match['name']}`}>{match['name'].replace(/\(smurf.*\)/, '')}</a>
                        </td>
                        <td className="benchmark-cell" style={{ padding: 0 }}>
                            <FontAwesomeIcon className='benchmark-icon' id='search-match-id' icon={faSearch} color='white' onClick={() => findGame(match.id)} style={{ transform: 'scaleX(-1)' }} />
                        </td>
                        <td className="benchmark-cell" style={{ padding: 0 }}>
                            <FontAwesomeIcon className='benchmark-icon' id='copy-match-id' icon={faCopy} color='white' onClick={() => navigator.clipboard.writeText(String(match.id))} />
                        </td>
                        <td className="benchmark-cell" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className='benchmark-icon svg-icon' id={match.role ? match.role.replace(' ', '-') : ''}
                                onClick={() => props.updateRole(match.role)}></div>
                        </td>
                        {benchmarkKeys.map((k: BenchMarksKeys, idx: number) => {
                            if (k in match.benchmarks) {
                                let pct: string | number = match.benchmarks[k]['pct']
                                const raw = match.benchmarks[k]['raw']
                                if (typeof pct === 'number') {
                                    pct = (pct * 100)
                                }
                                let color = '#EC494B'
                                if (+pct >= 80) color = '#5AA563'
                                else if (+pct >= 60) color = '#5499D2'
                                else if (+pct >= 40) color = '#C9AF1D'
                                else if (+pct >= 25) color = '#D89740'
                                return (
                                    <td key={idx} className='benchmark-cell' style={{ textAlign: 'center', justifyContent: 'center' }}>
                                        {pct &&
                                            <>
                                                <span className='benchmark-pct' style={{ color: color }}>{cleanDecimal(pct)}% </span>
                                                <span className='benchmark-raw'>{cleanDecimal(raw)}</span>
                                            </>
                                        }
                                    </td>
                                )
                            }
                        })}
                    </tr>
                )
            })}
        </tbody>
    )
}
export default BestGamesTableBody;
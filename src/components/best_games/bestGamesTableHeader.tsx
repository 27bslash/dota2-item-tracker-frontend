import { theme } from "../.."
import { BenchMarksKeys } from "./bestGames"

const BestGamesTableHeader = (props: { benchmarkKeys: BenchMarksKeys[] }) => {
    //'linear-gradient(340deg,rgb(54, 59, 61) 0%,rgb(58, 94, 116) 100%)'
    const gradString = `linear-gradient(340deg,${theme.palette.table.main} 0%,${theme.palette.primary.main} 100%)`
    return (
        <thead style={{ background: gradString }}>
            <tr>
                <th>PLAYER</th>
                <th>
                    {/* icon header */}
                </th>
                <th>
                    {/* icon header */}
                </th>
                <th>ROLE</th>
                {props.benchmarkKeys.map((benchmarkKey, i: number) => {
                    let header = benchmarkKey.split('_').map((char: string) => char[0]).join('')
                    if (header.length === 4) {
                        header = header.replace('p', '')
                    } else if (benchmarkKey === 'lhten') {
                        header = "LH@10"
                    }
                    header = header.toUpperCase()
                    return <th key={i}>{header}</th>
                })}
            </tr>
        </thead>
    )
}
export default BestGamesTableHeader;
import { cleanDecimal } from "../../../utils/cleanDecimal"
import colourWins from "../../../utils/colourWins"
import heroSwitcher from "../../../utils/heroSwitcher"
import { TableSearchResult } from "../../table/table_search/types/tableSearchResult.types"
import DotaMatch from "../../types/matchData"

type SearchResultTextProps = {
    filteredData: string[]
    handleClick: (matches: DotaMatch[], key: string, type?: string) => void
    type?: string,
    data: TableSearchResult
}
export const SearchResultText = ({ data, filteredData, handleClick, type }: SearchResultTextProps) => {
    return (
        <>
            {filteredData.map((key: string, i: number) => {
                let matchKey = 'matches'
                if ('totalFilteredMatches' in data[key]) {
                    matchKey = 'totalFilteredMatches'
                }
                const matches = data[key]['matches'];
                const totalWins = matches.filter((match) => match.win === 1).length
                const winRate = cleanDecimal(((totalWins / matches.length) * 100))
                const k = heroSwitcher(key.replace(/[+\-_]/g, x => x === '_' ? ' ' : ''))
                let end = ','
                if (i === filteredData.length - 1) {
                    end = '';
                }
                else if (i === filteredData.length - 2) {
                    end = ' and'
                }
                return (
                    <span onClick={() => handleClick(matches, key, type)} style={{ marginRight: '5px', textTransform: 'capitalize' }}
                        className={`${type}-search-result table-search-result`} key={i}>{k}: ({matches.length}, <span style={{ color: colourWins(winRate) }}>{winRate}%</span>){end}</span>
                )
            })
            }
        </>
    )
}
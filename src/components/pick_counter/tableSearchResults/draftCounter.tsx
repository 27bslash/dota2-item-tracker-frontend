import { TableSearchResults } from "../../table/table_search/types/tableSearchResult.types"
import { SearchResultText } from "./searchResultText"
import { sortByMatches } from "./tableSearchResults"
type DraftCounterProps = {
    draft: TableSearchResults['draft']
    header: string,
    subheader: (null | string)[] | string[][]
    type: string
    handleClick: (matches: TableSearchResults, key: string, type?: string) => void
}
export const DraftCounter = ({ draft, handleClick, header, subheader, type }: DraftCounterProps) => {
    const keys = sortByMatches(draft)
    const draftArray = (symbol: string) => {
        const arr = []
        for (const heroName of keys) {
            if (heroName.includes(symbol)) {
                arr.push(heroName)
            } else if (!heroName.match(/[+-]/) && symbol === '+') {
                arr.push(heroName)
            }
        }
        return arr
    }
    const withArr = draftArray('+')
    const againstArr = draftArray('-')
    return (
        <>
            <h4>{header}</h4>
            {!!withArr.length &&
                <>
                    {subheader[0] &&
                        <p>{subheader[0]}:</p>
                    }
                    <SearchResultText data={draft} handleClick={handleClick} filteredData={withArr} type={type} />
                </>
            }
            {!!againstArr.length &&
                <>
                    <p>{subheader[1]}:</p>
                    < SearchResultText data={draft} handleClick={handleClick} filteredData={againstArr} type={type} />
                </>
            }
        </>
    )
}
import { Button } from "@mui/material"
import { SearchResultText } from "./searchResultText"
import { DraftCounter } from "./draftCounter";
import DotaMatch from "../../types/matchData";
import { TableSearchResult, TableSearchResults } from "../../table/table_search/types/tableSearchResult.types";
import { usePickCounterContext } from "../pickCounterContext";
import { usePageContext } from "../../stat_page/pageContext";


export const sortByMatches = (data: TableSearchResult) => {
    const sorted = Object.entries(data).sort((a, b) => b[1]['matches'].length - a[1]['matches'].length);
    const keys = sorted.map((item) => item[0])
    return keys.slice(0, 5)
}
type SearchResultsTextProps = {
    searchRes: TableSearchResults
}
export const SearchResultsText = () => {
    const { searchRes, updateSearchResults } = usePageContext()
    const { matchData, updateMatchData, reset } = usePickCounterContext()
    if (!searchRes) {
        return <></>
    }
    const items = searchRes['items']
    const draft = searchRes['draft']
    const role = searchRes['role']
    const players = searchRes['player']
    const talents = searchRes['talents']
    const handleClick = (filteredSearchResults: TableSearchResults, key: string, type?: string) => {
        // updateMatchData(filteredMatches, searchRes)
        updateSearchResults(filteredSearchResults)
    }
    let playerKeys: string[] = [], roleKeys: string[] = []
    if (players) {
        playerKeys = sortByMatches(players)
    }
    if (role) {
        roleKeys = sortByMatches(role)
    }
    return (
        <div className="table-search-results">
            <h3 style={{ margin: 0 }} onClick={() => reset()}>Search Results:</h3>
            {players && Object.keys(players).length > 0 &&
                <>
                    {/* <SearchResultText data={players} handleClick={handleClick} filteredData={playerKeys} type={'player'} /> */}
                    <DraftCounter handleClick={handleClick} draft={players} header='Players' subheader={[null, 'filtered players']} type="draft" />

                </>
            }
            {talents && Object.keys(talents).length > 0 &&
                <>
                    <h4>Talents: </h4>
                    <SearchResultText data={talents} handleClick={handleClick} type='talents' filteredData={sortByMatches(talents)} />
                </>
            }
            {items && Object.keys(items).length > 0 &&
                <DraftCounter handleClick={handleClick} draft={items} type='items' header='Items' subheader={[null, 'filtered items']} />
            }
            {draft && !!Object.keys(draft).length &&
                <DraftCounter handleClick={handleClick} draft={draft} type='draft' header='Draft' subheader={['with', 'against']} />
            }
            {role && Object.keys(role).length > 0 &&
                <>
                    <h4>Role:</h4>
                    <SearchResultText data={role} handleClick={handleClick} filteredData={roleKeys} type={'role'} />
                </>
            }
            <div className="reset-wrapper" style={{ marginTop: '7px' }}>
                <Button variant='contained' color='primary' sx={{ padding: '6px 10px 6px 10px' }} onClick={() => reset()}>RESET</Button>
            </div>
        </div>
    )
}
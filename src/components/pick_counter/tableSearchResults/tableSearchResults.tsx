import { Button } from '@mui/material'
import { SearchResultText } from './searchResultText'
import { DraftCounter } from './draftCounter'
import {
    TableSearchResult,
    TableSearchResults,
} from '../../table/table_search/types/tableSearchResult.types'
import { usePickCounterContext } from '../pickCounterContext'
import { usePageContext } from '../../stat_page/pageContext'

export const sortByMatches = (data: TableSearchResult) => {
    const sorted = Object.entries(data).sort(
        (a, b) => b[1]['matches'].length - a[1]['matches'].length
    )
    const keys = sorted.map((item) => item[0])
    return keys.slice(0, 5)
}

export const SearchResultsText = () => {
    const { searchRes, updateSearchResults } = usePageContext()
    const { reset } = usePickCounterContext()
    if (!searchRes) {
        return <></>
    }
    const items = searchRes['items']
    const draft = searchRes['draft']
    const role = searchRes['role']
    const facet = searchRes['facet']
    const players = searchRes['player']
    const heroes = searchRes['hero']
    const talents = searchRes['talents']
    const handleClick = (
        filteredSearchResults: TableSearchResults,

    ) => {
        // updateMatchData(filteredMatches, searchRes)
        updateSearchResults(filteredSearchResults)
    }
    let roleKeys: string[] = []
    if (role) {
        roleKeys = sortByMatches(role)
    }
    return (
        <div className="table-search-results">
            <h3 style={{ margin: 0 }} onClick={() => reset()}>
                Search Results:
            </h3>
            {players && Object.keys(players).length > 0 && (
                <>
                    {/* <SearchResultText data={players} handleClick={handleClick} filteredData={playerKeys} type={'player'} /> */}
                    <DraftCounter
                        handleClick={handleClick}
                        draft={players}
                        header="Players"
                        subheader={[null, 'filtered players']}
                        type="draft"
                    />
                </>
            )}
            {heroes && Object.keys(heroes).length > 0 && (
                <>
                    {/* <SearchResultText data={players} handleClick={handleClick} filteredData={playerKeys} type={'player'} /> */}
                    <DraftCounter
                        handleClick={handleClick}
                        draft={heroes}
                        header="Heroes"
                        subheader={[null, 'filtered heroes']}
                        type="draft"
                    />
                </>
            )}
            {talents && Object.keys(talents).length > 0 && (
                <>
                    <h4>Talents: </h4>
                    <SearchResultText
                        data={talents}
                        handleClick={handleClick}
                        type="talents"
                        filteredData={sortByMatches(talents)}
                    />
                </>
            )}
            {items && Object.keys(items).length > 0 && (
                <DraftCounter
                    handleClick={handleClick}
                    draft={items}
                    type="items"
                    header="Items"
                    subheader={[null, 'filtered items']}
                />
            )}
            {draft && !!Object.keys(draft).length && (
                <DraftCounter
                    handleClick={handleClick}
                    draft={draft}
                    type="draft"
                    header="Draft"
                    subheader={['with', 'against']}
                />
            )}
            {role && Object.keys(role).length > 0 && (
                <>
                    <h4>Role:</h4>
                    <SearchResultText
                        data={role}
                        handleClick={handleClick}
                        filteredData={roleKeys}
                        type={'role'}
                    />
                </>
            )}
            {facet && Object.keys(facet).length > 0 && (
                <>
                    <h4>Facet:</h4>
                    <SearchResultText
                        data={facet}
                        handleClick={handleClick}
                        filteredData={sortByMatches(facet)}
                        type={'facet'}
                    />
                </>
            )}
            <div className="reset-wrapper" style={{ marginTop: '7px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '6px 10px 6px 10px' }}
                    onClick={() => reset()}
                >
                    RESET
                </Button>
            </div>
        </div>
    )
}

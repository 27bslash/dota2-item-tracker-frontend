import { TextField } from '@mui/material';
import { useState } from 'react';
import DraftSearch from './draft_search';
import itemSearch from './item_search';
interface TableSearchProps {
    heroName: string,
    starter: boolean,
    updateMatchData: (data: object[]) => void,
    totalMatchData: object[],
    heroList: [{ id: number, name: string }],
    itemData: any,
    type: string,
    disabled: boolean
}
const TableSearch = (props: TableSearchProps) => {
    const [value, setValue] = useState('')
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        // const request = await fetch(`/search/${value}?key=${props.hero}&hero=jakiro`)
        // const json = await request.json()
        let searchResults: any = []
        const matchIdSet = new Set()
        const draftResults = new DraftSearch().handleDraftSearch(props.totalMatchData, props.heroList, value, props.heroName)
        const itemResults = itemSearch(value, props.totalMatchData, props.itemData)
        searchResults = addToResults(draftResults, matchIdSet, searchResults)
        searchResults = addToResults(itemResults, matchIdSet, searchResults)
        props.updateMatchData(Array.from(searchResults))
    }
    return (
        <div className="search">
            <form onSubmit={(e) => handleSubmit(e)}>
                <TextField
                    id="table-search"
                    placeholder='Search...'
                    variant="standard"
                    disabled={props.disabled}
                    onChange={(e) => setValue(e.target.value)}
                />
            </form>
        </div >
    )
}

const addToResults = (array: any, matchIdSet: any, searchResults: any) => {
    for (let match of array) {
        if (!matchIdSet.has(match['id'])) {
            matchIdSet.add(match['id'])
            searchResults.push(match)
        }
    }
    return searchResults
}
export default TableSearch
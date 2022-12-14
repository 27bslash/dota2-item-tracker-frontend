import { TextField } from '@mui/material';
import { SetStateAction, useState } from 'react';
import DraftSearch from './draft_search';
import itemSearch from './item_search';
import search from './search';
interface TableSearchProps {
    heroName: string,
    updateMatchData: (data: object[], searchResults: any) => void,
    totalMatchData: object[],
    heroList: [{ id: number, name: string }],
    playerList: any[]
    itemData: any,
    type: string,
    disabled: boolean
}
const TableSearch = (props: TableSearchProps) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setError(false)
        setValue(e.target.value)
        setErrorMsg('')
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const searchTerms = value.split(',')
        let searchResults = search(searchTerms, props.totalMatchData, props.itemData, props.heroList, props.playerList, props.heroName)
        const combinedMatches = combineMatches(searchResults)
        const matchIds: number[] = []
        const targetArr = combinedMatches.find((arr) => arr.length > 0) || []
        for (let matchId of targetArr) {
            const tempArr = [];
            for (let comparisonArr of combinedMatches) {
                if (!comparisonArr || comparisonArr.includes(matchId) || !comparisonArr.length) {
                    tempArr.push(matchId);
                }
            }
            if (tempArr.length === combinedMatches.length) {
                matchIds.push(tempArr[0]);
            }
        }
        const matches = [...props.totalMatchData].filter((x: any) => matchIds.includes(x.id))
        if (!matches.length) {
            setError(true)
            setErrorMsg(`No results found for ${value}`)
        }
        props.updateMatchData(matches, searchResults)
    }
    return (
        <div className="search">
            <form onSubmit={(e) => handleSubmit(e)}>
                <TextField
                    id="table-search"
                    placeholder='Search...'
                    variant="outlined"
                    disabled={props.disabled}
                    onChange={handleChange}
                    error={error}
                    helperText={errorMsg}
                    sx={{ maxWidth: '179px' }}
                />
            </form>
        </div >
    )
}
export function combineMatches(searchResults: any) {
    const result: number[][] = [];
    for (let key in searchResults) {
        for (let k in searchResults[key]) {
            const idx = searchResults[key][k]["index"];
            const matches = searchResults[key][k]["matches"];
            const m = matches.map(({ id }: any) => id) || [];
            result[idx] = result[idx] ? result[idx].concat(m) : m;
        }
    }
    return result;
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
import { TextField } from '@mui/material';
import { SetStateAction, useState } from 'react';
import Items from '../../types/Item';
import search from './search';
import Match from '../../types/matchData';
import { MatchDataAdj } from '../../stat_page/page';

interface TableSearchProps extends MatchDataAdj {
    heroName: string,
    heroList: [{ id: number, name: string }],
    playerList: any[]
    itemData: Items | undefined,
    type: string,
    disabled: boolean,
    role?: string,
    totalMatchData: Match[]
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
        setError(false)
        setErrorMsg('')
        const searchTerms = value.split(',')
        const data = props.role ? props.totalMatchData.filter((match: any) => match.role === props.role) : props.totalMatchData
        let searchResults = search(searchTerms, data, props.itemData, props.heroList, props.playerList, props.heroName)
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
        const matches = [...props.totalMatchData].filter((x: any) => (matchIds.includes(x.id) && x.role === props.role) || (matchIds.includes(x.id) && !props.role))
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
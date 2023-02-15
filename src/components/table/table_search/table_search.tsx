import { TextField } from '@mui/material';
import { SetStateAction, useContext, useState } from 'react';
import { ListContext } from '../../../App';
import Items from '../../types/Item';
import search from './search';
import { filteredDataContext } from './../../page';

interface TableSearchProps {
    heroName: string,
    updateMatchData: (data: object[], searchResults: any) => void,
    itemData: Items | undefined,
    type: string,
    disabled: boolean
}
const TableSearch = (props: TableSearchProps) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const heroList = useContext(ListContext)['heroList']
    const playerList = useContext(ListContext)['playerList']
    const filteredData = useContext(filteredDataContext)

    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setError(false)
        setValue(e.target.value)
        setErrorMsg('')
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const searchTerms = value.split(',')
        let searchResults = search(searchTerms, filteredData, props.itemData, heroList, playerList, props.heroName)
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
        const matches = [...filteredData].filter((x: any) => matchIds.includes(x.id))
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
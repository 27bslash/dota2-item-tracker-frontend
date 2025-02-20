import { TextField } from '@mui/material';
import { FormEvent, SetStateAction, useEffect, useState } from 'react';
import Items from '../../types/Item';
import { MatchDataAdj } from '../../stat_page/page';
import Hero from '../../types/heroList';
import { TableSearchResults } from './types/tableSearchResult.types';
import DotaMatch from './../../types/matchData';
import { useTableSearch } from './useTableSearch';
import { usePageContext } from '../../stat_page/pageContext';

interface TableSearchProps extends MatchDataAdj {
    heroName: string,
    heroList: Hero[],
    playerList: string[]
    itemData?: Items,
    type: string,
    disabled: boolean,
    role?: string,
    totalMatchData: DotaMatch[]
}
const TableSearch = (props: TableSearchProps) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [shouldRunCustomHook, setShouldRunCustomHook] = useState(false);

    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setError(false)
        setValue(e.target.value)
        setErrorMsg('')
    }
    const { updateSearchResults } = usePageContext()
    const { matches, searchResults } = useTableSearch(shouldRunCustomHook ? value.split(',') : [''],
        props.totalMatchData, props.heroList, props.playerList,
        props.itemData!, props.role, props.heroName)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setShouldRunCustomHook(true);
    }
    useEffect(() => {
        if (shouldRunCustomHook) {
            setError(false)
            setErrorMsg('')
            if (!matches.length) {
                setError(true);
                setErrorMsg(`No results found for ${value}`);
            }
            updateSearchResults(searchResults);
            setShouldRunCustomHook(false);
        }
    }, [shouldRunCustomHook])

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
export function combineMatches(searchResults: TableSearchResults) {
    const result: number[][] = [];
    for (const key in searchResults) {
        for (const k in searchResults[key]) {
            const idx = searchResults[key][k]["index"];
            const matches = searchResults[key][k]["matches"];
            const m = matches.map(({ id }) => id) || [];
            result[idx] = result[idx] ? result[idx].concat(m) : m;
        }
    }
    return result;
}

export default TableSearch
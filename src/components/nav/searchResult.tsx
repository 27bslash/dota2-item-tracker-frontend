
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
type SearchResult = {
    type: 'hero' | 'player'
    targetList: number,
    list: number,
    selectedIdx: number,
    value: string,
    idx: number,
    updateSearchIdx: (idx: number, type: SearchResult['type']) => void
}
const SearchResult = ({ type, targetList, list, selectedIdx, value, idx, updateSearchIdx }: SearchResult) => {
    let name = type === 'hero' ? value.replace(/\s/g, '_') : value
    // anti mage edge case
    const displayName = name.replace(/_/g, ' ')
    if (name === 'anti_mage') name = 'anti-mage'
    const [highlight, setHighlight] = useState('')
    useEffect(() => {
        if (idx === selectedIdx && list === targetList) {
            setHighlight('highlight')
        } else {
            setHighlight('')
        }
    }, [targetList, selectedIdx])

    return (
        <Box className={`${highlight}`}>
            <a className='suggestion-link' key={idx} href={`/${type}/${name}`} >
                <div className="suggestion" onMouseOver={() => updateSearchIdx(idx, type)}>
                    <Typography variant='body1' padding='4px'>{displayName}</Typography>
                </div>
            </a>
        </Box>
    )
}
export default SearchResult
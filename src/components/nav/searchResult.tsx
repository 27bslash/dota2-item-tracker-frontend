
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
const SearchResult = (props: any) => {
    let name = props.type === 'hero' ? props.value.name.replace(/\s/g, '_') : props.value
    // anti mage edge case
    const displayName = name.replace(/_/g, ' ')
    if (name === 'anti_mage') name = 'anti-mage'
    const [highlight, setHighlight] = useState('')
    useEffect(() => {
        if (props.idx === props.selectedidx && props.list === props.targetList) {
            setHighlight('highlight')
        } else {
            setHighlight('')
        }
    }, [props.targetList, props.selectedidx])

    return (
        <Box className={`${highlight}`}>
            <a className='suggestion-link' key={props.idx} href={`/${props.type}/${name}`} >
                <div className="suggestion" onMouseOver={() => props.updateSearchIdx(props.idx, props.type)}>
                    <Typography variant='body1' padding='4px'>{displayName}</Typography>
                </div>
            </a>
        </Box>
    )
}
export default SearchResult

import { useState, useEffect } from 'react';
const SearchResult = (props: any) => {
    const name = props.type === 'hero' ? props.value.name.replace(/\s/g, '_') : props.value
    let class_ = ''
    const displayName = name.replace(/_/g, ' ')
    const [hightlight, setHighlight] = useState(false)
    useEffect(() => {
        if (props.idx === props.selectedidx && props.list === props.targetList) {
            setHighlight(true)
        } else {
            setHighlight(false)
        }
    }, [props.targetList, props.selectedidx])

    return (
        <a className='suggestion-link' key={props.idx} href={`/${props.type}/${name}`} >
            {hightlight ? (
                <div className='suggestion highlight'>{displayName}</div>) : (
                <div className="suggestion" onMouseOver={() => props.updateSearchIdx(props.idx, props.type)}>{displayName}</div>
            )}
        </a>

    )
}
export default SearchResult
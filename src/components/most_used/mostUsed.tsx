import React, { useEffect, useState } from "react";
import itemSearch from "../table/table_search/item_search";
import ArrowButton from './../arrowButton';


const MostUsed = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const [mostUsed, setMostUsed] = useState([])
    const [max, setMax] = useState(0)

    useEffect(() => {
        let data = props.matchData
        if (props.role) {
            data = props.matchData.filter((match: any) => match.role === props.role)
        }
        const mostU = calculateMostUsed(data)
        setMostUsed(mostU)
        if (mostU.length) {
            // console.log(mostU)
            setMax(mostU[0][1])
        }
    }, [props.matchData, props.role])
    const handleClick = (item: any) => {
        const itemResult = itemSearch(item, props.matchData, props.itemData)
        if (itemResult) {
            const itemKey = Object.keys(itemResult)[0];
            props.updateMatchData(itemResult[itemKey]['matches'], { 'items': itemResult })
        }
    }
    return (
        <>
            <ArrowButton transition='collapse'>
                <div className="most-used-container">
                    <div className="most-used">
                        {mostUsed.map((x, i) => {
                            const img = `https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${x[0]}.png`
                            const value = x[1]
                            const perc = (value / max) * 100;
                            // console.log(x[0], perc)
                            return (
                                <div key={i} onClick={() => handleClick(x[0])} className="most-used-row">
                                    <img className='most-used-item' alt={x} src={img}></img>
                                    <div className="bar" style={{ backgroundColor: `hsl(120,100%,25%, ${perc}%)`, width: perc * 0.8 + '%' }}>
                                        <p className='bar-value'>{x[1]}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </ArrowButton>
        </>
    );
}

const calculateMostUsed = (data: any) => {
    const consumables = ['tango', 'flask', 'ward_observer',
        'ward_sentry', 'smoke_of_deceit', 'enchanted_mango', 'clarity', 'tpscroll', 'dust', 'tome_of_knowledge']
    let itemCount: any = {}
    for (let match of data) {
        for (let item of match['final_items']) {
            if (!consumables.includes(item['key'])) {
                itemCount[item['key']] = (itemCount[item['key']] + 1) || 1;
            }
        }
    }
    itemCount = Object.entries(itemCount).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10)
    return itemCount
}
export default MostUsed
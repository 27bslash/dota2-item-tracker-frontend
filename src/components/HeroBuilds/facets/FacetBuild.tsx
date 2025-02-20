import { useEffect, useState } from 'react'
import { usePageContext } from '../../stat_page/pageContext'
import { FacetObj } from '../../types/heroData'
import { FacetContent } from './facetContent'
type FacetProps = {
    data: {
        key: number
        count: number
        perc: string
        title?: string
    }[]
}
export const FacetBuild = ({ data }: FacetProps) => {
    const { heroData, nameParam } = usePageContext()
    const [facets, setFacets] = useState<FacetObj[]>()
    useEffect(() => {
        setFacets(heroData[nameParam]['facets'])
    }, [heroData, nameParam])
    const sortedData = data.sort((a, b) => {
        return b['count'] - a['count']
    })
    const mappedData = sortedData.map((x) => {
        if (!facets) return x
        if (!facets[x['key'] - 1]['Deprecated']) {
            x.title = facets[x['key'] - 1].title_loc.toLowerCase()
            return x
        }
        x.title = facets[facets?.length - 1].title_loc.toLowerCase()
        return x
    })
    const mergedData = Object.values(
        mappedData.reduce((acc: any, item) => {
            if (!item.title) return acc
            if (!acc[item.title]) {
                acc[item.title] = { ...item }
            } else {
                acc[item.title].count += item.count
            }
            return acc
        }, {})
    )

    const maps = []
    for (let i = 0; i < mergedData.length; i += 2) {
        maps.push([sortedData[i], sortedData[i + 1]])
    }
    return (
        <div className={`facets ${data.length <= 2 ? 'flex' : ''}`}>
            {facets &&
                maps.map((arr, i: number) => {
                    return (
                        <div
                            className="facets-group"
                            style={{ display: 'flex' }}
                            key={i}
                        >
                            {arr.map((x, j) => {
                                if (x) {
                                    return (
                                        <FacetContent
                                            key={j}
                                            facetStats={x}
                                            facets={facets}
                                        ></FacetContent>
                                    )
                                }
                            })}
                        </div>
                    )
                })}
        </div>
    )
}

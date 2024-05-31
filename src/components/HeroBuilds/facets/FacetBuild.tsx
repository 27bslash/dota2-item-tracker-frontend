import { useEffect, useState } from 'react'
import { usePageContext } from '../../stat_page/pageContext'
import { FacetObj } from '../../types/heroData'
import { FacetContent } from './facetContent'
type FacetProps = {
    data: {
        key: number
        count: number
        perc: string
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
    const maps = []
    for (let i = 0; i < sortedData.length; i += 2) {
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

import Color from 'color-thief-react'
import { useState, useEffect } from 'react'
import { usePageContext } from '../stat_page/pageContext'
import { highlight_numbers } from './tooltipDescription'
import { FacetObj } from '../types/heroData'

type facetToolipProps = {
    img: string
    facet: FacetObj
}
export const FacetTooltip = ({ img, facet }: facetToolipProps) => {
    const [open, setOpen] = useState(false)

    // const fac = new FastAverageColor()
    // const options = { width: '55px', height: '55px' }

    // console.log(image)
    // const averageColor = fac.getColor(image)
    // console.log(averageColor)
    const colorMap = {
        '4': '#926B96',
        '3': '#7F9EA2',
    }
    const gradientMap = {}
    //  linear-gradient(to right, #9F3C3C, #4A2040);
    console.log(facet)
    return (
        <>
            {facet && (
                <div
                    className="tooltip"
                    id="facet-tooltip"
                    // style={{
                    //     background: `radial-gradient(circle at top left, ${data} 0%, #11171c 160px`,
                    // }}
                >
                    <div className="tooltip-line-one">
                        <div className="tooltip-title">
                            <div>
                                <img
                                    style={{
                                        filter: 'drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.3))',
                                    }}
                                    className="tooltip-img"
                                    alt={img}
                                    src={img}
                                    width="55px"
                                ></img>
                            </div>
                            <h3>{facet.title_loc}</h3>
                        </div>
                    </div>
                    <div className="tooltip-content">
                        {facet['description_loc'] &&
                            facet['description_loc'].length && (
                                <div
                                    className="tooltip-description"
                                    style={{ color: '#c9d1dd' }}
                                >
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: highlight_numbers(
                                                facet['description_loc']
                                            ),
                                        }}
                                    ></p>
                                </div>
                            )}
                    </div>
                    {/* <div className="tooltip-footer"></div> */}
                </div>
            )}
        </>
    )
}

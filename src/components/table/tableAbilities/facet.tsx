import { useEffect, useState } from 'react'
import { usePageContext } from '../../stat_page/pageContext'
import { FacetObj } from '../../types/heroData'
import { Box } from '@mui/material'
import { FacetTooltip } from '../../tooltip/facetTooltip'
import Tip from '../../tooltip/tooltip'

type FacetProps = {
    variant?: number
    imgWidth: number
}
export const Facet = ({ variant, imgWidth }: FacetProps) => {
    const { nameParam, heroData } = usePageContext()
    const [facet, setFacet] = useState<FacetObj>()
    useEffect(() => {
        if (!variant) return
        const facets = heroData[nameParam]['facets']
        setFacet(facets[variant - 1])
    }, [])
    const icon = facet
        ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${facet.icon}.png`
        : ''
    return (
        <>
            {facet && (
                <Tip component={<FacetTooltip img={icon} facet={facet} />}>
                    <Box>
                        <img
                            className="table-img"
                            src={icon}
                            height={`${imgWidth}px`}
                        ></img>
                    </Box>
                </Tip>
            )}
        </>
    )
}

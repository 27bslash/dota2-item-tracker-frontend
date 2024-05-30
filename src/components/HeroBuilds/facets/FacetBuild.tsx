import { useEffect, useState } from 'react'
import { usePageContext } from '../../stat_page/pageContext'
import { FacetObj } from '../../types/heroData'
import { FacetTooltip, facetBackground } from '../../tooltip/facetTooltip'
import { Box, Typography } from '@mui/material'
import colourWins from './../../../utils/colourWins'
import { grey } from '@mui/material/colors'
import Tip from '../../tooltip/tooltip'

export const FacetBuild = (props: any) => {
    const { heroData, nameParam } = usePageContext()
    const [facets, setFacets] = useState<FacetObj[]>()
    useEffect(() => {
        setFacets(heroData[nameParam]['facets'])
    }, [heroData, nameParam])
    return (
        <div className="facets flex">
            {facets &&
                props.data.map((x: any, i: number) => {
                    const facet = facets[x['key'] - 1]
                    const icon = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${facet.icon}.png`
                    const { background, filter } = facetBackground(facet)

                    return (
                        <>
                            <Tip
                                placement={'left-end'}
                                component={
                                    <FacetTooltip
                                        img={icon}
                                        facet={facet}
                                        heroStats={heroData[nameParam]}
                                    />
                                }
                            >
                                <div
                                    style={{
                                        background: background,
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: 'fit-content',
                                        padding: '5px',
                                    }}
                                >
                                    <img
                                        height={30}
                                        src={icon}
                                        style={{
                                            filter: 'drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.3))',
                                        }}
                                    ></img>
                                    <Box paddingLeft={2} paddingRight={2}>
                                        <div className="flex">
                                            <Typography
                                                color={grey['400']}
                                                marginRight={1}
                                                letterSpacing={1}
                                            >
                                                Picks:
                                                <span
                                                    style={{
                                                        marginLeft: '5px',
                                                        color: 'orange',
                                                    }}
                                                >
                                                    {x['count']}
                                                </span>
                                            </Typography>
                                            <Typography
                                                color={grey['400']}
                                                letterSpacing={1}
                                            >
                                                Pick Rate:
                                                <span
                                                    style={{
                                                        marginLeft: '5px',
                                                        color: colourWins(
                                                            x['perc']
                                                        ),
                                                    }}
                                                >
                                                    {x['perc']}%
                                                </span>
                                            </Typography>
                                        </div>
                                        <Typography
                                            letterSpacing={1.3}
                                            fontFamily="Reaver"
                                            textTransform="uppercase"
                                            fontWeight="bold"
                                        >
                                            {facet.title_loc}
                                        </Typography>
                                    </Box>
                                </div>
                                {/* <FacetTooltip
                                key={i}
                                img={icon}
                                facet={facet}
                                heroStats={heroData[nameParam]}
                            ></FacetTooltip> */}
                            </Tip>
                        </>
                    )
                })}
        </div>
    )
}

import Color from 'color-thief-react'
import { useState, useEffect } from 'react'
import { usePageContext } from '../stat_page/pageContext'
import { highlight_numbers } from './tooltipDescription'
import { FacetObj, HeroStats, PageHeroData } from '../types/heroData'
import { Box, Typography } from '@mui/material'
import { AbilityImg } from '../table/tableAbilities/abilityImg'

type facetToolipProps = {
    img: string
    facet: FacetObj
    heroStats: HeroStats
}
export const facetBackground = (facet: FacetObj) => {
    const gradientMap = [
        [
            'linear-gradient(to right, #9F3C3C, #4A2040)',
            'linear-gradient(to right, #954533, #452732)',
            'linear-gradient(to right, #A3735E, #4F2A25)',
        ],
        [
            'linear-gradient(to right, #C8A45C, #6F3D21)',
            'linear-gradient(to right, #C6A158, #604928)',
            'linear-gradient(to right, #CAC194, #433828)',
            'linear-gradient(to right, #C3A99A, #4D352B)',
        ],
        [
            'linear-gradient(to right, #A2B23E, #2D5A18)',
            'linear-gradient(to right, #7EC2B2, #29493A)',
            'linear-gradient(to right, #538564, #1C3D3F)',
            'linear-gradient(to right, #9A9F6A, #223824)',
            'linear-gradient(to right, #9FAD8E, #3F4129)',
        ],
        [
            'linear-gradient(to right, #727CB2, #342D5B)',
            'linear-gradient(to right, #547EA6, #2A385E)',
            'linear-gradient(to right, #6BAEBC, #135459)',
            'linear-gradient(to right, #94B5BA, #385B59)',
        ],
        [
            'linear-gradient(to right, #B57789, #412755)',
            'linear-gradient(to right, #9C70A4, #282752)',
            'linear-gradient(to right, #675CAE, #261C44)',
        ],
        [
            'linear-gradient(to right, #565C61, #1B1B21)',
            'linear-gradient(to right, #6A6D73, #29272C)',
            'linear-gradient(to right, #95A9B1, #3E464F)',
            'linear-gradient(to right, #ADB6BE, #4E5557)',
        ],
    ]
    const filterMap = [
        [
            'invert(15%) sepia(99%) saturate(100%) hue-rotate(287deg) brightness(99%) contrast(100%)',
            'invert(14%) sepia(99%) saturate(100%) hue-rotate(321deg) brightness(99%) contrast(100%)',
            'invert(22%) sepia(100%) saturate(100%) hue-rotate(319deg) brightness(98%) contrast(100%)',
            'invert(24%) sepia(100%) saturate(100%) hue-rotate(324deg) brightness(96%) contrast(100%)',
            'invert(42%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(93%) contrast(99%)',
        ],
        [
            'invert(24%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(96%) contrast(100%)',
            'invert(19%) sepia(94%) saturate(99%) hue-rotate(0deg) brightness(93%) contrast(100%)',
            'invert(18%) sepia(99%) saturate(99%) hue-rotate(0deg) brightness(99%) contrast(100%)',
            'invert(54%) sepia(99%) saturate(100%) hue-rotate(0deg) brightness(97%) contrast(100%)',
            'invert(53%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(98%) contrast(100%)',
            'invert(67%) sepia(91%) saturate(100%) hue-rotate(12deg) brightness(94%) contrast(95%)',
            'invert(67%) sepia(64%) saturate(99%) hue-rotate(0deg) brightness(92%) contrast(97%)',
        ],
        [
            'invert(21%) sepia(100%) saturate(100%) hue-rotate(100deg) brightness(94%) contrast(100%)',
            'invert(22%) sepia(92%) saturate(100%) hue-rotate(135deg) brightness(82%) contrast(100%)',
            'invert(15%) sepia(100%) saturate(100%) hue-rotate(75deg) brightness(91%) contrast(100%)',
            'invert(22%) sepia(90%) saturate(100%) hue-rotate(25deg) brightness(92%) contrast(100%)',
            'invert(57%) sepia(100%) saturate(100%) hue-rotate(32deg) brightness(93%) contrast(100%)',
            'invert(61%) sepia(100%) saturate(100%) hue-rotate(114deg) brightness(93%) contrast(99%)',
            'invert(38%) sepia(100%) saturate(100%) hue-rotate(88deg) brightness(97%) contrast(100%)',
            'invert(53%) sepia(100%) saturate(100%) hue-rotate(26deg) brightness(92%) contrast(99%)',
            'invert(62%) sepia(65%) saturate(99%) hue-rotate(44deg) brightness(94%) contrast(89%)',
        ],
        [
            'invert(18%) sepia(100%) saturate(100%) hue-rotate(183deg) brightness(100%) contrast(100%)',
            'invert(32%) sepia(100%) saturate(100%) hue-rotate(137deg) brightness(79%) contrast(100%)',
            'invert(37%) sepia(68%) saturate(99%) hue-rotate(126deg) brightness(78%) contrast(100%)',
            'invert(44%) sepia(100%) saturate(100%) hue-rotate(190deg) brightness(95%) contrast(99%)',
            'invert(39%) sepia(100%) saturate(99%) hue-rotate(167deg) brightness(99%) contrast(100%)',
            'invert(59%) sepia(100%) saturate(100%) hue-rotate(145deg) brightness(89%) contrast(99%)',
            'invert(64%) sepia(61%) saturate(99%) hue-rotate(139deg) brightness(94%) contrast(96%)',
        ],
        [
            'invert(14%) sepia(99%) saturate(100%) hue-rotate(202deg) brightness(96%) contrast(99%)',
            'invert(12%) sepia(100%) saturate(100%) hue-rotate(214deg) brightness(99%) contrast(100%)',
            'invert(54%) sepia(76%) saturate(100%) hue-rotate(243deg) brightness(85%) contrast(95%)',
            'invert(48%) sepia(100%) saturate(100%) hue-rotate(296deg) brightness(91%) contrast(100%)',
            'invert(33%) sepia(100%) saturate(100%) hue-rotate(207deg) brightness(99%) contrast(100%)',
        ],
        [
            'invert(35%) sepia(24%) saturate(99%) hue-rotate(164deg) brightness(92%) contrast(92%)',
            'invert(44%) sepia(23%) saturate(99%) hue-rotate(181deg) brightness(91%) contrast(95%)',
            'invert(64%) sepia(44%) saturate(99%) hue-rotate(151deg) brightness(92%) contrast(95%)',
            'invert(73%) sepia(23%) saturate(99%) hue-rotate(166deg) brightness(93%) contrast(94%)',
        ],
    ]
    return {
        background: gradientMap[facet.color][facet.gradient_id],
        filter: filterMap[facet.color][facet.gradient_id],
    }
}
export const FacetTooltip = ({ img, facet, heroStats }: facetToolipProps) => {
    const { background, filter } = facetBackground(facet)
    return (
        <>
            {facet && (
                <div
                    style={{ width: '400px', letterSpacing: '1px' }}
                    className="tooltip"
                    id="facet-tooltip"
                >
                    <div
                        className="bg"
                        style={{
                            background: background,
                        }}
                    >
                        <div
                            style={{
                                backgroundImage:
                                    'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/ripple_texture.png")',
                                backgroundSize: 'cover',
                                height: '70px',
                                width: '100%',
                                position: 'absolute',
                                filter: filter,
                            }}
                        ></div>
                        <div
                            className="tooltip-line-one"
                            style={{
                                padding: '0px 10px 0px 0px',
                                height: '70px',
                            }}
                        >
                            <Box
                                alignItems={'center'}
                                justifyContent={'center'}
                                justifyItems={'center'}
                                sx={{
                                    height: '100%',
                                    width: '20%',
                                    background:
                                        'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))',
                                    display: 'flex',
                                }}
                            >
                                <img
                                    className="tooltip-img"
                                    id='facet-icon'
                                    alt={img}
                                    src={img}
                                    width="35px"
                                ></img>
                            </Box>
                            <div className="tooltip-title">
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontSize: '22px !important',
                                        marginLeft: 'auto',
                                        textTransform: 'uppercase',
                                        zIndex: 1,
                                    }}
                                >
                                    {facet.title_loc}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div
                        className="tooltip-content"
                        style={{ backgroundColor: '#181f24' }}
                    >
                        {facet['description_loc'] &&
                            facet['description_loc'].length && (
                                <div className="tooltip-description">
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: highlight_numbers(
                                                facet['description_loc']
                                            ),
                                        }}
                                    ></p>
                                </div>
                            )}
                        {facet.ability_loc && (
                            <>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    sx={{
                                        background:
                                            'linear-gradient(to right, #9bcdff17 0%, #9bcdff09 30%, #d0e8ff00 100%)',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <img
                                        height="30px"
                                        src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${
                                            heroStats['abilities'][
                                                facet.ability
                                            ]['name']
                                        }.png`}
                                        onError={(e) => {
                                            const target =
                                                e.target as HTMLImageElement
                                            target.onerror = null
                                            target.src =
                                                'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/innate_icon.png'
                                        }}
                                    ></img>
                                    <Typography
                                        sx={{
                                            textTransform: 'uppercase',
                                            color: 'white',
                                            paddingLeft: '12px',
                                            fontWeight: 'bold',
                                            fontFamily: 'reaver, serif',
                                        }}
                                    >
                                        {
                                            heroStats['abilities'][
                                                facet.ability
                                            ]['name_loc']
                                        }
                                    </Typography>
                                </Box>
                                <div
                                    style={{
                                        letterSpacing: '1px',
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: highlight_numbers(
                                            facet['ability_loc']
                                        ),
                                    }}
                                ></div>
                            </>
                        )}
                        {facet.notes && facet.notes.length && (
                            <div
                                style={{
                                    backgroundColor: '#253844',
                                    padding: '10px',
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: highlight_numbers(facet['notes']),
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

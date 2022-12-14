import React, { useEffect, useState } from "react"
import HeroAttributes from './heroAttributes';
import HeroAghs from './heroAghanim';
import Color from "color-thief-react";

interface HeroTooltipProps {
    children: React.ReactNode;
    heroName: string,
    img: string,
    heroColor: string
    baseApiUrl: string,
    heroData: any

}

const HeroTooltip = (props: HeroTooltipProps) => {
    const [open, setOpen] = useState(false)

    // todo move this to main page
    const handleChange = (b: boolean) => {
        setOpen(b)
    }
    let heroData: any = undefined
    if (props.heroData.length) {
        heroData = props.heroData[0][props.heroName]
    }
    return (
        <Color src={props.img} crossOrigin="anonymous" format="hex">
            {({ data }) => {
                return (
                    <div className="toltip" onMouseEnter={() => handleChange(true)}
                        onMouseLeave={() => handleChange(false)} style={{ width: '126px' }}>
                        {props.children}
                        {open && heroData &&
                            <div className="tooltip" id='hero-tooltip' style={{ background: `radial-gradient(circle at top left, ${data} 0%, #182127 230px` }}>
                                <div className="tooltip-line-one">
                                    <div className="tooltip-title">
                                        <div className="hero-img-wrapper">
                                            <img className="tooltip-hero-img" alt={props.img} src={props.img}>

                                            </img>
                                            <Bar heroData={heroData} stat='health' />
                                            <Bar heroData={heroData} stat='mana' />
                                        </div>
                                        <h3 style={{ color: 'white', textTransform: 'capitalize' }}>{props.heroName.replace('_', ' ')}</h3>
                                    </div>
                                </div>
                                <div className="tooltip-content">
                                    <div className="stats-container">
                                        <HeroAttributes heroData={heroData} stat='attr' stats={['strength', 'agility', 'intelligence']} />
                                        <HeroAttributes heroData={heroData} stat='stat' stats={['damage', 'armor', 'movement_speed']} />
                                    </div>
                                    <HeroAghs heroData={heroData} type='shard' />
                                    <HeroAghs heroData={heroData} type='scepter' />
                                </div>
                            </div>
                        }
                    </div>
                )
            }}
        </Color>
    )
}
const Bar = (props: any) => {
    return (
        <div className="stat-bar" id={props.stat + '-bar'}>
            <p className="max-stat">{props.heroData[`max_${props.stat}`]}</p>
            <p className="stat-regen">+{props.heroData[`${props.stat}_regen`].toFixed(2)}</p>
        </div>
    )
}
export default HeroTooltip
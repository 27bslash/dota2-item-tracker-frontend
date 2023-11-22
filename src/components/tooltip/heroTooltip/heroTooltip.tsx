import React, { useState } from "react"
import HeroAttributes from './heroAttributes';
import HeroAghs from './heroAghanim';
import Color from "color-thief-react";
import heroSwitcher from '../../../utils/heroSwitcher';
import { HeroStats, PageHeroData } from "../../types/heroData";

interface HeroTooltipProps {
    children: React.ReactNode;
    heroName: string,
    img: string,
    heroData: PageHeroData

}

const HeroTooltip = ({ children, heroName, img, heroData }: HeroTooltipProps) => {
    const [open, setOpen] = useState(false)

    // todo move this to main page
    const handleChange = (b: boolean) => {
        setOpen(b)
    }
    let individualHeroData: HeroStats
    if (heroData) {
        individualHeroData = heroData[heroName]
    }
    return (
        <Color src={img} crossOrigin="anonymous" format="hex">
            {({ data }) => {
                return (
                    <div className="toltip" onMouseEnter={() => handleChange(true)}
                        onMouseLeave={() => handleChange(false)} style={{ width: '126px' }}>
                        {children}
                        {open && heroData &&
                            <div className="tooltip" id='hero-tooltip' style={{ background: `radial-gradient(circle at top left, ${data} 0%, #182127 230px` }}>
                                <div className="tooltip-line-one">
                                    <div className="tooltip-title">
                                        <div className="hero-img-wrapper">
                                            <img className="tooltip-hero-img" alt={img} src={img}>

                                            </img>
                                            <Bar heroData={individualHeroData} stat='health' />
                                            <Bar heroData={individualHeroData} stat='mana' />
                                        </div>
                                        <h3 style={{ color: 'white', textTransform: 'capitalize' }}>{heroSwitcher(heroName.replace('_', ' '))}</h3>
                                    </div>
                                </div>
                                <div className="tooltip-content">
                                    <div className="stats-container">
                                        <HeroAttributes heroData={individualHeroData} stat='attr' stats={['strength', 'agility', 'intelligence']} />
                                        <HeroAttributes heroData={individualHeroData} stat='stat' stats={['damage', 'armor', 'movement_speed']} />
                                    </div>
                                    <HeroAghs heroData={individualHeroData} type='shard' />
                                    <HeroAghs heroData={individualHeroData} type='scepter' />
                                </div>
                            </div>
                        }
                    </div>
                )
            }}
        </Color>
    )
}
const Bar = ({ stat, heroData }: { stat: string, heroData: HeroStats }) => {
    type MaxStats = {
        max_health: number,
        max_mana: number,
    }
    type RegenStats = {
        health_regen: number,
        mana_regen: number
    }
    const maxStat = `max_${stat}` as keyof MaxStats
    const regenStat = `${stat}_regen` as keyof RegenStats
    return (
        <div className="stat-bar" id={stat + '-bar'}>
            <p className="max-stat">{heroData[maxStat]}</p>
            <p className="stat-regen">+{heroData[regenStat].toFixed(2)}</p>
        </div>
    )
}
export default HeroTooltip
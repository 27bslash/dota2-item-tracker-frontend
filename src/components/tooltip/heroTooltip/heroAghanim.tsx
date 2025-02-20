import { HeroStats } from '../../types/heroData'
import { extractHiddenValues } from '../abilityTooltip'

const HeroAghs = ({
    type,
    heroStats,
}: {
    heroStats: HeroStats
    type: string
}) => {
    const agh = extractAghanim(heroStats['abilities'], type)
    if (agh) {
        const aghText = agh[`${type}_loc`] || agh['desc_loc']
        const aghanimDescription = extractHiddenValues(
            aghText,
            agh['special_values']
        )
        const link = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${agh['name']}.png`
        return (
            <div className="hero-aghanim-upgrades">
                {aghText && (
                    <div className="hero-aghanim-wrapper" id={`hero-${type}`}>
                        <div
                            className="tooltip-aghanim-img"
                            style={{
                                backgroundImage: `url(${link})`,
                                position: 'relative',
                            }}
                        >
                            <img
                                className={`subicon`}
                                id={`${type}-subicon`}
                                alt=""
                            ></img>
                        </div>
                        <p style={{ fontSize: '13px' }}>
                            {aghanimDescription
                                .split(/\s|,/)
                                .map((x, i: number) => {
                                    if (x.match(/\d+/g)) {
                                        return (
                                            <span
                                                key={i}
                                                className="tooltip-text-highlight"
                                            >
                                                {x}{' '}
                                            </span>
                                        )
                                    } else {
                                        return <span key={i}>{x + ' '}</span>
                                    }
                                })}
                        </p>
                    </div>
                )}
            </div>
        )
    } else {
        return <></>
    }
}

const extractAghanim = (result: { [x: string]: any }, s: string) => {
    for (const ability in result) {
        if (result[ability][`ability_is_granted_by_${s}`]) {
            result[ability]['newAbility'] = true
            return result[ability]
        } else if (
            result[ability][`ability_has_${s}`] &&
            result[ability][`${s}_loc`]
        ) {
            result[ability]['modifier'] = true
            return result[ability]
        }
    }
}
export default HeroAghs

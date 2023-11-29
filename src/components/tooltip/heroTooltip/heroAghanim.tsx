import { HeroStats, SpecialValues as SpecialValue } from "../../types/heroData"

const HeroAghs = ({ type, heroStats }: { heroStats: HeroStats, type: string }) => {
    const agh = extractAghanim(heroStats['abilities'], type)
    if (agh) {
        const aghText = agh[`${type}_loc`] || agh['desc_loc']
        const aghanimDescription = extractHiddenValues(aghText, agh['special_values'])
        const link = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${agh['name']}.png`
        return (
            <div className="hero-aghanim-upgrades">
                {aghText &&
                    <div className="hero-aghanim-wrapper" id={`hero-${type}`}>
                        <div className="tooltip-aghanim-img" style={{ backgroundImage: `url(${link})`, position: 'relative' }}>
                            <img className={`subicon`} id={`${type}-subicon`} alt=''></img>
                        </div>
                        <p style={{ fontSize: '13px' }}>
                            {aghanimDescription.split(/\s|,/).map((x, i: number) => {
                                if (x.match(/\d+/g)) {
                                    return <span key={i} className='tooltip-text-highlight'>{x} </span>
                                } else {
                                    return <span key={i}>{x + ' '}</span>
                                }
                            })}
                        </p>
                    </div>
                }
            </div>
        )
    }
    else {
        return <></>
    }
}
const extractHiddenValues = (text: string, specialValues: SpecialValue[]) => {
    const sp = text.replace("bonus_", "").split("%");
    specialValues.forEach((x) => {
        x["name"] = x["name"].replace("bonus_", "");
        if (sp.includes(x["name"])) {
            let float: number[] | string[] = x["values_float"],
                int: number[] | string[] = x["values_int"];
            if (x["is_percentage"]) {
                float = float.map((el: number | string) => (el += "%"));
                if (int) int = int.map((el: number | string) => (el += "%"));
            }
            sp[sp.indexOf(x["name"])] = `${float || ""}${int || ""}`;
        }
    });
    return sp.join("")
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
            return result[ability];
        }
    }
}
export default HeroAghs
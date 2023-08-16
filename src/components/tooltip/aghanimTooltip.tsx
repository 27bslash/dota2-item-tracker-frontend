import TooltipAttributes from "./tooltipAttributes"
import CdMc from './cdmc';
import Color from "color-thief-react";

const AghanimTooltip = (props: any) => {
    let abilities: any[] = []
    if (props.heroData[props.heroName]) {
        abilities = props.heroData[props.heroName]['abilities']
    }
    const aghanimAbility = extractAghanim(abilities, props.type)
    const aghText = aghanimAbility[`${props.type}_loc`] || aghanimAbility['desc_loc']
    const aghanimDescription = extract_hidden_values(aghText, aghanimAbility['special_values'])
    const img = `https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//abilities/${aghanimAbility.name}.png`

    return (
        <Color src={img} crossOrigin="anonymous" format="hex">
            {({ data, loading, error }) => {
                return (
                    <div className="tooltip" id="aghanim-tooltip" style={{ background: `radial-gradient(circle at top left, ${data} 0%, #182127 160px` }}>
                        <div className="tooltip-line-one" style={{ flexDirection: "column", padding: '20px 20px 0px' }}>
                            <div className="tooltip-title">
                                <img className="tooltip-img" alt={img} src={img} width='55px'></img>
                                <h3>{aghanimAbility.name_loc}</h3>
                            </div>
                            <div className="aghanim-wrapper">
                                <p style={{ fontSize: '12px' }} className="aghanim-title">{props.type} ability upgrade</p>
                            </div>
                        </div>
                        <div className="tooltip-content">
                            <div className="tooltip-attributes">
                                <TooltipAttributes aghanimAbility={aghanimAbility} type={props.type} itemProperties={aghanimAbility}></TooltipAttributes>
                            </div>
                            <div className="tooltip-description">
                                {aghanimDescription.split(/\s|,/).map((x: any, i: number) => {
                                    if (x.match(/\d+/g)) {
                                        return <span key={i} className='tooltip-text-highlight'>{x} </span>
                                    } else {
                                        return <span key={i}>{x + ' '}</span>
                                    }
                                })}
                            </div>
                        </div>
                        <div className="tooltip-footer">
                            <CdMc mana_costs={aghanimAbility.mana_costs} cooldowns={aghanimAbility.cooldowns}></CdMc>
                        </div>
                    </div>
                )
            }}
        </Color>
    )
}

const extract_hidden_values = (text: string, special_values: any) => {
    let sp = text.replace("bonus_", "").split("%");
    special_values.forEach((x: any) => {
        x["name"] = x["name"].replace("bonus_", "");
        if (sp.includes(x["name"])) {
            let float = x["values_float"].map((el: any) => parseFloat(el)
            ),
                int = x["values_int"];
            if (x["is_percentage"]) {
                float = float.map((el: string) => (el += "%"));
                if (int) int = int.map((el: string) => (el += "%"));
            }
            sp[sp.indexOf(x["name"])] = `${float || ""}${int || ""}`;
        }
    });
    return sp.join("")
}

export default AghanimTooltip

// const highlightPattern = (text: string, pattern: RegExp) => {
//     const splitText = text.split(pattern);

//     if (splitText.length <= 1) {
//         return [];
//     }

//     const matches = text.match(pattern) || [];

//     return splitText.reduce((arr: any, element: string) => {
//         if (!element) return arr;
//         console.log(element, matches)
//         if (matches.includes(element)) {
//             return [...arr, <span className="tooltip-text-highlight">{element}</span>];
//         }

//         return [...arr, element];
//     },
//         []
//     );
// };


const extractAghanim = (result: { [x: string]: any }, s: string) => {
    for (let ability in result) {
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
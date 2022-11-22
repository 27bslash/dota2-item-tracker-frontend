
const HeroAghs = (props: any) => {
    const agh = extractAghanim(props.heroData['abilities'], props.type)
    const aghText = agh[`${props.type}_loc`] || agh['desc_loc']
    const aghanimDescription = extract_hidden_values(aghText, agh['special_values'])
    const link = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${agh['name']}.png`
    return (
        <div className="hero-aghanim-upgrades">
            <div className="hero-aghanim-wrapper" id={`hero-${props.type}`}>
                <div className="tooltip-aghanim-img" style={{ backgroundImage: `url(${link})`, position: 'relative' }}>
                    <img className={`subicon`} id={`${props.type}-subicon`}></img>
                </div>
                <p style={{ fontSize: '13px' }}>
                    {aghanimDescription.split(/\s|,/).map((x: any, i: number) => {
                        if (x.match(/\d+/g)) {
                            return <span key={i} className='tooltip-text-highlight'>{x} </span>
                        } else {
                            return <span key={i}>{x + ' '}</span>
                        }
                    })}
                </p>
            </div>
        </div>
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
export default HeroAghs
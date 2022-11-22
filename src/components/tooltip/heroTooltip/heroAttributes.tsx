const HeroAttributes = (props: any) => {
    let baseLink = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero`
    if (props.stat === 'stat') {
        baseLink = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon`
    }
    return (
        <div className={`hero-${props.stat}`}>
            {props.stats.map((attr: string, i: number) => {
                const link = `${baseLink}_${attr}.png`
                if (props.stat === 'attr') {
                    attr = attr.substring(0, 3)
                }
                return (
                    props.stat === 'attr' ? (
                        <div className="attribute-wrapper" key={i}>
                            <img src={link} className="attr-img"></img>
                            <p className="base-attr">{props.heroData[`${attr}_base`]}</p>
                            <p className="attr-gain">+{props.heroData[`${attr}_gain`]}</p>
                        </div>

                    ) : (
                        <div className="stat-wrapper" key={i}>
                            <img src={link} className="stat-img"></img>
                            <HeroStat heroData={props.heroData} stat={attr} />
                        </div>

                    )
                )
            })}
        </div>
    )
}
const HeroStat = (props: any) => {
    const stat = props.stat === 'damage' ? `${props.heroData[`${props.stat}_min`]}-${props.heroData[`${props.stat}_max`]}` : parseInt(props.heroData[props.stat])
    return (
        <p>{stat}</p>
    )
}
export default HeroAttributes
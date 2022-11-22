import HeroTooltip from "./tooltip/heroTooltip/heroTooltip"

const HeroImg = (props: any) => {
    const imgHost = 'https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes'
    const heroImg = `${imgHost}/${props.heroName}.png`
    return (
        <HeroTooltip heroName={props.heroName} img={heroImg} heroColor={props.heroColor}>
            <img src={heroImg} alt="hero" height='71px' width='126px' />
        </HeroTooltip>
    )
}
export default HeroImg
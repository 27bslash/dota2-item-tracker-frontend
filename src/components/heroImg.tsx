import { usePageContext } from "./stat_page/pageContext"
import HeroTooltip from "./tooltip/heroTooltip/heroTooltip"

const HeroImg = () => {
    const imgHost = 'https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes'
    const { nameParam } = usePageContext()
    const heroImg = `${imgHost}/${nameParam}.png`
    return (
        <HeroTooltip img={heroImg} >
            <img src={heroImg} alt="hero" height='71px' width='126px' />
        </HeroTooltip>
    )
}
export default HeroImg
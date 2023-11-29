import { usePageContext } from "../../stat_page/pageContext";
import AbilityTooltip from "../../tooltip/abilityTooltip";
import Tip from "../../tooltip/tooltip";

export const AbilityImg = (props: { link: string, ability: any, imgWidth: number }) => {
    const { link, ability, imgWidth } = props
    const { nameParam, heroData } = usePageContext()
    return <Tip component={<AbilityTooltip img={link} ability={ability} />}>
        <div className="ability">
            <img width={imgWidth} height={imgWidth} className='table-img' alt={ability.key} data-id={ability.id} src={link}></img>
        </div>
    </Tip>;
}

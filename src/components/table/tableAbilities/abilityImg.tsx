import AbilityTooltip from "../../tooltip/abilityTooltip";
import Tip from "../../tooltip/tooltip";

export const AbilityImg = (props: { link: string, heroData: any, heroName: string, ability: any, imgWidth: number }) => {
    const { link, heroData, heroName, ability, imgWidth } = props
    return <Tip component={<AbilityTooltip img={link} heroData={heroData} heroName={heroName} ability={ability} />}>
        <div className="ability">
            <img width={imgWidth} height={imgWidth} className='table-img' alt={ability.key} data-id={ability.id} src={link}></img>
        </div>
    </Tip>;
}

import AbilityTooltip from "../../tooltip/abilityTooltip";
import Tip from "../../tooltip/tooltip";
import { HeroAbility } from "../../types/matchData";

export const AbilityImg = (props: {
  link: string;
  ability: HeroAbility;
  imgWidth: number;
}) => {
  const { link, ability, imgWidth } = props;
  return (
    <Tip component={<AbilityTooltip img={link} ability={ability} />}>
      <div className="ability">
        <img
          width={imgWidth}
          height={imgWidth}
          className="table-img"
          alt={ability.key}
          data-id={ability.id}
          src={link}
        ></img>
      </div>
    </Tip>
  );
};

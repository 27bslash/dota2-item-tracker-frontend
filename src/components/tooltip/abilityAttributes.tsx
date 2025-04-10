import { HeroAbilities } from "../types/heroData";
import { AbilityAttribute } from "./tooltipAttributes";

const dispellable = (dispel: number) => {
  let dispellableString = "";
  if (dispel === 3) {
    dispellableString = "cannot be dispelled";
  } else if (dispel === 2) {
    dispellableString = "yes";
  } else if (dispel === 1) {
    dispellableString = "strong dispell only";
  }
  return dispellableString;
};

export const damageType = (dmgType: number) => {
  let dmgTypestr = "";
  const dmgColors: Record<string, string> = {
    physical: "#c91212",
    magical: "#428fc7",
    pure: "#FBDC98",
  };
  switch (dmgType) {
    case 1:
      dmgTypestr = "physical";
      break;
    case 2:
      dmgTypestr = "magical";
      break;
    case 3:
      dmgTypestr = "magical";
      break;
    case 4:
      dmgTypestr = "pure";
      break;
    default:
      break;
  }

  return dmgTypestr ? [dmgTypestr, dmgColors[dmgTypestr]] : null;
};
const AbilityAttributes = (props: { ability: HeroAbilities }) => {
  const dmgType = damageType(props.ability.damage);
  const pierce =
    props.ability.immunity === 3 || props.ability.immunity === 1 ? "yes" : "no";
  const dispel = dispellable(props.ability.dispellable);
  return (
    <div
      className="attributes"
      style={{ borderBottom: "solid 1px gray", paddingBottom: "5px" }}
    >
      {dmgType && (
        <AbilityAttribute
          heading="DAMAGE TYPE:"
          color={dmgType[1]}
          value={dmgType[0]}
        />
      )}
      {props.ability.immunity > 0 && (
        <AbilityAttribute
          heading="PIERCES SPELL IMMUNITY:"
          color={pierce === "no" ? "inherit" : "#50A552"}
          value={pierce}
        />
      )}
      {dispel && (
        <AbilityAttribute
          heading="DISPELLABLE: "
          color={dispel === "yes" ? "inherit" : "#c91212"}
          value={dispel}
        />
      )}
    </div>
  );
};
export default AbilityAttributes;

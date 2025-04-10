import { HeroAbility } from "../types/matchData";

type TalentImgProps = {
  ability: { id: number | string };
  talents: HeroAbility[][];
  width: number | string;
};
const TalentImg = (props: TalentImgProps) => {
  const talents = props.talents.filter(
    (arr) => +arr[arr.length - 1]["id"] === +props.ability["id"]
  )[0];
  return (
    <div
      className="small-talents talents"
      style={{ width: props.width, height: props.width }}
    >
      {[...talents].map((x, i: number) => {
        const side = x["slot"]! % 2 !== 0 ? "r-talent" : "l-talent";
        let lvl = 0;
        if (x["slot"]! < 2) {
          lvl = 10;
        } else if (x["slot"]! < 4) {
          lvl = 15;
        } else if (x["slot"]! < 6) {
          lvl = 20;
        } else {
          lvl = 25;
        }
        return <div key={i} className={"lvl" + lvl + " " + side}></div>;
      })}
    </div>
  );
};

// if talent['slot'] < 2:
// level = 10
// elif talent['slot'] < 4:
// level = 15
// elif talent['slot'] < 6:
// level = 20
// else:
// level = 25
export default TalentImg;

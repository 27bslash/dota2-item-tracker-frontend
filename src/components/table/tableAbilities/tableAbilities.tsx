import { usePageContext } from "../../stat_page/pageContext";
import TalentTooltip from "../../tooltip/talentTooltip";
import Tip from "../../tooltip/tooltip";
import { HeroAbility } from "../../types/matchData";
import TalentImg from "../talentImg";
import { AbilityImg } from "./abilityImg";
import { Facet } from "./facet";

type AbilitiesProps = {
  abilities: HeroAbility[];
  imageHost: string;
  width: string;
  visitedTalents: HeroAbility[][];
  variant?: number;
};

export const Abilities = ({
  abilities,
  imageHost,
  width,
  visitedTalents,
  variant,
}: AbilitiesProps) => {
  const len = abilities.length + 1;
  const imgWidth = Math.floor((+width - 50) / len);
  const { heroData } = usePageContext();
  return (
    <div className="abilities" style={{ alignItems: "flex-end" }}>
      {!!Object.keys(heroData).length && <Facet variant={variant} imgWidth={imgWidth}></Facet>}
      {abilities.map((ability, i: number) => {
        const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.img}.png`;
        return (
          <div className="ability-image-wrapper" key={i}>
            <strong>
              <p style={{ color: "white", textAlign: "center" }}>
                {ability["level"]}
              </p>
            </strong>
            {ability["type"] === "ability" && (
              <AbilityImg
                link={link}
                ability={ability}
                key={i}
                imgWidth={imgWidth}
              />
            )}
            {
              // talents have to be changed here
              ability["type"] === "talent" && (
                <Tip component={<TalentTooltip talent={ability} />}>
                  <TalentImg
                    width={imgWidth * 1.1}
                    talents={visitedTalents}
                    ability={ability}
                  ></TalentImg>
                </Tip>
              )
            }
          </div>
        );
      })}
    </div>
  );
};

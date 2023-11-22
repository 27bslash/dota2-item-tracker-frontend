import TalentTooltip from "../../tooltip/talentTooltip";
import Tip from "../../tooltip/tooltip";
import TalentImg from "../talentImg";
import { AbilityImg } from "./abilityImg";

export const Abilities = (props: { abilities: any; heroData: any; imageHost: string; width: string, heroName: string, visitedTalents: any[] }) => {
    const { abilities, heroData, imageHost, width, heroName, visitedTalents } = props
    return (
        <div className="abilities">
            {abilities.map((ability: any, i: number) => {
                const len = abilities.length;
                const imgWidth = Math.floor((+width - 50) / len)
                const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.img}.png`

                return (
                    <div className="ability-image-wrapper" key={i}>
                        <strong><p style={{ color: 'white', textAlign: 'center' }}>{ability['level']}</p></strong>
                        {
                            ability['type'] === 'ability' &&
                            <AbilityImg link={link} heroData={heroData} heroName={heroName} ability={ability} key={i} imgWidth={imgWidth} />
                        }
                        {
                            // talents have to be changed here
                            ability['type'] === 'talent' &&
                            <Tip component={<TalentTooltip talent={ability} />}>
                                <TalentImg width={imgWidth * 1.2} talents={visitedTalents} ability={ability}></TalentImg>
                            </Tip>
                        }
                    </div>
                )
            })}
        </div>
    )
}
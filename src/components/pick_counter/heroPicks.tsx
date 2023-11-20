import colourWins from "../../utils/colourWins";
import PickStats, { PickRoleStat } from "../types/pickStats";
import { BoldName } from "./pickCounter";
type HeroPickProps = {
    base: PickStats | PickRoleStat,
    role: string,
    reset: () => void,
    name: string;
    color: string;
}
export const HeroPicks = ({ base, role, name, color, reset }: HeroPickProps) => {
    return (
        role ? (
            <>
                <BoldName reset={reset} name={name} color={color} />
                <p>was picked {base['picks']} times in {role} with a  <span style={{ color: colourWins(base['winrate']), marginRight: '5px' }}>
                    {base['winrate']}%
                </span>
                    winrate.
                </p>
            </>
        ) : (
            <>
                <BoldName reset={reset} name={name} color={color} />
                <p>was picked {base['picks']} times with a win rate of <span style={{ color: colourWins(base['winrate']), marginRight: '5px' }}>
                    {base['winrate']}%
                </span>
                    {"it's mostly played"}:
                </p>
            </>
        )
    )
}
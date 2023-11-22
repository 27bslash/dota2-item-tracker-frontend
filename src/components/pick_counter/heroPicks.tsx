import colourWins from "../../utils/colourWins";
import PickStats, { PickRoleStat } from "../types/pickStats";
import { BoldName } from "./pickCounter";
import { usePickCounterContext } from "./pickCounterContext";
type HeroPickProps = {
    base: PickStats | PickRoleStat,
}
export const HeroPicks = ({ base }: HeroPickProps) => {
    const { role, nameParam, heroColor, reset, updateMatchData } = usePickCounterContext()

    return (
        role ? (
            <>
                <BoldName reset={reset} name={nameParam} color={heroColor} />
                <p>was picked {base['picks']} times in {role} with a  <span style={{ color: colourWins(base['winrate']), marginRight: '5px' }}>
                    {base['winrate']}%
                </span>
                    winrate.
                </p>
            </>
        ) : (
            <>
                <BoldName reset={reset} name={nameParam} color={heroColor} />
                <p>was picked {base['picks']} times with a win rate of <span style={{ color: colourWins(base['winrate']), marginRight: '5px' }}>
                    {base['winrate']}%
                </span>
                    {"it's mostly played"}:
                </p>
            </>
        )
    )
}
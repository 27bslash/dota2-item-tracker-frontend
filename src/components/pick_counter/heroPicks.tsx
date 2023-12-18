import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colourWins from "../../utils/colourWins";
import PickStats, { PickRoleStat } from "../types/pickStats";
import { BoldName } from "./pickCounter";
import { usePickCounterContext } from "./pickCounterContext";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useParams } from "react-router";
import { cleanDecimal } from "../../utils/cleanDecimal";

type HeroPickProps = {
    base: PickStats | PickRoleStat,
}
export const HeroPicks = ({ base }: HeroPickProps) => {
    const { role, nameParam, heroColor, reset, updateMatchData } = usePickCounterContext()
    const params = useParams()
    const picks = params['patch'] ? base['patch_picks'] : base['picks']
    const wins = params['patch'] ? base['patch_wins'] : base['wins']
    const winrate = cleanDecimal(wins / picks * 100)
    return (
        role ? (
            <>
                <FontAwesomeIcon color={heroColor} icon={faArrowRight} style={{ transform: 'rotate(-180deg)', alignSelf: 'center' }} />
                <BoldName reset={reset} name={nameParam} color={heroColor} />
                <p>was picked {picks} times in {role} with a  <span style={{ color: colourWins(winrate), marginRight: '5px' }}>
                    {winrate}%
                </span>
                    winrate.
                </p>
            </>
        ) : (
            <>
                <BoldName reset={reset} name={nameParam} color={heroColor} />
                <p>was picked {picks} times with a win rate of <span style={{ color: colourWins(winrate), marginRight: '5px' }}>
                    {winrate}%
                </span>
                    {"it's mostly played"}:
                </p>
            </>
        )
    )
}
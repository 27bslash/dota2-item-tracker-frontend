import TalentImg from "../../table/talentImg"
import TalentTooltip from "../../tooltip/talentTooltip"
import Tip from "../../tooltip/tooltip"
import { NonProDataType } from "../builds/build"
import { mostUsedTalents } from "./talentLevels"
import { Box, Typography } from '@mui/material';
import { usePageContext } from "../../stat_page/pageContext"

export const TalentBuild = (props: { matchData: NonProDataType[], heroData: any, numbered?: boolean }) => {
    const mostUsedTals = mostUsedTalents(props.matchData)
    const { heroData, nameParam } = usePageContext()
    const heroTalents = heroData[nameParam]['talents']
    const visitedTalents: any = []
    const s = new Set()
    for (const talent of mostUsedTals) {
        const t = []
        const talentKey = talent[0]
        if (!s.has(talentKey)) {
            s.add(talentKey)
            const newA = Array.from(s)
            for (const _id of newA) {
                const f = mostUsedTals.filter((x: any) => _id === x[0])
                t.push({ img: f[0][0], type: 'talent', ...f[0][1] })
            }
        }
        visitedTalents.push(t)
    }
    const height = props.numbered ? '83px' : '54.45px'
    return (
        <div className="flex" style={{ height: height }}>
            {mostUsedTals.map((talentObj, i) => {
                const talentId = talentObj[1]['id']
                const talentDetails = heroTalents[talentId]
                if (talentDetails) {
                    const talentName = talentDetails['name_loc']
                    return (
                        <Box key={i} padding={0.5}>
                            <Typography color='white' align="center">{talentObj[1]['level']}</Typography>

                            <Tip component={<TalentTooltip talent={{ 'key': talentName }} />}>
                                <TalentImg talents={visitedTalents} width='65px' ability={talentDetails}></TalentImg>
                            </Tip>
                            <Typography color='white' align="center">{talentObj[1]['perc']}%</Typography>
                        </Box>
                    )
                }
            })}
        </div>
    )
}
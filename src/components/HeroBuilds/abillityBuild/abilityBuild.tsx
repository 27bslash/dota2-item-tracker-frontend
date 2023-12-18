import { Box, Button, Typography } from '@mui/material';
import { MatchDataAdj } from '../../stat_page/page';
import { TalentBuild } from './talentBuild';
import { useState } from 'react';
import { AbilityImg } from '../../table/tableAbilities/abilityImg';
import { AbilityBuildEntry } from '../builds/buildCell';
import { usePageContext } from '../../stat_page/pageContext';
import { NonProDataType } from '../builds/build';
interface AbilityBuildProps extends MatchDataAdj {
    data: NonProDataType[],
    abilityBuilds: AbilityBuildEntry[],
}
const AbilityBuilds = ({ data, abilityBuilds }: AbilityBuildProps) => {
    const imageHost = "https://ailhumfakp.cloudimg.io/v7/"
    // const secAbilities = abilityFilter(data, fistAB)
    // console.log(abilities)
    const [debug, setShowDebug] = useState(false)
    const { heroData, nameParam } = usePageContext()
    const DEBUG = process.env.NODE_ENV !== 'production'
    return (
        <Box justifyContent='space-between' padding={4} className='ability-builds flex'>
            {/* <div className='ability-build flex'>
                {abilities[1].map((ability: {}, i: number) => {
                    const key = Object.keys(ability)[0]
                    const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${key}.png`
                    return (
                        <AbilityImg link={link} imgWidth={55} ability={ability} heroData={heroData} heroName={nameParam} key={i} />)
                })}
                <BigTalent matchData={data} heroName={nameParam} heroData={heroData} width='65px' margin='-5px 0px 0px 0px' />
            </div> */}
            <div className="ability-build">
                <Typography color='white' align='center' alignItems={'center'} variant='h4'>Abilities</Typography>
                {abilityBuilds.map((abilityArr, i) => {
                    const debugMargin = i === 0 ? '20px' : '0px'
                    return (
                        <div style={{ alignItems: 'center', paddingBottom: '5px' }} key={i}>
                            <div className="ability-build flex" style={{ alignItems: 'center' }}>
                                <AbilityBuild abilityArr={abilityArr[0]} imageHost={imageHost} heroData={heroData} heroName={nameParam} i={i}></AbilityBuild>
                                {/* <BigTalent matchData={data} heroName={nameParam} heroData={heroData} width='65px' margin='-5px 0px 0px 0px' updateMatchData={updateMatchData} />  */}
                                <Typography style={{ marginTop: debugMargin, color: 'white', marginLeft: '6px' }}>{DEBUG ? abilityArr[1] : ''} {(abilityArr[1] / data.length * 100).toFixed(2)}%</Typography>
                                {DEBUG &&
                                    <Button sx={{ marginTop: debugMargin }} onClick={() => setShowDebug((prev) => !prev)}>debug</Button>
                                }
                            </div>
                            {DEBUG && debug && abilityArr[2] &&
                                <div className="debug-builds">
                                    {abilityArr[2].map((debugAbArr, k: number) => {
                                        return (
                                            <div key={k} className="flex">
                                                <AbilityBuild abilityArr={debugAbArr[0]} imageHost={imageHost} heroData={heroData} heroName={nameParam} i={1}></AbilityBuild>
                                                <Typography style={{ color: 'white', marginLeft: '6px' }}>{debugAbArr[1]} {(debugAbArr[1] / abilityArr[1] * 100).toFixed(2)}%</Typography>
                                            </div>
                                        )
                                    })}

                                </div>
                            }
                        </div>
                    )
                })
                }
            </div>
            <div className="talent-build">
                <Typography variant='h4' color='white' align='center'>Talents</Typography>
                <TalentBuild matchData={data} heroData={heroData} numbered={true}></TalentBuild>
            </div>
        </Box >
    )
}
type AbilitBuildProps = {
    abilityArr: string,
    imageHost: string,
    heroData: any,
    heroName: string,
    i: number
}
const AbilityBuild = ({ abilityArr, imageHost, i }: AbilitBuildProps) => {
    return (
        <>
            {abilityArr.split('__').map((ability: string, idx: number) => {
                const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`
                const abilityObj = { [ability]: 0 }
                return (
                    <div key={idx}>
                        {i === 0 &&
                            <Typography align='center' color={'white'}>{idx + 1}</Typography>
                        }
                        <AbilityImg link={link} imgWidth={55} ability={abilityObj} key={idx} />
                    </div>
                )
            })}
        </>
    )
}
export default AbilityBuilds
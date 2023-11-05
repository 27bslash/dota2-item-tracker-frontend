import { Box, Typography } from '@mui/material';
import BigTalent from '../../big_talent/bigTalent';
import { AbilityImg } from '../../table/tableItems';
import { MatchDataAdj } from './../../page';
import { TalentBuild } from './talentBuild';

interface AbilityBuildProps extends MatchDataAdj {
    heroName: string,
    data: any,
    abilityBuilds: { [key: string]: any }[][]
    heroData: any
}
const AbilityBuild = (props: AbilityBuildProps) => {
    const imageHost = "https://ailhumfakp.cloudimg.io/v7/"
    // const secAbilities = abilityFilter(props.data, fistAB)
    // console.log(abilities)
    return (
        <Box justifyContent='space-between' padding={4} className='ability-builds flex'>
            {/* <div className='ability-build flex'>
                {abilities[1].map((ability: {}, i: number) => {
                    const key = Object.keys(ability)[0]
                    const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${key}.png`
                    return (
                        <AbilityImg link={link} imgWidth={55} ability={ability} heroData={props.heroData} heroName={props.heroName} key={i} />)
                })}
                <BigTalent matchData={props.data} heroName={props.heroName} heroData={props.heroData} width='65px' margin='-5px 0px 0px 0px' />
            </div> */}
            <div className="ability-build">
                <Typography color='white' align='center' variant='h4'>Abilities</Typography>
                {props.abilityBuilds[0].map((abilityArr, i) => {
                    return (
                        <div className="flex" style={{ alignItems: 'center', paddingBottom: '5px' }} key={i}>
                            {abilityArr[0].split('__').map((ability: string, idx: number) => {
                                const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`
                                const abilityObj = { [ability]: 0 }
                                return (
                                    <div key={idx}>
                                        {i === 0 &&
                                            <Typography align='center' color={'white'}>{idx + 1}</Typography>
                                        }
                                        <AbilityImg link={link} imgWidth={55} ability={abilityObj} heroData={props.heroData} heroName={props.heroName} key={idx} />
                                    </div>
                                    // <div className="terst"></div>)
                                )
                            })}
                            {/* <BigTalent matchData={props.data} heroName={props.heroName} heroData={props.heroData} width='65px' margin='-5px 0px 0px 0px' updateMatchData={props.updateMatchData} />  */}
                            <Typography style={{ color: 'white', marginLeft: '6px' }}>{(abilityArr[1] / props.data.length * 100).toFixed(2)}%</Typography>
                        </div>
                    )
                })
                }
            </div>
            <div className="talent-build">
                <Typography variant='h4' color='white' align='center'>Talents</Typography>
                <TalentBuild matchData={props.data} heroData={props.heroData} numbered={true}></TalentBuild>
            </div>
        </Box>
    )
}
export default AbilityBuild
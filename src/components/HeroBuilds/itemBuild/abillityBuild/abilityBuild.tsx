import BigTalent from '../../../big_talent/bigTalent';
import { AbilityImg } from '../../../table/tableItems';
import abilityFilter from './abilityFiltering';

const AbilityBuild = (props: any) => {
    const abilities = abilityFilter(props.data)
    const imageHost = "https://ailhumfakp.cloudimg.io/v7/"
    // const secAbilities = abilityFilter(props.data, fistAB)
    // console.log(abilities)
    return (
        <>
            {/* <div className='ability-build flex'>
                {abilities[1].map((ability: {}, i: number) => {
                    const key = Object.keys(ability)[0]
                    const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${key}.png`
                    return (
                        <AbilityImg link={link} imgWidth={55} ability={ability} heroData={props.heroData} heroName={props.heroName} key={i} />)
                })}
                <BigTalent matchData={props.data} heroName={props.heroName} heroData={props.heroData} width='65px' margin='-5px 0px 0px 0px' />
            </div> */}
            <div className="">
                {abilities[0].map((abilityArr, i) => {
                    return (
                        <div className="flex" key={i}>
                            {abilityArr[0].split('__').map((ability: string, i: number) => {
                                const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`
                                const abilityObj = { [ability]: 0 }
                                return (
                                    <AbilityImg link={link} imgWidth={55} ability={abilityObj} heroData={props.heroData} heroName={props.heroName} key={i} />
                                    // <div className="terst"></div>)
                                )
                            })}
                            <BigTalent matchData={props.data} heroName={props.heroName} heroData={props.heroData} width='65px' margin='-5px 0px 0px 0px' />
                            <p style={{ color: 'white' }}>{abilityArr[1]}</p>
                        </div>
                    )
                })
                }
            </div>
        </>
    )
}
export default AbilityBuild
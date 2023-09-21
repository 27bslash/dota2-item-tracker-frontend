import HeroImg from './heroImg';
import Nav from './nav/nav';
import CustomTable from './table/table';
import BestGames from './best_games/bestGames';
import { useEffect, useState } from 'react';
import { FormControlLabel, styled, Switch, SwitchProps, Typography } from '@mui/material';
import TableSearch from './table/table_search/table_search';
import { useParams } from 'react-router';
import heroSwitcher from '../utils/heroSwitcher';
import MostUsed from './most_used/mostUsed';
import BigTalent from './big_talent/bigTalent';
import { useSearchParams } from 'react-router-dom';
import PickCounter from './pick_counter/pickCounter';
import Build from './HeroBuilds/build';
import Items from './types/Item';
import { baseApiUrl } from '../App';
import { fetchData, bulkRequest } from '../utils/fetchData';
import Match from './types/matchData';
import { theme } from '..';
import { generateColorPalette } from '../utils/changeTheme';

//  TODO
//  add chappie section
//  item guides 
//  on search reset page
//  talent search
//  player search substitute numbers for letters
//  fix search style
//  lazyload images
//  get items from github for tooltips
//  lone druid bear items

interface pageProps {
    type: string,
    heroList: any,
    playerList?: any,
    palette?: string
}
interface SearchRes {
    items?: { string: { matches: Match[] } },
    draft?: { string: { matches: Match[] } },
    role?: { string: { matches: Match[] } },
    player?: { string: { matches: Match[] } },
    talents?: { string: { matches: Match[] } }
}
export interface MatchDataAdj {
    updateMatchData: (data: Match[], searchValue?: {
        [key: string]: { matches: Match[] }
    }, types?: string[]) => void,
    matchData?: Match[],
    totalMatchData?: Match[],
    filteredData?: Match[]
}
const Page = (props: pageProps) => {
    const [itemData, setItemData] = useState<Items>()
    const [showStarter, setShowStarter] = useState(false)
    const [filteredData, setFilteredData] = useState<Match[]>([])
    const [totalMatchData, setTotalMatchData] = useState<Match[]>([])
    const [totalPicks, setTotalPicks] = useState<any>([])
    const [heroColor, setHeroColor] = useState('')
    const [count, setCount] = useState(0)
    let t = useParams()
    const [query] = useSearchParams();
    const role = query.get('role') || ''
    const [Role, setRole] = useState(role)
    const [heroData, setHeroData] = useState<any>({})
    const nameParam = t['name'] ? heroSwitcher(t['name']) : ''
    const [searchRes, setSearchRes] = useState<SearchRes>()
    const [visited, setVisited] = useState<any>(new Set())
    const [total, setTotal] = useState<any>([])
    const [patch, setPatch] = useState<{ 'patch': string, 'patch_timestamp': number }>()
    const updateStarter = () => {
        setShowStarter(prev => !prev)
    }
    // const { type, setColorPaletteType } = useContext(colorPaletteContext)

    useEffect(() => {
        document.title = heroSwitcher(nameParam);
        (async () => {
            const matchDataUrl = props.type === 'hero' ? 'https://0f2ezc19w3.execute-api.eu-west-2.amazonaws.com/dev/' : baseApiUrl
            let url = `${matchDataUrl}${props.type}/${nameParam}/react-test?skip=0&length=10`
            if (role) {
                url = `${matchDataUrl}${props.type}/${nameParam}/react-test?role=${role}&skip=0&length=10`
            }
            const countDocsUrl = `${baseApiUrl}hero/${nameParam}/count_docs?collection=heroes`
            const matches = await fetchData(url)
            setFilteredData(matches['data'])
            const docLength = await fetchData(countDocsUrl)
            setTotalPicks(matches['picks'])
            let allMatches
            if (docLength > 15 && props.type === 'hero') {
                // const worker = new Worker('./fetchData.ts')
                allMatches = await bulkRequest(`${matchDataUrl}${props.type}/${nameParam}/react-test`, docLength)
                const merged = allMatches.map((x: { [x: string]: any; }) => x['data']).flat()
                setTotalMatchData(merged)
            } else if (docLength <= 10 && props.type === 'hero') {
                setTotalMatchData(matches['data'])
            } else {
                allMatches = await fetchData(`${matchDataUrl}${props.type}/${nameParam}/react-test`)
                setTotalMatchData(allMatches['data'])
            }
            const currentPatch = await fetchData(`${baseApiUrl}files/patch`)
            setPatch(currentPatch)
            setShowPatchMsg(!allMatches.find((match: any) => match['unix_time'] <= currentPatch['patch_timestamp']))
            const itemData = await fetchData(`${baseApiUrl}files/items`)
            setItemData(itemData)
        })()
    }, [])
    useEffect(() => {
        if (Role) {
            const data = totalMatchData.filter((match: { role: string }) => match.role === Role)
            setFilteredData(data)
            setCount(data.length)
        } else {
            setFilteredData(totalMatchData)
            setCount(totalMatchData.length)
        }
    }, [totalMatchData])
    useEffect(() => {
        (async () => {
            const sett: Set<string> = new Set()

            if (props.type !== 'player') {
                const hData = await fetch(`${baseApiUrl}files/hero-data/${nameParam}`)
                const hJson = await hData.json()
                setHeroData({ [nameParam]: hJson })
            } else {
                for (let match of totalMatchData) {
                    sett.add(match['hero'])
                }
                setVisited(sett)
            }
        }
        )()
    }, [totalMatchData])
    async function getHeroData(hero: string) {
        const hData = await fetch(`${baseApiUrl}files/hero-data/${hero}`)
        const hJson = await hData.json()
        const o = heroData
        o[hero] = hJson
        setHeroData(o)
    }
    useEffect(() => {
        for (let hero of visited) {
            if (!total.includes(hero)) {
                getHeroData(hero)
                setTotal((prev: any) => [...prev, hero])
            }
        }
    }, [visited])
    useEffect(() => {
        (async () => {
            if (props.type === 'hero') {
                const hc = await fetch(`${baseApiUrl}files/colors`)
                const json = await hc.json()
                for (let i of json['colors']) {
                    let targetHero = nameParam
                    if (targetHero === 'earth_spirit') targetHero = 'undying'
                    const badReds = ['ursa', 'lion']
                    const badBrowns = ['dragon_knight', 'bristleback', 'monkey_king',]
                    if (badReds.includes(i['hero'])) targetHero = 'doom_bringer'
                    if (badBrowns.includes(i['hero'])) targetHero = 'gyrocopter'
                    if (nameParam === 'ember_spirit' || nameParam === 'rattletrap') targetHero = 'clinkz'
                    if (nameParam === 'abyssal_underlord') targetHero = 'muerta'
                    if (i['hero'] !== targetHero) continue
                    setHeroColor(`rgb(${i['color'][0]}, ${i['color'][1]}, ${i['color'][2]})`)
                    const colorSUm = i['uncontrasted'][1] + i['uncontrasted'][2]
                    const greenRatio = i['uncontrasted'][1] / colorSUm
                    if ((Math.max(...i['uncontrasted']) === i['uncontrasted'][1] ||
                        Math.max(...i['uncontrasted']) - 50 <= i['uncontrasted'][1])
                        && i['uncontrasted'][1] - i['uncontrasted'][2] > 50 && (greenRatio > 0.6 || i['uncontrasted'][1] > 170)) {
                        continue
                    }
                    generateColorPalette([i['uncontrasted'][0], i['uncontrasted'][1], i['uncontrasted'][2]], targetHero, props.options);

                }
            } else {
                setHeroColor('player')
            }
        })()
    }, [])

    const updateMatchData = (data: Match[], searchValue?: {
        [key: string]: { matches: Match[] }
    }, types?: string[]) => {
        // setMatchData(data) ]
        if (!data.length) return
        setFilteredData(data)
        // props.updateFilteredData(data)
        setCount(data.length)
        if (searchValue) {
            setSearchRes(searchValue)
        } else {
            setSearchRes(undefined)
        }
    }
    const updateRole = (role: string) => {
        setRole(role)
        // setFilteredData([...filteredData].filter((x) => x.role === role))
    }
    const filterByPatch = () => {
        const patchFilteredData = filteredData.filter((match) => match['unix_time'] >= patch!['patch_timestamp'])
        setTotalMatchData(patchFilteredData)
        setFilteredData(patchFilteredData)
        setCount(totalMatchData.length)
    }
    return (
        <div className="page" >
            {heroColor &&
                <>
                    <Nav playerList={props.playerList} heroList={props.heroList} />
                    <>
                        {patch && totalMatchData.find((match: any) => match['unix_time'] <= patch['patch_timestamp']) &&
                            <Typography align='center' color={'white'} onClick={() => filterByPatch()}>Filter matches by new patch</Typography>
                        }
                        <div className="flex" style={{ 'minHeight': '87px' }}>
                            {props.type === 'hero' &&
                                <>
                                    <div className="hero-img-wrapper" >
                                        <HeroImg baseApiUrl={baseApiUrl} heroData={heroData} heroName={nameParam} />
                                        <MostUsed baseApiUrl={baseApiUrl} matchData={totalMatchData} role={Role} updateMatchData={updateMatchData} itemData={itemData}></MostUsed>
                                    </div>
                                    <BestGames matchData={filteredData} totalMatchData={totalMatchData} updateRole={updateRole}></BestGames>
                                    {!!Object.keys(heroData).length && !!filteredData.length && props.type === 'hero' &&
                                        <BigTalent totalMatchData={totalMatchData} matchData={filteredData} heroData={heroData} heroName={nameParam} width='100px' margin='2% 0px 0px 230px' updateMatchData={updateMatchData} />
                                    }
                                </>
                            }
                        </div>
                        <div style={{ 'minHeight': '45px', marginTop: '20px' }}>
                            {!!heroData && itemData && nameParam && props.type === 'hero' && !!filteredData.length &&
                                <Build baseApiUrl={baseApiUrl} role={Role} picks={totalPicks} searchRes={searchRes}
                                    data={filteredData} heroData={heroData} heroName={nameParam} itemData={itemData} updateMatchData={updateMatchData} />
                            }
                        </div>
                        <>
                            <div className="flex" style={{ 'width': '100%', minHeight: '53px' }}>
                                <PickCounter type={props.type} nameParam={nameParam} role={Role} heroColor={heroColor} matchData={totalMatchData} searchRes={searchRes}
                                    count={count} filteredData={filteredData} totalPicks={totalPicks} updateRole={updateRole} updateMatchData={updateMatchData} />
                            </div>
                            <div className="flex">
                                <StarterToggle updateStarter={updateStarter} />
                                <TableSearch type={props.type} disabled={filteredData.length === 0 || !itemData || !props.heroList}
                                    heroName={nameParam} heroList={props.heroList} playerList={props.playerList}
                                    itemData={itemData} totalMatchData={totalMatchData} role={Role}
                                    updateMatchData={updateMatchData} />
                            </div>
                        </>
                        <CustomTable
                            baseApiUrl={baseApiUrl}
                            type={props.type} role={Role}
                            filteredData={filteredData} heroData={heroData} count={count} updateMatchData={updateMatchData}
                            totalMatchData={totalMatchData} nameParam={nameParam} heroList={props.heroList} itemData={itemData}
                            showStarter={showStarter} />
                    </>

                </>
            }
        </div>
    )
}







const ToggleSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        '&.Mui-checked': {
            // transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : 'secondary',
                opacity: 1,

            },
            '&.Mui-disabled + .MuiSwitch-track': {
                backgroundColor: 'red',
            },
        },
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#606060',
        opacity: 1,
    }
}))

const StarterToggle = (props: any) => {
    return (
        <div className="starter-toggle">
            <FormControlLabel
                value="start"
                control={<ToggleSwitch color="success" onChange={props.updateStarter} />}
                label="Starting Items"
                labelPlacement="start"
                sx={{ padding: '4px 0px 4px 8px', backgroundColor: theme.palette.primary.main, borderRadius: '5px', border: ' solid 2px black', margin: '0', marginRight: 'auto', }}
            />
        </div>
    )
}
export default Page

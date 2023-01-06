import HeroImg from './heroImg';
import Nav from './nav/nav';
import CustomTable from './table/table';
import BestGames from './best_games/bestGames';
import { useEffect, useState } from 'react';
import { CircularProgress, FormControlLabel, styled, Switch, SwitchProps } from '@mui/material';
import TableSearch from './table/table_search/table_search';
import { useParams } from 'react-router';
import heroSwitcher from './heroSwitcher';
import MostUsed from './most_used/mostUsed';
import BigTalent from './big_talent/bigTalent';
import { useSearchParams } from 'react-router-dom';
import PickCounter from './pick_counter/pickCounter';

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
    baseApiUrl: string,
    heroList: any,
    playerList?: any
}
interface SearchRes {
    items: {},
    draft: {},
    role: {},
    player: {}
}
const Page = (props: pageProps) => {
    const [itemData, setItemData] = useState()
    const [showStarter, setShowStarter] = useState(false)
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [totalMatchData, setTotalMatchData] = useState<any[]>([])
    const [totalPicks, setTotalPicks] = useState<any>([])
    const [heroColor, setHeroColor] = useState('')
    const [count, setCount] = useState(0)
    let t = useParams()
    const [query] = useSearchParams();
    const role = query.get('role') || ''
    const [Role, setRole] = useState(role)
    const [heroData, setHeroData] = useState<any[]>([])
    const nameParam = heroSwitcher(t['name'])
    const [searchRes, setSearchRes] = useState<SearchRes>()
    const [visited, setVisited] = useState<any>(new Set())
    const [total, setTotal] = useState<any>([])

    const updateStarter = () => {
        setShowStarter(prev => !prev)
    }
    const baseApiUrl = 'https://dota2-item-tracker.onrender.com/'
    const getAllMatches = async () => {
        const data = await fetch(`${props.baseApiUrl}${props.type}/${nameParam}/react-test`)
        let json = await data.json()
        return json['data']
    }

    useEffect(() => {
        document.title = nameParam;
        (async () => {
            let url = `${props.baseApiUrl}${props.type}/${nameParam}/react-test?skip=0&length=10`
            if (role) {
                url = `${props.baseApiUrl}${props.type}/${nameParam}/react-test?role=${role}&skip=0&length=10`
            }
            const data = await fetch(url)
            let json = await data.json()
            setFilteredData(json['data'])
            setTotalPicks(json['picks'])
            const d = await getAllMatches()
            setTotalMatchData(d)
            const itemData = await fetch(`${props.baseApiUrl}files/items`)
            const itemJson = await itemData.json()
            setItemData(itemJson)
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
                const hData = await fetch(`${props.baseApiUrl}files/hero-data/${nameParam}`)
                const hJson = await hData.json()
                setHeroData([{ [nameParam]: hJson }])
            } else {
                for (let match of filteredData) {
                    sett.add(match['hero'])
                }
                setVisited(sett)
            }
        }
        )()
    }, [totalMatchData])
    async function getHeroData(hero: string) {
        const hData = await fetch(`${props.baseApiUrl}files/hero-data/${hero}`)
        const hJson = await hData.json()
        setHeroData((prev: any) => [...prev, { [hero]: hJson }])
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
                    if (i['hero'] === nameParam) {
                        setHeroColor(`rgb(${i['color'][0]}, ${i['color'][1]}, ${i['color'][2]})`)
                    }
                }
            }
        })()
    }, [])
    const f = () => {

    }
    const updateMatchData = (data: object[], searchValue?: any, type?: string[],) => {
        // setMatchData(data) ]
        if (!data.length) return
        setFilteredData(data)
        // props.updateFilteredData(data)
        setCount(data.length)
        if (searchValue) {
            setSearchRes(searchValue)
        }
    }
    const updateRole = (role: string) => {
        setRole(role)
    }
    return (
        <div className="page" >
            <Nav baseApiUrl={props.baseApiUrl} playerList={props.playerList} heroList={props.heroList} />
            {(!Boolean(filteredData.length)) &&
                <CircularProgress sx={{ width: '100px', 'position': 'absolute' }} />
            }
            {!!filteredData.length &&
                <>
                    <div className="flex" style={{}}>
                        {props.type === 'hero' &&
                            <>
                                <div className="hero-img-wrapper">
                                    <HeroImg baseApiUrl={props.baseApiUrl} heroData={heroData} heroName={nameParam} heroColor={heroColor} />
                                    <MostUsed baseApiUrl={props.baseApiUrl} matchData={totalMatchData} role={Role} updateMatchData={updateMatchData} itemData={itemData}></MostUsed>
                                </div>
                                <div className="best-games-container" style={{ 'width': '1200px', 'height': '140px' }}>
                                    <BestGames matchData={filteredData} totalMatchData={totalMatchData}></BestGames>
                                </div>
                                {heroData.length && !!filteredData.length &&
                                    <BigTalent matchData={filteredData} heroData={heroData} heroName={nameParam} />
                                }
                            </>
                        }
                    </div>
                    <>
                        <div className="flex" style={{ 'width': '100%' }}>
                            <PickCounter type={props.type} nameParam={nameParam} role={Role} heroColor={heroColor} matchData={totalMatchData} searchRes={searchRes}
                                count={count} filteredData={filteredData} totalPicks={totalPicks} updateRole={updateRole} updateMatchData={updateMatchData} />
                        </div>
                        <div className="flex">
                            <StarterToggle updateStarter={updateStarter} />
                            <TableSearch type={props.type} disabled={filteredData.length === 0 || !itemData || !props.heroList}
                                heroName={nameParam} heroList={props.heroList} playerList={props.playerList}
                                itemData={itemData} totalMatchData={filteredData}
                                updateMatchData={updateMatchData} />
                        </div>
                        <CustomTable
                            baseApiUrl={props.baseApiUrl}
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
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
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
                control={<ToggleSwitch color="primary" onChange={props.updateStarter} />}
                label="Starting Items"
                labelPlacement="start"
                sx={{ padding: '4px 0px 4px 8px', backgroundColor: '#424242', color: '#e1e1e1', borderRadius: '5px', border: ' solid 2px black', margin: '0', marginRight: 'auto', }}
            />
        </div>
    )
}
export default Page;

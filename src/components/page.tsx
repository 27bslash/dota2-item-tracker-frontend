import HeroImg from './heroImg';
import Nav from './nav/nav';
import CustomTable from './table/table';
import BestGames from './best_games/bestGames';
import { useEffect, useState } from 'react';
import { FormControlLabel, styled, Switch, SwitchProps, TextField } from '@mui/material';
import TableSearch from './table/table_search/table_search';
import { useParams } from 'react-router';
import heroSwitcher from './heroSwitcher';
import MostUsed from './most_used/mostUsed';
import BigTalent from './big_talent/bigTalent';
import { useSearchParams } from 'react-router-dom';
import PickCounter from './pickCounter';

//  TODO
//  add chappie section
//  postition tooltips
//  item guides 

const Page = (props: any) => {
    const [matchData, setMatchData] = useState<object[]>([])
    const [itemData, setItemData] = useState({})
    const [abilityColors, setAbilityColors] = useState([])
    const [benchmarks, setBenchmarks] = useState<any[]>([])
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
    // console.log(heroData)
    const [heroData, setHeroData] = useState<any>()
    const nameParam = heroSwitcher(t['name'])
    const updateStarter = () => {
        setShowStarter(prev => !prev)
    }
    const baseApiUrl = 'https://dota2-item-tracker.onrender.com/'
    const getAllMatches = async () => {
        const data = await fetch(`${baseApiUrl}${props.type}/${nameParam}/react-test`)
        let json = await data.json()
        setMatchData(json['data'])
        // setFilteredData(json['data'])
        return json['data']
    }
    useEffect(() => {
        (async () => {
            if (props.type !== 'player') {
                let url = ` ${baseApiUrl}files/${nameParam}/best-games`
                if (role) {
                    url = `${baseApiUrl}files/${nameParam}/best-games?role=${Role}`
                }
                const bmarks = await fetch(url)
                const benchmarksJson = await bmarks.json()
                setBenchmarks(benchmarksJson)
            }

            // tooltips load last

        })()
    }, [role])

    useEffect(() => {
        document.title = nameParam;
        (async () => {
            let url = `${baseApiUrl}${props.type}/${nameParam}/react-test?skip=0&length=10`
            if (role) {
                url = `${baseApiUrl}${props.type}/${nameParam}/react-test?role=${role}&skip=0&length=10`
            }
            const data = await fetch(url)
            let json = await data.json()
            setFilteredData(json['data'])
            setTotalPicks(json['picks'])

            const d = await getAllMatches()
            setTotalMatchData(d)
            if (props.role) {
                const data = d.filter((match: any) => match.role === props.role)
                setFilteredData(data)
                setCount(data.length)
            } else {
                setFilteredData(d)
                setCount(d.length)
            }
            const itemData = await fetch(`${baseApiUrl}files/items`)
            const itemJson = await itemData.json()
            setItemData(itemJson)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (props.type === 'hero') {
                const hData = await fetch(`${props.baseApiUrl}/files/hero-data/${nameParam}`)
                const hJson = await hData.json()
                setHeroData(hJson)
            }
        })()
    }, [nameParam])
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
    const updateMatchData = (data: object[]) => {
        // setMatchData(data) ]
        if (!data.length) return
        setFilteredData(data)
        // props.updateFilteredData(data)
        setCount(data.length)
    }
    const updateRole = (role: string) => {
        setRole(role)
    }
    return (
        <div className="page" >
            <Nav baseApiUrl={props.baseApiUrl} heroList={props.heroList} />
            {/* <HeroImg /> */}
            {nameParam &&
                <>
                    <div className="flex" style={{}}>
                        {props.type === 'hero' &&
                            <>
                                <div className="hero-img-wrapper">
                                    <HeroImg baseApiUrl={props.baseApiUrl} heroData={heroData} heroName={nameParam} heroColor={heroColor} />
                                    <MostUsed baseApiUrl={props.baseApiUrl} matchData={totalMatchData} role={Role} updateMatchData={updateMatchData} itemData={itemData}></MostUsed>
                                </div>
                                <div className="best-games-container" style={{ 'width': '1400px', 'height': '140px' }}>
                                    <BestGames matchData={filteredData} ></BestGames>
                                </div>
                                {props.type !== 'player' && heroData &&
                                    <BigTalent matchData={totalMatchData} heroData={heroData} baseApiUrl={props.baseApiUrl} heroName={nameParam} />
                                }
                            </>
                        }
                    </div>
                    <>
                        <div className="flex" style={{ 'width': '100%', height: '50px' }}>
                            <PickCounter type={props.type} nameParam={nameParam} heroColor={heroColor} matchData={totalMatchData}
                                count={count} filteredData={filteredData} totalPicks={totalPicks} updateRole={updateRole} updateMatchData={updateMatchData} />
                        </div>
                        <div className="flex">
                            <StarterToggle updateStarter={updateStarter} />
                            <TableSearch type={props.type} disabled={totalMatchData.length === 0 || !('items' in itemData)} heroName={nameParam} heroList={props.heroList}
                                itemData={itemData} totalMatchData={totalMatchData}
                                updateMatchData={updateMatchData} starter={showStarter} />
                        </div>
                        <CustomTable
                            baseApiUrl={props.baseApiUrl}
                            type={props.type} role={Role}
                            filteredData={filteredData} count={count} updateMatchData={updateMatchData}
                            totalMatchData={totalMatchData} nameParam={nameParam} heroList={props.heroList} itemData={itemData}
                            showStarter={showStarter} />
                    </>

                </>
            }
        </div>
    )
}
const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        '&.Mui-checked': {
            // transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 5,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        transform: 'translateY(-5px)',
        width: 20,
        height: 20,
    },
    '& .MuiSwitch-track': {
        // borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1
    },
}));
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
                sx={{ padding: '4px', backgroundColor: '#424242', color: '#e1e1e1', borderRadius: '5px', border: ' solid 2px black', margin: '0', marginRight: 'auto', }}
            />
        </div>
    )
}
export default Page;

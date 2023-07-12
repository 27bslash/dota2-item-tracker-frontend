import HeroImg from './heroImg';
import Nav from './nav/nav';
import CustomTable from './table/table';
import BestGames from './best_games/bestGames';
import { useEffect, useState } from 'react';
import { FormControlLabel, styled, Switch, SwitchProps } from '@mui/material';
import TableSearch from './table/table_search/table_search';
import { useParams } from 'react-router';
import heroSwitcher from './heroSwitcher';
import MostUsed from './most_used/mostUsed';
import BigTalent from './big_talent/bigTalent';
import { useSearchParams } from 'react-router-dom';
import PickCounter from './pick_counter/pickCounter';
import Build from './HeroBuilds/build';
import Items from './types/Item';
import { baseApiUrl } from '../App';
import { fetchData, bulkRequest } from './fetchData';
import Match from './types/matchData';
import { theme } from '..';

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
    const [heroData, setHeroData] = useState<any[]>([])
    const nameParam = heroSwitcher(t['name'])
    const [searchRes, setSearchRes] = useState<SearchRes>()
    const [visited, setVisited] = useState<any>(new Set())
    const [total, setTotal] = useState<any>([])
    const updateStarter = () => {
        setShowStarter(prev => !prev)
    }
    // const { type, setColorPaletteType } = useContext(colorPaletteContext)

    useEffect(() => {
        document.title = nameParam;
        (async () => {
            let url = `${baseApiUrl}${props.type}/${nameParam}/react-test?skip=0&length=10`
            if (role) {
                url = `${baseApiUrl}${props.type}/${nameParam}/react-test?role=${role}&skip=0&length=10`
            }
            const countDocsUrl = `${baseApiUrl}hero/${nameParam}/count_docs?collection=heroes`
            const matches = await fetchData(url)
            setFilteredData(matches['data'])
            const docLength = await fetchData(countDocsUrl)
            setTotalPicks(matches['picks'])
            let allMatches
            if (docLength > 15 && props.type === 'hero') {
                // const worker = new Worker('./fetchData.ts')
                allMatches = await bulkRequest(`${baseApiUrl}${props.type}/${nameParam}/react-test`, docLength)
                const merged = allMatches.map((x: { [x: string]: any; }) => x['data']).flat()
                setTotalMatchData(merged)
            } else if (docLength <= 10 && props.type === 'hero') {
                setTotalMatchData(matches['data'])
            } else {
                allMatches = await fetchData(`${baseApiUrl}${props.type}/${nameParam}/react-test`)
                console.log(allMatches)
                setTotalMatchData(allMatches['data'])
            }
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
        const hData = await fetch(`${baseApiUrl}files/hero-data/${hero}`)
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
                        const colorSUm = i['uncontrasted'][1] + i['uncontrasted'][2]
                        const greenRatio = i['uncontrasted'][1] / colorSUm
                        if (i['uncontrasted'][1] > 50 && i['uncontrasted'][1] - i['uncontrasted'][2] > 20 && (greenRatio > 0.6 || i['uncontrasted'][1] > 170)) {
                            continue
                        }
                        generateColorPalette([i['uncontrasted'][0], i['uncontrasted'][1], i['uncontrasted'][2]]);
                    }
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
    return (
        <div className="page" >
            {heroColor &&
                <>
                    <Nav playerList={props.playerList} heroList={props.heroList} />
                    <>
                        <div className="flex" style={{}}>
                            {props.type === 'hero' &&
                                <>
                                    <div className="hero-img-wrapper">
                                        <HeroImg baseApiUrl={baseApiUrl} heroData={heroData} heroName={nameParam} />
                                        <MostUsed baseApiUrl={baseApiUrl} matchData={totalMatchData} role={Role} updateMatchData={updateMatchData} itemData={itemData}></MostUsed>
                                    </div>
                                    <BestGames matchData={filteredData} totalMatchData={totalMatchData} updateRole={updateRole}></BestGames>
                                    {heroData.length && !!filteredData.length && props.type === 'hero' &&
                                        <BigTalent totalMatchData={totalMatchData} matchData={filteredData} heroData={heroData} heroName={nameParam} width='100px' margin='2% 0px 0px 230px' updateMatchData={updateMatchData} />
                                    }
                                </>
                            }
                        </div>
                        {!!heroData.length && itemData && nameParam && props.type === 'hero' && !!filteredData.length &&
                            < Build baseApiUrl={baseApiUrl} role={Role} picks={totalPicks} searchRes={searchRes}
                                data={filteredData} heroData={heroData} heroName={nameParam} itemData={itemData} updateMatchData={updateMatchData} />
                        }
                        <>
                            <div className="flex" style={{ 'width': '100%' }}>
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
// Define the source color

// Generate a Material-UI color palette based on the source color
export const generateColorPalette = (sourceColor: string[]) => {

    const colorMap = sourceColor.map((x) => +x <= 255 ? parseInt(x) : 255)
    // console.log('rgba', colorMap)
    let [r, g, b] = [+colorMap[0], +colorMap[1], +colorMap[2]]
    const hsl = RGBToHSL(r, g, b).map((x: any) => parseInt(x))
    const dark = [...hsl]
    const light = [...hsl]
    // console.log(dark)
    dark[2] -= 20
    if (dark[2] <= 20) {
        dark[2] = 20
    }
    // dark[2] = (dark[2] + 100) % 100
    // dark[1] = 50
    // console.log(dark)
    const tableDark = [...dark]
    const tableLight = [...dark]
    dark[0] -= 20
    dark[0] = (dark[0] + 360) % 360
    light[2] = 60
    // console.log('light color', light, dark)
    // console.log(sourceColor)
    const [h, s, l] = dark
    const background = hslToHex(h, s, l)
    tableDark[2] = 15
    // tableDark[1] = 30
    tableLight[2] = 20
    // tableLight[1] = 30
    theme.palette.background.default = background
    document.body.style.background = background

    theme.palette.primary.main = hslToHex(light[0], light[1], light[2])
    theme.palette.secondary.main = hslToHex(light[0], light[1], 45)
    theme.palette.secondary.dark = hslToHex(light[0], light[1], 30)
    theme.palette.table.main = hslToHex(tableDark[0], tableDark[1], tableDark[2])
    theme.palette.table.secondary = hslToHex(tableLight[0], tableLight[1], tableLight[2])
    return {
        background: { default: background },
        primary: theme.palette.primary.main,
        table: {
            main: hslToHex(tableDark[0], tableDark[1], tableDark[2]),
            secondary: hslToHex(tableLight[0], tableLight[1], tableLight[2])
        }
    }

}
const RGBToHSL = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};
function hslToHex(hue: number, saturation: number, lightness: number) {
    // const hue = Math.round(h * 360);
    // const saturation = Math.round(s * 100);
    // const lightness = Math.round(l * 100);

    const hslToRgb = (h: number, s: number, l: number) => {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;

        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
        };
    };

    const { r, g, b } = hslToRgb(hue, saturation / 100, lightness / 100);
    // console.log(r, g, b)
    const toHex = (value: number) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const hexColor = '#' + toHex(r) + toHex(g) + toHex(b);
    return hexColor;
}

// Usage example


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

import { Grid } from "@mui/material";
import ArrowButton from "../ui_elements/arrowButton"
import { theme } from "../..";
import { PickStats } from "./types/pickStats.types";
import Hero from "../types/heroList";

// import { RoleStrings } from "./home";


type PanelProps = {
    sortHeroes: (list: any[], search: string, role?: any) => void,
    winStats: PickStats[];
}
const ControlPanel = ({ sortHeroes, winStats }: PanelProps) => {
    return (
        <ArrowButton transition='fade' style={{ transform: "rotate(-90deg)", position: 'absolute', top: '17%', left: '-20px', backgroundColor: theme.palette.primary.main }}>
            <div className="control-panel">
                <Grid container spacing={0} sx={{ marginLeft: '10px', backgroundColor: 'rgb(58, 61, 61)', width: '270px', zIndex: 5, position: 'absolute', left: '23px', top: '88px' }}>
                    <RoleSelector sortHeroes={sortHeroes} winStats={winStats}></RoleSelector>
                    <Grid item>
                        <div className="flex" style={{ width: '100%', borderTop: '2px solid black' }}>
                            <button onClick={() => sortHeroes(roleSort(winStats, `picks`), 'picks')} className="sort-button">PICKS</button>
                            <button onClick={() => sortHeroes(roleSort(winStats, `winrate`), 'winrate')} className="sort-button">winrate</button>
                            <button onClick={() => sortHeroes(roleSort(winStats, `bans`), 'bans')} className="sort-button">bans</button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </ArrowButton >
    )

}
const roleSort = (stats: any[], field: string) => {
    const filtered = stats.filter((item) => field !== 'winrate' ? item[field] > 0 : item['picks'] > 10);
    const sorted = [...filtered].sort((a, b) => {
        if (field !== 'winrate') {
            return b[field] - a[field]
        } else {
            const winrate1 = a['picks'] ? ((a['wins'] / a['picks']) * 100) : 0
            const winrate2 = b['picks'] ? ((b['wins'] / b['picks']) * 100) : 0
            return winrate2 - winrate1
        }
    })
    return sorted.map((x) => x.hero)

}
type RS = {
    sortHeroes: PanelProps['sortHeroes'],
    winStats: PickStats[]
}
const RoleSelector = ({ sortHeroes, winStats }: RS) => {
    const r2 = ['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support']
    return (
        <>
            {r2.map((x, i) => {
                return (
                    <Grid key={i} item padding={0} sx={{ paddingLeft: '0px', paddingTop: '0px' }}>
                        <button className='sort-button' onClick={() => sortHeroes(roleSort(winStats, `${x}_picks`), 'picks', x)}>{x}</button>
                    </Grid>
                )
            })
            }
        </>
    )
}
export default ControlPanel
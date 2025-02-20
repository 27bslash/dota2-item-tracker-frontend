import { Grid } from "@mui/material";
import ArrowButton from "../ui_elements/arrowButton"
import { theme } from "../../main";
import { PickStats } from "./types/pickStats.types";
import Hero from "../types/heroList";
import { RoleStrings } from "./home";

// import { RoleStrings } from "./home";


type PanelProps = {
    sortHeroes: (list: string[], search: string, role?: RoleStrings) => void,
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
                            <button onClick={() => sortHeroes(roleSort(winStats, `picks`, 'total'), 'picks')} className="sort-button">PICKS</button>
                            <button onClick={() => sortHeroes(roleSort(winStats, `winrate`, 'total'), 'winrate')} className="sort-button">winrate</button>
                            <button onClick={() => sortHeroes(roleSort(winStats, `bans`, 'total'), 'bans')} className="sort-button">bans</button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </ArrowButton >
    )

}
const roleSort = (stats: any[], field: string, type?: string) => {
    const filtered = stats.filter((item) => {
        if (type === 'total') return item[field] > 10
        else if (item[field] && item[field]) {
            return item[field]['picks'] > 10
        }

    });
    const sorted = [...filtered].sort((a, b) => {
        if (type === 'total') return b[field] - a[field];
        if (field !== 'winrate') {
            return b[field]['picks'] - a[field]['picks']
        } else {
            const winrate1 = a[field]['picks'] ? ((a[field]['wins'] / a[field]['picks']) * 100) : 0
            const winrate2 = b[field]['picks'] ? ((b[field]['wins'] / b[field]['picks']) * 100) : 0
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
    const r2: RoleStrings[] = ['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support']
    return (
        <>
            {r2.map((x, i) => {
                return (
                    <Grid key={i} item padding={0} sx={{ paddingLeft: '0px', paddingTop: '0px' }}>
                        <button className='sort-button' onClick={() => sortHeroes(roleSort(winStats, `${x}`, 'picks'), 'picks', x)}>{x}</button>
                    </Grid>
                )
            })
            }
        </>
    )
}
export default ControlPanel
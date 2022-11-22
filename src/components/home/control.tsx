import { Grid } from "@mui/material";
import ArrowButton from "../arrowButton"

const ControlPanel = (props: any) => {
    return (
        <ArrowButton transition='fade' style={{ transform: "rotate(-90deg)", position: 'absolute', top: '17%', left: '-20px' }}>
            <div className="control-panel">
                <Grid container spacing={0} sx={{ marginLeft: '10px', backgroundColor: 'rgb(58, 61, 61)', width: '270px', zIndex: 5, position: 'absolute', left: '23px', top: '88px' }}>
                    <RoleSelector sortHeroes={props.sortHeroes} winStats={props.winStats}></RoleSelector>
                    <Grid item>
                        <div className="flex" style={{ width: '100%', borderTop: '2px solid black' }}>
                            <button onClick={() => props.sortHeroes(roleSort(props.winStats, `picks`), 'picks')} className="sort-button">PICKS</button>
                            <button onClick={() => props.sortHeroes(roleSort(props.winStats, `winrate`), 'winrate')} className="sort-button">winrate</button>
                            <button onClick={() => props.sortHeroes(roleSort(props.winStats, `bans`), 'bans')} className="sort-button">bans</button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </ArrowButton >

    )

}
const roleSort = (stats: any, field: string) => {
    let filtered = stats.filter((item: any) => item[field] > 0);
    const sorted = filtered.sort((a: any, b: any) => {
        return b[field] - a[field]
    })
    console.log(sorted.map((x: any) => x['hero']))
    return sorted
}
const RoleSelector = (props: any) => {
    const r2 = ['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support']
    return (
        <>
            {r2.map((x, i) => {
                return (
                    <Grid key={i} item padding={0} sx={{ paddingLeft: '0px', paddingTop: '0px' }}>
                        <button className='sort-button' onClick={() => props.sortHeroes(roleSort(props.winStats, `${x}_picks`), 'picks', x)}>{x}</button>
                    </Grid>
                )
            })
            }
        </>
    )
}
export default ControlPanel
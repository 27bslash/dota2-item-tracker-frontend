import { useEffect, useState } from "react"
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { RoleStrings } from "../home"
import { theme } from "../../.."
import PickStats, { PickRoleStat } from "../../types/pickStats"
import ArrowButton from "../../ui_elements/arrowButton"
type SIdeBarProps = {
    sortByTrend: () => void,
    sortHeroes: (list: string[], search: string, role?: RoleStrings) => void,
    winStats: PickStats[]
    open: boolean
}
export const SideBar = ({ sortByTrend, sortHeroes, winStats, open }: SIdeBarProps) => {
    const [role, setRole] = useState<RoleStrings>()
    const [sortType, setSortType] = useState<'picks' | 'winrate' | 'bans' | 'trends'>()
    const [drawerOpen, setDrawerOpen] = useState(open)
    useEffect(() => {
        if (role || sortType) gSort()
    }, [role, sortType]);
    const gSort = () => {
        // default sort is picks
        if (!sortType) return setSortType('picks')
        if (sortType === 'trends') {
            return sortByTrend()
        }
        const filtered = winStats.filter((item) => {
            // return item.role === role
            let dd: PickStats | PickRoleStat = item
            let pickThreshold = 10
            if (role) {
                dd = item[role]
                pickThreshold = 5
            }
            if (sortType === 'picks' || sortType === 'winrate' || sortType === 'bans') {
                return dd && dd['picks'] > pickThreshold
            }
        });
        const sorted = [...filtered].sort((a, b) => {
            if (role) {
                if (sortType === 'bans') {
                    return b['bans'] - a['bans']
                } else {
                    return b[role][sortType] - a[role][sortType]
                }
            } else {
                return b[sortType] - a[sortType]
            }
        })
        return sortHeroes(sorted.map((x) => x.hero), sortType, role)
    }
    return (
        <ArrowButton transition="fade" style={{ transform: "rotate(-90deg)", position: 'absolute', top: '17%', left: '-20px', backgroundColor: theme.palette.primary.main }}>
            {/* <Nav heroList={heroList} playerList={playerList}></Nav> */}
            <Box sx={{ display: 'flex' }} >
                <Drawer
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            top: '70px',
                            width: 240,
                            boxSizing: 'border-box',
                            color: 'white',
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={true}
                >
                    <Box alignItems={'center'}>
                        {['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support'].map((roleString, index) => {
                            const highLight = roleString === role
                            return (
                                <ListItem className='sidebar-item' key={roleString} disablePadding onClick={() => setRole(roleString as RoleStrings)}
                                    sx={{ backgroundColor: highLight ? '#2d8680' : 'inherit' }} >
                                    <ListItemIcon />
                                    <ListItemText primary={roleString} />
                                </ListItem>
                            )
                        })}
                        {/* <Divider color={'white'} /> */}

                    </Box>
                    {/* <Box alignItems={"center"}>
                            {[].map((text, index) => (
                                <div key={text} className="test">
                                    <ButtonGroup color="success" variant="contained" className="test" sx={{
                                        width: '95px'
                                    }}>
                                        <Button>{text}</Button>
                                    </ButtonGroup>
                                </div>
                            ))}
                        </Box> */}
                    <Divider color={'white'} />
                    <List>
                        <ListItem disablePadding className='sidebar-item'>
                            <ListItemIcon />
                            <ListItemText primary={'Picks'} onClick={() => setSortType('picks')} />
                        </ListItem>
                        <ListItem disablePadding className='sidebar-item'>
                            <ListItemIcon />
                            <ListItemText primary={'Winrate'} onClick={() => setSortType('winrate')} />
                        </ListItem>
                        <ListItem disablePadding className='sidebar-item'>
                            <ListItemIcon />
                            <ListItemText primary={'Trends'} onClick={() => setSortType('trends')} />
                        </ListItem>
                        <ListItem disablePadding className='sidebar-item'>
                            <ListItemIcon />
                            <ListItemText primary={'Bans'} onClick={() => setSortType('bans')} />
                        </ListItem>
                    </List>
                </Drawer >
            </Box >
            {/* <Home heroList={heroList} playerList={playerList}></Home> */}
        </ArrowButton>
    )
}
const rSort = (stats: PickStats[], role: RoleStrings) => {
    // default sort is picks
    const filtered = stats.filter((item) => {
        // return item.role === role
        return item[role] && item[role].picks > 5
    });
    const sorted = [...filtered].sort((a, b) => {
        return b[role].picks - a[role].picks
    })
    console.log(sorted.map((x) => x.hero))
    return sorted.map((x) => x.hero)
}

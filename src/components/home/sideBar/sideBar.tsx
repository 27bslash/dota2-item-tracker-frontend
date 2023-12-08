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
                    // variant="permanent"
                    anchor="left"
                    open={true}
                >
                    <Box alignItems={'center'}>
                        {['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support'].map((roleString, index) => {
                            const highLight = roleString === role
                            return (
                                <ListItem className='sidebar-item' key={roleString} disablePadding onClick={() => setRole(roleString as RoleStrings)}
                                    sx={{ backgroundColor: highLight ? '#2d8680' : 'inherit' }} >
                                    {/* <ListItemIcon /> */}
                                    <ListItemText disableTypography primary={roleString} sx={{ marginLeft: '40px' }} />
                                </ListItem>
                            )
                        })}
                    </Box>
                    <Divider sx={{
                        width: '90%',
                        alignSelf: 'center',
                        backgroundColor: '#2ec794',
                        borderRadius: '50%'
                    }} />

                    <List>
                        <ListItem disablePadding className='sidebar-item' onClick={() => setSortType('picks')} >
                            <ListItemText disableTypography primary={'Picks'} sx={{ marginLeft: '40px' }} />
                        </ListItem>
                        <ListItem disablePadding className='sidebar-item' onClick={() => setSortType('winrate')}>
                            <ListItemText disableTypography primary={'Winrate'} sx={{ marginLeft: '40px' }} />
                        </ListItem>
                        <ListItem disablePadding className='sidebar-item' onClick={() => setSortType('trends')}>
                            <ListItemText disableTypography primary={'Trends'} sx={{ marginLeft: '40px' }} />
                        </ListItem>
                        <ListItem disablePadding className='sidebar-item' onClick={() => setSortType('bans')}>
                            <ListItemText disableTypography primary={'Bans'} sx={{ marginLeft: '40px' }} />
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

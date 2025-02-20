import { useEffect, useState } from 'react'
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import { RoleStrings } from '../home'
import { theme } from "../../../main";
import PickStats, { PickRoleStat } from '../../types/pickStats'
import ArrowButton from '../../ui_elements/arrowButton'
import { useParams } from 'react-router'
type SIdeBarProps = {
    sortByTrend: (role: RoleStrings | undefined) => void
    sortHeroes: (list: string[], search: string, role?: RoleStrings) => void
    winStats: PickStats[] | undefined
    open: boolean
}
type sortTypes = 'picks' | 'winrate' | 'bans' | 'trends' | undefined

export const SideBar = ({
    sortByTrend,
    sortHeroes,
    winStats,
    open,
}: SIdeBarProps) => {
    const [role, setRole] = useState<RoleStrings>()
    const [sortType, setSortType] = useState<sortTypes>()
    const paramPatch = useParams()['patch']
    useEffect(() => {
        if (winStats && (role || sortType)) gSort()
    }, [role, sortType, paramPatch])
    const gSort = () => {
        // default sort is picks
        if (!sortType) return setSortType('trends')
        if (sortType === 'trends') {
            return sortByTrend(role)
        }
        const filtered = winStats!.filter((item) => {
            // return item.role === role
            let dd: PickStats | PickRoleStat = item
            let pickThreshold = 10
            if (role) {
                dd = item[role]
                pickThreshold = 10
            }
            const pickString = paramPatch ? 'patch_picks' : 'picks'
            if (
                sortType === 'picks' ||
                sortType === 'winrate' ||
                sortType === 'bans'
            ) {
                return dd && dd[pickString] > pickThreshold
            }
        })
        const sorted = [...filtered].sort((a, b) => {
            if (role) {
                if (sortType === 'bans') {
                    return b['bans'] - a['bans']
                } else {
                    if (paramPatch) {
                        if (sortType === 'picks') {
                            return (
                                b[role][`patch_picks`] - a[role]['patch_picks']
                            )
                        } else if (sortType === 'winrate') {
                            return (
                                b[role]['patch_wins'] / b[role][`patch_picks`] -
                                a[role]['patch_wins'] / a[role][`patch_picks`]
                            )
                        }
                    }
                    return b[role][sortType] - a[role][sortType]
                }
            } else {
                if (paramPatch) {
                    if (sortType === 'picks') {
                        return b[`patch_picks`] - a['patch_picks']
                    } else if (sortType === 'winrate') {
                        return (
                            b['patch_wins'] / b[`patch_picks`] -
                            a['patch_wins'] / a[`patch_picks`]
                        )
                    }
                }
                return b[sortType] - a[sortType]
            }
        })
        return sortHeroes(
            sorted.map((x) => x.hero),
            sortType,
            role
        )
    }
    return (
        <ArrowButton
            transition="fade"
            transitionTime={10}
            style={{
                transform: 'rotate(-90deg)',
                position: 'absolute',
                top: '17%',
                left: '-20px',
                backgroundColor: theme.palette.primary.main,
            }}
        >
            {/* <Nav heroList={heroList} playerList={playerList}></Nav> */}
            <Box sx={{ display: 'flex' }}>
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
                            borderRadius: '0px 5px 5px 0px',
                            border: 'solid 2px black',
                        },
                    }}
                    variant="persistent"
                    // variant="permanent"
                    anchor="left"
                    open={true}
                >
                    <Box alignItems={'center'}>
                        {[
                            'Safelane',
                            'Midlane',
                            'Offlane',
                            'Roaming',
                            'Support',
                            'Hard Support',
                        ].map((roleString, index) => {
                            const highLight = roleString === role
                            return (
                                <ListItem
                                    className="sidebar-item"
                                    key={roleString}
                                    disablePadding
                                    onClick={() =>
                                        setRole(
                                            role === roleString
                                                ? ''
                                                : (roleString as RoleStrings)
                                        )
                                    }
                                    sx={{
                                        backgroundColor: highLight
                                            ? '#2d8680'
                                            : 'inherit',
                                    }}
                                >
                                    {/* <ListItemIcon /> */}
                                    <ListItemText
                                        disableTypography
                                        primary={roleString}
                                        sx={{ marginLeft: '40px' }}
                                    />
                                </ListItem>
                            )
                        })}
                    </Box>
                    <Divider
                        sx={{
                            width: '90%',
                            alignSelf: 'center',
                            backgroundColor: '#2ec794',
                            borderRadius: '50%',
                        }}
                    />

                    <List>
                        <ListItem
                            sx={{
                                backgroundColor:
                                    sortType === 'trends'
                                        ? '#2d8680'
                                        : 'inherit',
                            }}
                            disablePadding
                            className="sidebar-item"
                            onClick={() =>
                                setSortType(
                                    sortType === 'trends' ? undefined : 'trends'
                                )
                            }
                        >
                            <ListItemText
                                disableTypography
                                primary={'Trends'}
                                sx={{ marginLeft: '40px' }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                backgroundColor:
                                    sortType === 'picks'
                                        ? '#2d8680'
                                        : 'inherit',
                            }}
                            disablePadding
                            className="sidebar-item"
                            onClick={() =>
                                setSortType(
                                    sortType === 'picks' ? undefined : 'picks'
                                )
                            }
                        >
                            <ListItemText
                                disableTypography
                                primary={'Picks'}
                                sx={{ marginLeft: '40px' }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                backgroundColor:
                                    sortType === 'winrate'
                                        ? '#2d8680'
                                        : 'inherit',
                            }}
                            disablePadding
                            className="sidebar-item"
                            onClick={() =>
                                setSortType(
                                    sortType === 'winrate'
                                        ? undefined
                                        : 'winrate'
                                )
                            }
                        >
                            <ListItemText
                                disableTypography
                                primary={'Winrate'}
                                sx={{ marginLeft: '40px' }}
                            />
                        </ListItem>

                        <ListItem
                            sx={{
                                backgroundColor:
                                    sortType === 'bans' ? '#2d8680' : 'inherit',
                            }}
                            disablePadding
                            className="sidebar-item"
                            onClick={() =>
                                setSortType(
                                    sortType === 'bans' ? undefined : 'bans'
                                )
                            }
                        >
                            <ListItemText
                                disableTypography
                                primary={'Bans'}
                                sx={{ marginLeft: '40px' }}
                            />
                        </ListItem>
                    </List>
                </Drawer>
            </Box>
            {/* <Home heroList={heroList} playerList={playerList}></Home> */}
        </ArrowButton>
    )
}
const rSort = (stats: PickStats[], role: RoleStrings) => {
    // default sort is picks
    const filtered = stats.filter((item) => {
        // return item.role === role
        return item[role] && item[role].picks > 5
    })
    const sorted = [...filtered].sort((a, b) => {
        return b[role].picks - a[role].picks
    })
    console.log(sorted.map((x) => x.hero))
    return sorted.map((x) => x.hero)
}

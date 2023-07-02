import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import Page from './components/page';
import {
    Routes,
    Route
} from "react-router-dom";
import Home from './components/home/home';
import { Box } from '@mui/material';

interface heroList {
    name: string,
    id: number
}
// export const baseApiUrlContext = createContext('http://127.0.0.1:5000/')
export const baseApiUrl = 'https://wqr6qu33nndj37c5uoogrmgsyq0mkbes.lambda-url.eu-west-2.on.aws/'
function App() {
    const [heroList, setHeroList] = useState<heroList[]>([])
    const [playerList, setPlayerList] = useState([])
    // const baseApiUrl = 'https://dota2-item-tracker.onrender.com/'
    useEffect(() => {
        (async () => {
            const heroList = await fetch(`${baseApiUrl}files/hero_ids`)
            const heroListJson = await heroList.json()
            setHeroList(heroListJson['heroes'])
            const res = await fetch(`${baseApiUrl}files/accounts`)
            const playerlst = await res.json()
            setPlayerList(playerlst)
        })()
    }, [])

    return (
        <Box className="App" bgcolor={'background.default'} sx={{ padding: '8px' }}>
            <Routes>
                <Route path='/' element={
                    <Home heroList={heroList} playerList={playerList} />
                }>
                    {/* home page */}
                </Route>
                <Route path='/hero/:name' element={
                    <Page heroList={heroList} playerList={playerList} type='hero' />
                }>
                    {/* hero pages */}
                </Route>
                <Route path='/player/:name' element={
                    <Page heroList={heroList} playerList={playerList} type='player' />}>
                    {/* player pages */}
                </Route>
                <Route path='/chappie'>

                </Route>
            </Routes>
        </Box >
    );
}

export default App;

import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import Page from './components/page';
import {
    Routes,
    Route
} from "react-router-dom";
import Home from './components/home/home';

interface heroList {
    name: string,
    id: number
}
// export const baseApiUrlContext = createContext('http://127.0.0.1:5000/')
export const baseApiUrlContext = createContext('https://dota2-item-tracker.onrender.com/')
function App() {
    const [heroList, setHeroList] = useState<heroList[]>([])
    const [playerList, setPlayerList] = useState([])
    // const baseApiUrl = 'https://dota2-item-tracker.onrender.com/'
    const baseApiUrl = useContext(baseApiUrlContext)
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
        <div className="App">
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
        </div >
    );
}

export default App;

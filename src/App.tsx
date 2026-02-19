import { useEffect, useState } from "react";
import "./App.css";
import Page from "./components/stat_page/page";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import { Box } from "@mui/material";
import { BuildApi } from "./components/HeroBuilds/buildApi";

interface heroList {
  name: string;
  id: number;
}
// export const baseApiUrl =
//   "https://2x76hyghfd2tc2mdx2t4owwp5m0itmkb.lambda-url.eu-west-2.on.aws/";
// export const baseApiUrl ='http://127.0.0.1:5000/'
export const baseApiUrl =
  "https://7fy1yb51r6.execute-api.eu-west-2.amazonaws.com/dev/";

function App() {
  const [heroList, setHeroList] = useState<heroList[]>([]);
  const [playerList, setPlayerList] = useState([]);
  const [patch, setPatch] = useState({ patch: "", patch_timestamp: 0 });

  // const baseApiUrl = 'https://dota2-item-tracker.onrender.com/'
  useEffect(() => {
    const async_get = async () => {
      const heroList = await fetch(`${baseApiUrl}files/hero_ids`);
      const heroListJson = await heroList.json();
      setHeroList(heroListJson["heroes"]);
      const res = await fetch(`${baseApiUrl}files/accounts`);
      const playerlst = await res.json();
      setPlayerList(playerlst);
      const currentPatch = await fetch(`${baseApiUrl}files/patch`);
      setPatch(await currentPatch.json());
    };
    async_get();
  }, []);
  return (
    <Box className="App" sx={{ padding: "8px" }}>
      <Routes>
        {/* home page */}
        <Route
          path="/:patch?"
          element={
            <Home heroList={heroList} playerList={playerList} patch={patch} />
            // <FacetPalete></FacetPalete>
            // <Palette options={options} updateOptions={updateOptions}></Palette>
            // <NeutralTooltipPalette/>
          }
        ></Route>
        {/* hero pages */}
        <Route
          path="/:patch?/hero/:name"
          element={
            <Page
              heroList={heroList}
              playerList={playerList}
              patch={patch}
              type="hero"
            />
          }
        ></Route>
        {/* player pages */}
        <Route
          path="/:patch?/player/:name"
          element={
            <Page
              heroList={heroList}
              playerList={playerList}
              patch={patch}
              type="player"
            />
          }
        ></Route>
        <Route path="/api/:hero/build" element={<BuildApi />}></Route>
        <Route path="/debug/facetpalette" element={<FacetPalete />}></Route>
      </Routes>
    </Box>
  );
}

export default App;

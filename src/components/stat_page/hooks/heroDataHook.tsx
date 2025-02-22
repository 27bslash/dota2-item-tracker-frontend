import { useEffect, useState } from "react";
import { baseApiUrl } from "../../../App";
import DotaMatch from "../../types/matchData";
import { PageHeroData } from "../../types/heroData";
import { fetchItems, updateEtag } from "../../../utils/fetchData";

export const useHeroData = (
  type: string,
  totalMatchData: DotaMatch[],
  nameParam: string
) => {
  const [heroData, setHeroData] = useState<PageHeroData>({});
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState<string[]>([]);

  useEffect(() => {
    const async_get = async () => {
      const sett: Set<string> = new Set();
      if (type !== "player") {
        const hData = await fetchItems(`files/hero-data/${nameParam}`);
        // const hData = await fetch(
        //     `${baseApiUrl}files/hero-data/${nameParam}`
        // )
        if (hData) {
          console.log(hData.heroData);
          setHeroData({ [nameParam]: hData.heroData });
        } else {
          getHeroData(nameParam);
        }
      } else {
        for (const match of totalMatchData) {
          sett.add(match["hero"]);
        }
        setVisited(sett);
      }
    };
    async_get();
  }, [totalMatchData]);
  async function getHeroData(hero: string) {
    const hData = await fetch(`${baseApiUrl}files/hero-data/${hero}`);
    const hJson = await hData.json();
    const o = heroData;
    o[hero] = hJson["heroData"];
    if (hData.headers.get("ETag") && hData.headers.get("ETag") !== null) {
      updateEtag(
        `files/hero-data/${hero}`,
        hData.headers.get("ETag") as string,
        hData.headers.get("Last-Modified") as string
      );
    }

    setHeroData(o);
  }
  useEffect(() => {
    for (const hero of visited) {
      if (!total.includes(hero)) {
        getHeroData(hero);
        setTotal((prev) => [...prev, hero]);
      }
    }
  }, [visited]);
  return heroData;
};

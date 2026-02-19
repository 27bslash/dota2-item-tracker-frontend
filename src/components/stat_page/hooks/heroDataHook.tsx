import { useEffect, useState } from "react";
import { baseApiUrl } from "../../../App";
import DotaMatch from "../../types/matchData";
import { PageHeroData } from "../../types/heroData";
import { fetchItems, updateEtag } from "../../../utils/fetchData";

async function getHeroData(hero: string) {
  const cachedHeroData = await fetchItems(`files/hero-data/${hero}`);
  if (cachedHeroData?.heroData) {
    return cachedHeroData.heroData;
  }
  const hData = await fetch(`${baseApiUrl}files/hero-data/${hero}`);
  const hJson = await hData.json();

  if (hData.headers.get("ETag") && hData.headers.get("ETag") !== null) {
    updateEtag(
      `files/hero-data/${hero}`,
      hData.headers.get("ETag") as string,
      hData.headers.get("Last-Modified") as string,
    );
  }
  return hJson["heroData"];
}
export const useHeroData = (
  type: string,
  totalMatchData: DotaMatch[],
  nameParam: string,
) => {
  const [heroData, setHeroData] = useState<PageHeroData>({});

  useEffect(() => {
    if (type !== "hero" || !nameParam) {
      return;
    }

    let cancelled = false;
    const loadHeroData = async () => {
      const data = await getHeroData(nameParam);
      if (cancelled) return;
      setHeroData((prev) => ({
        ...prev,
        [nameParam]: data,
      }));
    };

    loadHeroData();
    return () => {
      cancelled = true;
    };
  }, [nameParam, type]);

  useEffect(() => {
    if (type !== "player" || !totalMatchData.length) {
      return;
    }

    let cancelled = false;
    const loadPlayerHeroData = async () => {
      const uniqueHeroes = new Set<string>();
      for (const match of totalMatchData) {
        uniqueHeroes.add(match["hero"]);
      }

      const missingHeroes = [...uniqueHeroes].filter(
        (hero) => !(hero in heroData),
      );
      for (const hero of missingHeroes) {
        const data = await getHeroData(hero);
        if (cancelled) return;
        setHeroData((prev) => ({
          ...prev,
          [hero]: data,
        }));
      }
    };

    loadPlayerHeroData();
    return () => {
      cancelled = true;
    };
  }, [totalMatchData, type, heroData]);

  return heroData;
};

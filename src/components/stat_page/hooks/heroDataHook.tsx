import { useEffect, useState } from "react";
import { baseApiUrl } from "../../../App";
import DotaMatch from "../../types/matchData";
import { PageHeroData } from "../../types/heroData";
const HERO_DATA_CACHE_PREFIX = "hero_data_cache_";

async function getHeroData(hero: string) {
  const cacheKey = `${HERO_DATA_CACHE_PREFIX}${hero}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const response = await fetch(`${baseApiUrl}files/hero-data/${hero}`);
  const json = await response.json();
  try {
    localStorage.setItem(cacheKey, JSON.stringify(json.heroData));
  } catch {
    // quota exceeded — skip cache
  }
  return json.heroData;
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

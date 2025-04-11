import { useParams } from "react-router";
import heroSwitcher from "../../utils/heroSwitcher";
import { useHeroBuilds } from "./buildHooks/buildHook";
import { useParseMatchData } from "./buildHooks/parseMatchDataHook";
import { fetchData } from "../../utils/fetchData";
import { useEffect, useState } from "react";
import { baseApiUrl } from "../../App";
import { exists } from "./../../utils/exists";
import { Items } from "../types/Item";
import { PageHeroData } from "../types/heroData";
import { useFetchData } from "./buildHooks/fetchMatchDataHook";
import PickStats from "../types/pickStats";

const BuildDataJson = ({
  heroName,
  totalPicks,
  heroData,
  itemData,
  patchObj,
}: {
  heroName: string;
  totalPicks: PickStats;
  patchObj: { [x: string]: string };
  heroData: PageHeroData;
  itemData: Items;
}) => {
  const totalMatchData = useFetchData(heroName)!;
  console.log("totalMatchData", totalMatchData);

  const filteredData = useParseMatchData({
    proData: true,
    totalMatchData,
    props: { picks: totalPicks },
    threshold: 0.19,
  });

  for (const k in filteredData) {
    filteredData[k] = filteredData[k].filter(
      (heroBuildObj) => heroBuildObj.patch === patchObj["patch"]
    );
  }

  const updatedBuildData = useHeroBuilds({
    filteredData: filteredData!,
    heroData,
    itemData,
    api: true,
  });
  return exists(updatedBuildData) ? (
    <div className="data">{JSON.stringify(updatedBuildData)}</div>
  ) : (
    <div className="nodata"></div>
  );
};
export const BuildApi = () => {
  const params = useParams();
  const heroName = params["hero"] ? heroSwitcher(params["hero"]) : "";
  const [totalPicks, setTotalPicks] = useState<PickStats>();
  const [itemData, setItemData] = useState<Items>();
  const [heroData, setHeroData] = useState<PageHeroData>();
  const [patch, setPatch] = useState<{ [key: string]: string }>();
  useEffect(() => {
    const fData = async () => {
      const url = `${baseApiUrl}hero/${heroName}/react-test?skip=0&length=10`;
      const matches = await fetchData(url);
      setTotalPicks(matches["picks"]);
      const currentItemDataVersion = localStorage.getItem("item_list_version");
      const itemResponse = await fetchData(
        `${baseApiUrl}files/items?version=${currentItemDataVersion}&time=${Date.now()}`
      );
      setItemData(itemResponse);
      const hData = await fetch(`${baseApiUrl}files/hero-data/${heroName}`);
      const currentPatch = await fetchData(`${baseApiUrl}files/patch`);
      setPatch(currentPatch);
      const hJson = await hData.json();
      setHeroData({ [heroName]: hJson.heroData });
      if (matches && itemData) {
        console.log(matches, itemData);
      }
    };
    fData();
  }, []);
  return (
    totalPicks &&
    heroName &&
    heroData &&
    patch &&
    itemData && (
      <BuildDataJson
        itemData={itemData}
        heroData={heroData}
        totalPicks={totalPicks}
        heroName={heroName}
        patchObj={patch}
      ></BuildDataJson>
    )
  );
};

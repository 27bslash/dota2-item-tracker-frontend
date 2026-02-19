import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { baseApiUrl } from "../../../App";
import {
  bulkRequestStaged,
  fetchData,
  fetchItems,
} from "../../../utils/fetchData";
import heroSwitcher from "../../../utils/heroSwitcher";
import DotaMatch from "../../types/matchData";
import PickStats from "../../types/pickStats";
import { Items } from "../../types/Item";
import { UnparsedBuilds } from "../../HeroBuilds/buildHooks/shortBuildHook";

export const useFetchAllData = (type: string) => {
  const [filteredMatchData, setfilteredMatchData] = useState<DotaMatch[]>();
  const [totalMatches, setTotalMatches] = useState<DotaMatch[]>();
  const [itemData, setItemData] = useState<Items>();
  const [totalPicks, setTotalPicks] = useState<PickStats>();
  const [shortBuilds, setShortBuilds] = useState<{
    [key: string]: UnparsedBuilds;
  }>();

  const params = useParams();
  const [query] = useSearchParams();
  const role = query.get("role") || "";
  const nameParam = params["name"] ? heroSwitcher(params["name"]) : "";
  const getData = async () => {
    let merged: DotaMatch[] = [];
    let url = `${baseApiUrl}${type}/${nameParam}/react-test?skip=0&length=10`;
    if (role)
      url = `${baseApiUrl}${type}/${nameParam}/react-test?skip=0&length=10&role=${role}`;
    const countDocsUrl = `${baseApiUrl}hero/${nameParam}/count_docs?collection=heroes`;
    const matches: { data: DotaMatch[]; picks: PickStats } =
      await fetchData(url);
    setfilteredMatchData(matches["data"]);
    const docLength = Number(await fetchData(countDocsUrl));
    setTotalPicks(matches["picks"]);
    const shortBuild = await fetchData(
      `${baseApiUrl}hero/${nameParam}/item_build?short=True`,
    );
    setShortBuilds(shortBuild[0]);
    const itemdd = await fetchItems("files/items");
    if (itemdd) {
      setItemData(itemdd);
    } else {
      const notModified = await fetch(`${baseApiUrl}files/items`);
      const notModifiedJson = await notModified.json();
      setItemData(notModifiedJson);
    }
    const initialMatches = matches["data"];
    setTotalMatches(initialMatches);
    if (docLength > 35 && type === "hero") {
      const stagedBaseUrl = role
        ? `${baseApiUrl}${type}/${nameParam}/react-test?role=${role}`
        : `${baseApiUrl}${type}/${nameParam}/react-test`;
      const stagedMatches = await bulkRequestStaged<DotaMatch>(
        stagedBaseUrl,
        docLength,
        10,
        {
          seedData: initialMatches,
          onStage: setTotalMatches,
        },
      );
      merged = stagedMatches;
    } else if (docLength <= 10 && type === "hero") {
      merged = initialMatches;
    } else {
      const allMatches = await fetchData(
        `${baseApiUrl}${type}/${nameParam}/react-test?skip=10&length=${docLength}`,
      );
      merged = initialMatches.concat(allMatches["data"]);
    }

    setTotalMatches(merged);
  };
  useEffect(() => {
    getData();
  }, []);
  return {
    filteredMatchData,
    totalMatches,
    itemData,
    totalPicks,
    shortBuilds,
  };
};

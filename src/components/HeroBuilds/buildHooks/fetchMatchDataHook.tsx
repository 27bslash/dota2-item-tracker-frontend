import { useEffect, useState } from "react";
import { baseApiUrl } from "../../../App";
import { fetchData, bulkRequest } from "../../../utils/fetchData";
import { useParams } from "react-router";
import DotaMatch from "../../types/matchData";

export const useFetchData = (heroName: string) => {
  const [nonProData, setNonProData] = useState<DotaMatch[]>();
  const params = useParams();
  useEffect(() => {
    console.log("heroName", heroName);
    const async_get = async () => {
      const countDocsUrl = `${baseApiUrl}hero/${heroName}/count_docs?collection=heroes`;
      const docLength = await fetchData(countDocsUrl);
      let merged: DotaMatch[] = [];
      let data = [];
      if (docLength > 50) {
        data = await bulkRequest(
          `${baseApiUrl}hero/${heroName}/react-test`,
          docLength,
          0
        );
        merged = data
          .map((matchArr: { data: DotaMatch[] }) => matchArr.data)
          .flat();
      } else {
        data = await fetchData(`${baseApiUrl}hero/${heroName}/react-test`);
        merged = data
          .map((matchArr: { data: DotaMatch[] }) => matchArr.data)
          .flat();
      }
      console.log("merged", merged);
      const filteredMerged = merged.filter((match) => {
        if (
          match.abilities &&
          match.items &&
          (params.patch ? match.patch === params.patch : true)
        ) {
          return true;
        }
      });
      console.log(filteredMerged);
      setNonProData(filteredMerged);
    };
    async_get();
  }, [heroName, params.patch]);
  if (nonProData) return nonProData;
};

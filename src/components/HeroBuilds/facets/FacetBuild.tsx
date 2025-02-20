import { useEffect, useState, useMemo } from "react";
import { usePageContext } from "../../stat_page/pageContext";
import { FacetObj } from "../../types/heroData";
import { FacetContent } from "./facetContent";

type FacetProps = {
  data: {
    key: number;
    count: number;
    perc: string;
    title: string;
  }[];
};

export const FacetBuild = ({ data }: FacetProps) => {
  const { heroData, nameParam } = usePageContext();
  const [facets, setFacets] = useState<FacetObj[] | null>(null);

  useEffect(() => {
    if (heroData[nameParam]?.facets) {
      setFacets(heroData[nameParam]["facets"]);
    }
  }, [heroData, nameParam]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.count - a.count);
  }, [data]);

  const mappedData = useMemo(() => {
    return sortedData.map((x) => {
      if (!facets) return x;
      if (!facets[x["key"] - 1]["Deprecated"]) {
        x.title = facets[x["key"] - 1].title_loc.toLowerCase();
        return x;
      }
      x.title = facets[facets?.length - 1].title_loc.toLowerCase();
      return x;
    });
  }, [sortedData, facets]);

  const mergedData = useMemo(() => {
    console.log(mappedData);
    return Object.values(
      mappedData.reduce((acc: Record<string, any>, item) => {
        if (!item.title) return acc;
        if (!acc[item.title]) {
          acc[item.title] = { ...item };
        } else {
          acc[item.title].count += item.count;
        }
        return acc;
      }, {})
    );
  }, [mappedData]);

  const maps = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < mergedData.length; i += 2) {
      grouped.push([mergedData[i], mergedData[i + 1]]);
    }
    console.log(grouped);
    return grouped;
  }, [mergedData]);

  return (
    <div className={`facets ${data.length <= 2 ? "flex" : ""}`}>
      {facets &&
        maps.map((arr, i) => (
          <div className="facets-group" style={{ display: "flex" }} key={i}>
            {arr.map((x, j) =>
              x ? <FacetContent key={j} facetStats={x} facets={facets} /> : null
            )}
          </div>
        ))}
    </div>
  );
};

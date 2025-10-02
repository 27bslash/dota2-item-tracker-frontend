import { useEffect, useState } from "react";
import ArrowButton from "../ui_elements/arrowButton";
import { usePageContext } from "../stat_page/pageContext";
import DotaMatch from "../types/matchData";

interface MostUsedProps {
  role: string;
}

const MostUsed = ({ role }: MostUsedProps) => {
  const [mostUsed, setMostUsed] = useState<[string, number][]>([]);
  const [max, setMax] = useState(0);
  const { totalMatchData, updateSearchResults } = usePageContext();
  useEffect(() => {
    let data = totalMatchData;
    if (role) {
      data = totalMatchData.filter((match) => match.role === role);
    }
    const mostU = calculateMostUsed(data);
    setMostUsed(mostU);
    if (mostU.length) {
      // console.log(mostU)
      setMax(mostU[0][1]);
    }
  }, [totalMatchData, role]);
  const handleClick = (item: string) => {
    // const itemResult = itemSearch(item, totalMatchData, itemData)
    updateSearchResults(item, "items", "items");
    // if (itemResult) {
    //     const itemKey = Object.keys(itemResult)[0];
    //     updateMatchData(itemResult[itemKey]['matches'], { 'items': itemResult })
    // }
  };
  return (
    <>
      <ArrowButton transition="collapse">
        <div className="most-used-container">
          <div className="most-used">
            {mostUsed.map((x, i) => {
              const img = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${x[0]}.png`;
              const value = x[1];
              const perc = (value / max) * 100;
              // console.log(x[0], perc)
              return (
                <div
                  key={i}
                  onClick={() => handleClick(x[0])}
                  className="most-used-row"
                >
                  <img className="most-used-item" alt={x[0]} src={img}></img>
                  <div
                    className="bar"
                    style={{
                      backgroundColor: `hsl(120,100%,25%, ${perc}%)`,
                      width: perc * 0.8 + "%",
                    }}
                  >
                    <p className="bar-value">{x[1]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ArrowButton>
    </>
  );
};

const calculateMostUsed = (data: DotaMatch[]) => {
  const consumables = [
    "tango",
    "flask",
    "ward_observer",
    "ward_sentry",
    "smoke_of_deceit",
    "enchanted_mango",
    "clarity",
    "tpscroll",
    "dust",
    "tome_of_knowledge",
  ];
  const itemCount: { [key: string]: number } = {};
  for (const match of data) {
    if (!match) continue;
    for (const item of match["final_items"]) {
      if (!consumables.includes(item["key"])) {
        itemCount[item["key"]] = itemCount[item["key"]] + 1 || 1;
      }
    }
  }
  const itemEntries = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  return itemEntries;
};
export default MostUsed;

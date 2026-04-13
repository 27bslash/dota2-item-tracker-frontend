import { Typography } from "@mui/material";
import ItemBuildCard from "./itemBuildCell/itemBuildCard";
import { CoreItem } from "./itemGroups/groupBytime";
import { HeroBuild } from "../buildHooks/buildTypes";

export type ItemBuildProps = {
  data: HeroBuild["item_builds"];
};

const TIMINGS = ["Early", "Mid", "Late"] as const;

const ItemSection = ({ label, items }: { label: string; items: CoreItem[] }) => {
  const visibleItems = items.filter((item) => !item.removed);
  if (!visibleItems.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h6" className="build-header">{label}</Typography>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {visibleItems.map((item, i) => (
          <ItemBuildCard key={i} itemkey={item.key!} item={item} />
        ))}
      </div>
    </div>
  );
};

const ItemBuild = ({ data }: ItemBuildProps) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 16px" }}>
      {TIMINGS.map((timing, i) => (
        <ItemSection key={`${timing}-core`} label={`${timing} Core`} items={data[i]?.core || []} />
      ))}
      {TIMINGS.map((timing, i) => (
        <ItemSection key={`${timing}-sit`} label={`${timing} Situational`} items={data[i]?.situational || []} />
      ))}
    </div>
  );
};

export default ItemBuild;

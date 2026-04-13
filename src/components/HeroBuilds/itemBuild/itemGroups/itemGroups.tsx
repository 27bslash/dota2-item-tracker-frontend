import { Typography } from "@mui/material";
import { CoreItem } from "./groupBytime";
import ItemBuildCard from "../itemBuildCell/itemBuildCard";

type ItemGroupsProps = {
  buildObject: Record<string, CoreItem[][]>;
  timing: "Early" | "Mid" | "Late";
  ObjectKey: "core" | "situational";
  offset?: { left: number; top: number };
};

export const ItemGroups = ({
  buildObject,
  timing,
  ObjectKey,
}: ItemGroupsProps) => {
  return (
    <>
      {buildObject[ObjectKey] && buildObject[ObjectKey][0].length !== 0 && (
        <>
          <Typography variant="h6" className="build-header">
            {`${timing} ${ObjectKey}`}
          </Typography>
          <div className={`${ObjectKey} flex`} style={{ flexDirection: "column" }}>
            {buildObject[ObjectKey].map((itemGroup, i) => (
              <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>
                {itemGroup.map((group, j) => (
                  <div key={j}>
                    <ItemBuildCard itemkey={group["key"]!} item={group} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

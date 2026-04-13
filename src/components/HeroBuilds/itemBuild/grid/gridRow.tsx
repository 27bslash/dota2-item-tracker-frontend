import { Grid } from "@mui/material";
import { ItemGroups } from "./../itemGroups/itemGroups";
import { ItemBuildProps } from "../itemBuild";
import { CoreItem } from "../itemGroups/groupBytime";
const chunkArray = (array: CoreItem[], size: number) => {
  const chunks = [];
  let index = 0;
  while (index < array.length) {
    chunks.push(array.slice(index, index + size));
    index += size;
  }
  return chunks;
};
type GridRowProps = {
  data: ItemBuildProps["data"];
  ObjectKey: "core" | "situational";
  timingOverride?: "Early" | "Mid" | "Late";
};

export const GridRow = ({ data, ObjectKey, timingOverride }: GridRowProps) => {
  // console.log(data)
  // 18 6
  // 18
  const newData = data.map((buildObject) => {
    const updatedBuildObject: Record<string, CoreItem[][]> = {}; // Create a copy of the object
    if (buildObject[ObjectKey].length > 5) {
      // console.log('test', k)
      updatedBuildObject[ObjectKey] = chunkArray(buildObject[ObjectKey], 6);
      // console.log(buildObject[ObjectKey])
    } else {
      updatedBuildObject[ObjectKey] = [buildObject[ObjectKey]];
    }
    return updatedBuildObject;
  });
  const findBadIndexes = (itemSet: CoreItem[]) => {
    const badIdxs: number[] = [];
    for (const [i, item] of itemSet.entries()) {
      if (item["option"]) {
        badIdxs.push(i);
      }
    }
    return badIdxs;
  };

  const applyOffsets = (itemsets: CoreItem[], badIdxs: number[]) => {
    let i = 0;
    for (const itemset of itemsets) {
      let moveCount = 0;
      while (badIdxs.includes(i)) {
        i += 1;
        moveCount += 1;
      }
      badIdxs.push(i + moveCount);
      itemset["offset"] = { left: moveCount * 55, top: -82 };
      i += 1;
    }
  };

  const calcOffset = () => {
    newData.forEach((buildObject) => {
      if (buildObject[ObjectKey].length > 1) {
        const badIdxs = buildObject[ObjectKey].flatMap(findBadIndexes);
        if (badIdxs.length) {
          applyOffsets(buildObject[ObjectKey][1], badIdxs);
        }
      }
    });
  };
  calcOffset();
  return (
    <>
      {newData.map((buildObject, i: number) => {
        const timing =
          timingOverride ||
          (i === 1 || i === 4 ? "Mid" : i === 2 || i === 5 ? "Late" : "Early");

        return (
          <Grid
            key={i}
            item
            xs={12}
            sm={12}
            md={12}
            // sx={{ textAlign: "center" }}
          >
            <ItemGroups
              buildObject={buildObject}
              timing={timing}
              ObjectKey={ObjectKey}
            />
          </Grid>
        );
      })}
    </>
  );
};

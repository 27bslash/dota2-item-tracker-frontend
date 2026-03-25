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
  dataLength: number[];
};

export const GridRow = ({ data, ObjectKey, dataLength }: GridRowProps) => {
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
  const totalLen = dataLength.reduce((a: number, b: number) => a + b);
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
          i === 1 || i === 4 ? "Mid" : i === 2 || i === 5 ? "Late" : "Early";
        let maxWidth = 12 / (totalLen / dataLength[i]);
        if (maxWidth > 6) maxWidth = 6;
        const widthPerc = (maxWidth / 12) * 100;
        const adjustedWidth = widthPerc - (widthPerc / 100) * 15;

        return (
          <Grid
            key={i}
            item
            md={4}
            sm={maxWidth}
            sx={{ textAlign: "center", maxWidth: adjustedWidth }}
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

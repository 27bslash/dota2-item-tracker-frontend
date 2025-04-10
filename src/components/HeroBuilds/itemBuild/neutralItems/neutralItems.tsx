import { Box, Typography } from "@mui/material";
import { ItemBuildImage } from "../itemBuildCell/itemBuildImage";
import { NeutralItemCounts } from "./mostUsedNeutrals";

export const NeutralItems = (props: {
  neutralItems: Record<string, { neutral_items: NeutralItemCounts[] }>;
}) => {
  // const neutralItems = mostUsedNeutrals(props.data, props.itemData)
  const neutralItems = Object.entries(props.neutralItems).map((itemArr) => {
    return itemArr[1]["neutral_items"].length < 3
      ? [itemArr[1]["neutral_items"]]
      : [
          itemArr[1]["neutral_items"].slice(0, 2),
          itemArr[1]["neutral_items"].slice(2, 4),
        ];
  });
  //   const enchants = Object.entries(props.neutralItems).map((itemArr) => {
  //     return itemArr[1]["enchants"].length < 3
  //       ? [itemArr[1]["enchants"]]
  //       : [itemArr[1]["enchants"].slice(0, 2), itemArr[1]["enchants"].slice(2, 4)];
  //   });
  const tierColours = ["white", "#99D98B", "#97a6e8", "#C783E8", "#F5DFA6"];
  return (
    <>
      {!!props.neutralItems && (
        <>
          <Typography align={"center"} variant="h5" color="white">
            Neutral Items
          </Typography>
          <Box
            alignItems={"start"}
            justifyContent={"space-evenly"}
            alignSelf={"center"}
            className="neutral-item-container flex"
          >
            {neutralItems.map((tierArr, i) => {
              return (
                <Box key={i} padding={0} margin={0}>
                  {tierArr.flat().length > 0 && (
                    <Typography
                      variant="h6"
                      fontWeight={"bold"}
                      align={"center"}
                      justifySelf={"center"}
                      color={tierColours[i]}
                    >
                      Tier {i + 1}
                    </Typography>
                  )}
                  {tierArr.map((x, itemIndex) => {
                    if (x.length) {
                      return (
                        <div key={itemIndex} className={`test ${i}`}>
                          <NeutralItem
                            key={i}
                            idx={i}
                            tierArr={x}
                          ></NeutralItem>
                        </div>
                      );
                    }
                  })}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};
const NeutralItem = (props: { idx: number; tierArr: NeutralItemCounts[] }) => {
  return (
    <Box>
      <Box
        padding={1}
        paddingLeft={1}
        paddingTop={0.5}
        paddingBottom={0}
        className="flex"
      >
        {props.tierArr.map((neutralItem, i) => {
          const key: string = neutralItem["key"];
          const perc: number = neutralItem["perc"];
          return (
            <div key={i} className="neutral-item">
              <ItemBuildImage
                enchant={neutralItem.enchantment}
                k={key}
                perc={perc}
              ></ItemBuildImage>
            </div>
          );
        })}
      </Box>
    </Box>
  );
};

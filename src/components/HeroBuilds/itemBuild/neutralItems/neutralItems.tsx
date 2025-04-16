import { Box, Typography } from "@mui/material";
import { ItemBuildImage } from "../itemBuildCell/itemBuildImage";
import { NeutralItemCounts } from "./mostUsedNeutrals";

export const NeutralItems = (props: {
  neutralItems: Record<
    string,
    { neutral_items: NeutralItemCounts[]; enchants: NeutralItemCounts[] }
  >;
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
  const enchants = Object.entries(props.neutralItems).map((itemArr) => {
    return itemArr[1]["enchants"].length < 3
      ? [itemArr[1]["enchants"]]
      : [
          itemArr[1]["enchants"].slice(0, 2),
          itemArr[1]["enchants"].slice(2, 4),
        ];
  });

  const tierColours = ["white", "#99D98B", "#97a6e8", "#C783E8", "#F5DFA6"];
  return (
    <>
      {!!props.neutralItems && (
        <>
          <Typography
            align={"center"}
            variant="h5"
            color="white"
            className="shadow"
          >
            Neutral Items
          </Typography>
          <Box
            alignItems={"start"}
            justifyContent={"space-evenly"}
            alignSelf={"center"}
            // className="neutral-enchant-container flex"
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
            gap={2}
            marginLeft={10}
          >
            {neutralItems.map((tierArr, i) => (
              <Box key={`neutral-${i}`} padding={0} margin={0} gridRow={1}>
                {tierArr.flat().length > 0 && (
                  <Typography
                    variant="h6"
                    fontWeight={"bold"}
                    marginLeft={4}
                    color={tierColours[i]}
                  >
                    Tier {i + 1}
                  </Typography>
                )}
                <NeutralItemGroup tierArr={tierArr} />
              </Box>
            ))}
            <Typography
              variant="h5"
              fontWeight="bold"
              gridRow={2}
              gridColumn={3}
              color="white"
              className="shadow"
              marginLeft={1}
            >
              Enchants
            </Typography>
            {enchants.map((tierArr, i) => (
              <Box key={`enchant-${i}`} padding={0} margin={0} gridRow={3}>
                <NeutralItemGroup tierArr={tierArr} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </>
  );
};
const NeutralItemGroup = ({ tierArr }: { tierArr: NeutralItemCounts[][] }) => {
  return (
    <Box padding={0} margin={0} gridRow={3}>
      {tierArr.map((x, itemIndex) => {
        if (x.length) {
          return (
            <Box key={itemIndex}>
              <NeutralItem tierArr={x}></NeutralItem>
            </Box>
          );
        }
      })}
    </Box>
  );
};
const NeutralItem = (props: { tierArr: NeutralItemCounts[] }) => {
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

import Items from "../../../types/Item"
import { NonProDataType } from "../../build"
import { ItemBuildImage } from "../itemBuild";
import { mostUsedNeutrals } from "./mostUsedNeutrals"
import { Box, Typography } from '@mui/material';

export const NeutralItems = (props: { data: NonProDataType[], itemData: Items }) => {
    const neutralItems = mostUsedNeutrals(props.data, props.itemData)
    // TODO add neutral item tier colors
    const mapped = neutralItems.map((itemArr) => itemArr.length < 3 ? [itemArr] : [itemArr.slice(0, 2), itemArr.slice(2, 4)])
    const tierColours = ['white', '#99D98B', '#97a6e8', '#C783E8', '#F5DFA6']

    return (
        <>
            {!!neutralItems.flat().length &&
                <>
                    <Typography align={'center'} variant='h5' color='white' >Neutral Items</Typography>
                    <Box alignItems={"start"} justifyContent={'space-evenly'} alignSelf={'center'} className="neutral-item-container flex">
                        {mapped.map((tierArr, i) => {
                            return (
                                <Box padding={0} margin={0}>
                                    {tierArr.flat().length > 0 &&
                                        <Typography variant='h6' fontWeight={'bold'} align={'center'} justifySelf={'center'} color={tierColours[i]} >Tier {i + 1}</Typography>
                                    }
                                    {tierArr.map((x, iii) => {
                                        if (x.length) {
                                            return <div className={`test ${i}`}>
                                                <NeutralItem key={i} idx={i} tierArr={x} data={props.data} itemData={props.itemData}></NeutralItem>
                                            </div>
                                        }
                                    })}
                                </Box>
                            )



                            //     return (
                            //         <NeutralItem key={i} idx={i} tierArr={tierArr} data={props.data} itemData={props.itemData}></NeutralItem>
                            //     )
                            // }
                        })
                        }
                    </Box>
                </>
            }
        </>
    )
}
const NeutralItem = (props: { idx: number; tierArr: any[]; itemData: Items; data: NonProDataType[]; }) => {
    return (
        <Box>
            <Box padding={1} paddingLeft={1} paddingTop={0.5} paddingBottom={0} className="flex">
                {props.tierArr.map((neutralItem, i) => {
                    const key: string = neutralItem[0]
                    const perc: number = neutralItem[1]['perc']
                    return (
                        <div key={i} className="neutral-item" >
                            <ItemBuildImage k={key} itemData={props.itemData} perc={perc} data={props.data}></ItemBuildImage>
                        </div>
                    )
                })}
            </Box>
        </Box>
    )
}
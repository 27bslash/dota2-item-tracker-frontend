import Items from "../../../types/Item"
import { NonProDataType } from "../../build"
import { ItemBuildImage } from "../itemBuild";
import { mostUsedNeutrals } from "./mostUsedNeutrals"
import { Box, Typography } from '@mui/material';

export const NeutralItems = (props: { data: NonProDataType[], itemData: Items }) => {
    const neutralItems = mostUsedNeutrals(props.data, props.itemData)
    return (
        <>
            {!!neutralItems.flat().length &&
                <>
                    <Typography align={'center'} variant='h5' color='white' >Neutral Items</Typography>
                    <Box alignItems={"center"} justifyContent={'center'} alignSelf={'center'} className="neutral-item-container flex">
                        {neutralItems.map((tierArr, i) => {
                            if (tierArr.length) {
                                return (
                                    <Box key={i} >
                                        <Typography variant='h6' align={'center'} justifySelf={'center'} color='white' >Tier {i + 1}</Typography>
                                        <Box padding={2} key={i} className="flex">
                                            {tierArr.map((neutralItem, i) => {
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
                        })}
                    </Box>
                </>
            }
        </>
    )
}
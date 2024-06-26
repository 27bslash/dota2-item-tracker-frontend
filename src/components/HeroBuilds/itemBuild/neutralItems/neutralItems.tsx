import { Box, Typography } from '@mui/material'
import { ItemBuildImage } from '../itemBuildCell/itemBuildImage'
import { NeutralItemsStats } from './mostUsedNeutrals'

export const NeutralItems = (props: { neutralItems: NeutralItemsStats }) => {
    // const neutralItems = mostUsedNeutrals(props.data, props.itemData)
    const mapped = Object.entries(props.neutralItems).map((itemArr) =>
        itemArr[1].length < 3
            ? [itemArr[1]]
            : [itemArr[1].slice(0, 2), itemArr[1].slice(2, 4)]
    )
    const tierColours = ['white', '#99D98B', '#97a6e8', '#C783E8', '#F5DFA6']
    return (
        <>
            {!!props.neutralItems && (
                <>
                    <Typography align={'center'} variant="h5" color="white">
                        Neutral Items
                    </Typography>
                    <Box
                        alignItems={'start'}
                        justifyContent={'space-evenly'}
                        alignSelf={'center'}
                        className="neutral-item-container flex"
                    >
                        {mapped.map((tierArr, i) => {
                            return (
                                <Box key={i} padding={0} margin={0}>
                                    {tierArr.flat().length > 0 && (
                                        <Typography
                                            variant="h6"
                                            fontWeight={'bold'}
                                            align={'center'}
                                            justifySelf={'center'}
                                            color={tierColours[i]}
                                        >
                                            Tier {i + 1}
                                        </Typography>
                                    )}
                                    {tierArr.map((x, itemIndex) => {
                                        if (x.length) {
                                            return (
                                                <div
                                                    key={itemIndex}
                                                    className={`test ${i}`}
                                                >
                                                    <NeutralItem
                                                        key={i}
                                                        idx={i}
                                                        tierArr={x}
                                                    ></NeutralItem>
                                                </div>
                                            )
                                        }
                                    })}
                                </Box>
                            )

                            //     return (
                            //         <NeutralItem key={i} idx={i} tierArr={tierArr} data={props.data} itemData={props.itemData}></NeutralItem>
                            //     )
                            // }
                        })}
                    </Box>
                </>
            )}
        </>
    )
}
const NeutralItem = (props: { idx: number; tierArr: any[] }) => {
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
                    const key: string = neutralItem['key']
                    const perc: number = neutralItem['perc']
                    return (
                        <div key={i} className="neutral-item">
                            <ItemBuildImage
                                k={key}
                                perc={perc}
                            ></ItemBuildImage>
                        </div>
                    )
                })}
            </Box>
        </Box>
    )
}

import { ItemComponents } from "../itemComponents/itemComponents";
import { CoreItem } from "../itemGroups/groupBytime";
import { ItemBuildImage } from "./itemBuildImage";

export const ItemBuildCell = (props: { itemkey: string; item: CoreItem; }) => {
    const { itemkey, item } = props
    const perc = item['adjustedValue']
    const avgTime = (Math.floor(item['time'] / 60))
    const disassemble = item['disassemble']
    const components = item['disassembledComponents']
    const orText = item['option'] || item['longOption'] ? 'or' : ''
    return (
        <div className="img-cell" >
            <div className='itembuild-img-cell flex' style={{ alignItems: 'center', justifyContent: 'end' }} >
                {components &&
                    <ItemComponents components={components} />
                }
                <div>
                    <ItemBuildImage k={itemkey} orText={orText} avgTime={avgTime} perc={perc}
                        disassemble={disassemble}></ItemBuildImage>
                    {item['option'] &&
                        <ItemBuildImage k={item['option']['choice']} avgTime={Math.floor(item['option']['time'] / 60)} perc={item['option']['targetValue']}
                            disassemble={disassemble}></ItemBuildImage>
                    }
                </div>
            </div>
        </div >)
}
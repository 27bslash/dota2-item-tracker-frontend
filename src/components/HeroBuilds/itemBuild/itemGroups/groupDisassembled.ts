import { RawItemBuild } from "../itemFitltering/itemFiltering";

export function groupDisassembledComponents(filteredData: RawItemBuild[]) {
    for (const item of filteredData) {
        const itemKey: string = item[0].replace(/__\d+/g, '');
        const itemTime: number = item[1]['time'];
        if (itemTime <= 60 && itemKey !== 'bottle') {
            continue;
        }
        if (item[1]['disassembledComponents'] && item[1]['option']) {
            item[1]['disassembledComponents'] = item[1]['disassembledComponents'].filter((x) => !(item[1]['option']!['choice'] === x[0])
            );
        }
    }
}
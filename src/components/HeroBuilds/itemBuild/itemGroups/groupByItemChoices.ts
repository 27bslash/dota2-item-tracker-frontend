import { CoreItem, GroupedCoreItems } from "./groupBytime";

function groupByItemChoices(res: GroupedCoreItems[]) {
    const choiceSet = new Set<string>();

    for (const itemGroup of res) {
        processItemGroup(itemGroup, 'core', choiceSet);
        processItemGroup(itemGroup, 'situational', choiceSet);
    }
}

function processItemGroup(itemGroup: any, type: string, choiceSet: Set<string>) {
    const otherType = type === 'core' ? 'situational' : 'core';

    for (let i = itemGroup[type].length - 1; i >= 0; i--) {
        const itemObject = itemGroup[type][i];

        if (!itemObject['option']) continue;

        const targetKey = itemObject['key'];
        const optionKey = itemObject['option']['choice'];

        if (choiceSet.has(targetKey) || choiceSet.has(optionKey)) continue;

        removeDuplicateItems(itemGroup, type, targetKey, optionKey, otherType);

        choiceSet.add(targetKey);
        choiceSet.add(optionKey);
    }
}

function removeDuplicateItems(itemGroup: any, type: string, targetKey: string, optionKey: string, otherType: string) {
    const idx = itemGroup[type].findIndex((x: CoreItem) => x['key'] === optionKey);
    const situationalIdx = itemGroup[otherType].findIndex((x: CoreItem) => x['key'] === optionKey);

    if (idx !== -1) itemGroup[type].splice(idx, 1);
    if (situationalIdx !== -1) itemGroup[otherType].splice(situationalIdx, 1);
}

export default groupByItemChoices
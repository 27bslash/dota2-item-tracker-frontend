import { CoreItem, GroupedCoreItems } from "./groupBytime";

function groupByItemChoices(res: GroupedCoreItems[]) {
    const choiceSet = new Set<string>();
    console.log('before', res)
    for (const itemGroup of res) {
        processItemGroup(res, itemGroup, 'core', choiceSet);
        processItemGroup(res, itemGroup, 'situational', choiceSet);
    }
}

function processItemGroup(
  allGroups: GroupedCoreItems[],
  itemGroup: GroupedCoreItems,
  type: "core" | "situational",
  choiceSet: Set<string>,
) {
  const otherType = type === 'core' ? 'situational' : 'core';

    for (let i = itemGroup[type].length - 1; i >= 0; i--) {
        const itemObject = itemGroup[type][i];

        if (!itemObject['option']) continue;

        const targetKey = itemObject['key'];
        const optionKey = itemObject['option']['choice'];

        if (choiceSet.has(targetKey!) || choiceSet.has(optionKey)) continue;

        markDuplicateItemsRemoved(allGroups, type, optionKey, otherType);

        choiceSet.add(targetKey!);
        choiceSet.add(optionKey);
    }
}

function markDuplicateItemsRemoved(
  allGroups: GroupedCoreItems[],
  type: "core" | "situational",
  optionKey: string,
  otherType: "core" | "situational",
) {
  for (const group of allGroups) {
        const item = group[type].find((x) => x['key'] === optionKey);
        const otherItem = group[otherType].find((x: CoreItem) => x['key'] === optionKey);

        if (item) {
            item.removed = true;
            item.removedReason = 'choice_duplicate';
        }
        if (otherItem) {
            otherItem.removed = true;
            otherItem.removedReason = 'choice_duplicate';
        }
  }
}

export default groupByItemChoices

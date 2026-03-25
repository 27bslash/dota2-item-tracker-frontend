import { Item, Items } from "../../../types/Item";
import { RawItemBuild } from "../itemFitltering/itemFiltering";
import { disassembledComponents } from "./disassembledComponents";

const shouldSkipComponent = (component: string): boolean => {
  return (
    component === "blink" ||
    component === "boots" ||
    component === "travel_boots" ||
    component === "ultimate_scepter"
  );
};

const checkBadQualNoComponents = (
  component: string,
  componentStats: Item,
  dataComponent: RawItemBuild,
  item: RawItemBuild,
): boolean => {
  if (
    (!componentStats["hint"] || !componentStats["attrib"]!.length) &&
    dataComponent[1]["time"] > 600
  ) {
    return true;
  }
  if (
    !component.includes("boots") &&
    component !== "ring_of_health" &&
    component !== "cornucopia" &&
    component !== "helm_of_iron_will" &&
    Math.abs(dataComponent[1]["time"] - item[1]["time"]) < 300 &&
    item[1]["value"] > 3
  ) {
    return true;
  }
  return false;
};

const checkCostRemoval = (
  componentStats: Item,
  dataComponent: RawItemBuild,
  item: RawItemBuild,
): boolean => {
  return (
    componentStats["cost"]! < 1500 &&
    dataComponent[1]["time"] > 700 &&
    item[1]["value"] * 2 > dataComponent[1]["value"]
  );
};

const checkFinalRemoval = (
  item: RawItemBuild,
  componentStats: Item,
  dataComponent: RawItemBuild,
): boolean => {
  return (
    item[1]["value"] > 3 &&
    item[1]["value"] * 2 > dataComponent[1]["value"] &&
    Math.abs(item[1]["time"] - dataComponent[1]["time"]) < 400 &&
    dataComponent[1]["time"] > 400 &&
    componentStats["cost"]! < 2000
  );
};

const checkSubRemoval = (
  componentStats: Item,
  item: RawItemBuild,
  dataComponent: RawItemBuild,
) => {
  return (
    componentStats["components"] &&
    componentStats["cost"]! < 900 &&
    Math.abs(item[1]["time"] - dataComponent[1]["time"]) < 300
  );
};

const checkSpecialComponents = (component: string): boolean => {
  return component === "sange" || component === "soul_booster";
};

const checkNoHintLate = (
  componentStats: Item,
  dataComponent: RawItemBuild,
): boolean => {
  return !componentStats["hint"] && dataComponent[1]["time"] > 1200;
};

const checkTimeLate = (dataComponent: RawItemBuild): boolean => {
  return dataComponent[1]["time"] > 1800;
};

const shouldRemoveComponentBadQual = (
  component: string,
  componentStats: Item,
  dataComponent: RawItemBuild,
  item: RawItemBuild,
): boolean => {
  if (!componentStats["components"]) {
    return checkBadQualNoComponents(
      component,
      componentStats,
      dataComponent,
      item,
    );
  }
  return !componentStats["hint"] && dataComponent[1]["time"] > 1500;
};

const shouldRemoveComponentForAnyReason = (
  component: string,
  componentStats: Item,
  dataComponent: RawItemBuild,
  item: RawItemBuild,
): boolean => {
  if (checkCostRemoval(componentStats, dataComponent, item)) return true;
  if (checkFinalRemoval(item, componentStats, dataComponent)) return true;
  if (checkSubRemoval(componentStats, item, dataComponent)) return true;
  if (checkSpecialComponents(component)) return true;
  if (checkNoHintLate(componentStats, dataComponent)) return true;
  if (checkTimeLate(dataComponent)) return true;
  return false;
};

const getComponentKey = (
  component: string,
  itemDupeNum: RegExpMatchArray | null,
  keys: string[],
): { idx: number; key: string } => {
  if (itemDupeNum) {
    const key = `${component}_${itemDupeNum}`;
    return { idx: keys.findIndex((pot) => pot === key), key };
  }
  return { idx: keys.indexOf(component), key: component };
};

export const recursive_remove = (
  item: RawItemBuild,
  itemdata: Items,
  components: string[],
  data: RawItemBuild[],
  keys: string[],
  removedComponents: string[],
) => {
  const badQuals = ["component", "common", "consumable", "secret_shop"];
  for (const component of components) {
    if (shouldSkipComponent(component)) {
      continue;
    }

    const itemDupeNum = item[0].match(/\d+/g);
    const { idx, key: componentKey } = getComponentKey(
      component,
      itemDupeNum,
      keys,
    );
    const componentStats = itemdata["items"][component];
    const dataComponent = data[idx];

    if (!dataComponent) {
      continue;
    }

    if (badQuals.includes(componentStats["qual"]!)) {
      if (
        shouldRemoveComponentBadQual(
          component,
          componentStats,
          dataComponent,
          item,
        )
      ) {
        removedComponents.push(componentKey);
        continue;
      }
    }

    if (
      shouldRemoveComponentForAnyReason(
        component,
        componentStats,
        dataComponent,
        item,
      )
    ) {
      removedComponents.push(componentKey);
    }
  }
  return removedComponents;
};
export const allComponents = (itemKey: string, itemdata: Items): string[] => {
  const res: string[] = [];
  const itemstats = itemdata["items"][itemKey];
  if (!itemstats) {
    console.log("no components for ", itemKey);
    return res;
  }
  const components = itemdata.items[itemKey]?.components;
  if (!components) return res;
  for (const component of components) {
    res.push(component);
    const componentStats = itemdata["items"][component];
    if (componentStats?.components) {
      for (const subComponent of componentStats["components"]) {
        res.push(subComponent);
      }
    }
  }
  return res;
};
const shouldRemoveItem = (
  itemStats: Item,
  itemTime: number,
  itemKey: string,
): boolean => {
  if (itemTime > 1000 && itemStats["cost"]! < 500) {
    return true;
  }
  if (
    !itemStats["hint"] &&
    itemTime > 1000 &&
    ["common", "component", "secret_shop"].includes(itemStats["qual"]!)
  ) {
    return true;
  }
  if (
    !itemStats["hint"] &&
    ["component", "secret_shop"].includes(itemStats["qual"]!)
  ) {
    return true;
  }
  if (
    itemTime > 1800 &&
    itemStats["cost"]! < 2000 &&
    itemKey !== "aghanims_shard" &&
    itemKey !== "gem"
  ) {
    console.log("remove low cost item after 30 mins: ");
    return true;
  }
  return false;
};

const shouldDisassemble = (
  itemKey: string,
  components: string[],
  itemValue: number,
  disassembleable: string[],
): boolean => {
  return (
    components &&
    itemValue > 10 &&
    (disassembleable.includes(itemKey.replace(/__\d+/g, "")) ||
      components.includes("kaya") ||
      components.includes("sange"))
  );
};

const removeFilteredItems = (
  toRemove: Set<string>,
  keys: string[],
  data: RawItemBuild[],
): void => {
  const seenItems: string[] = [];
  for (const item of toRemove) {
    if (seenItems.includes(item)) {
      continue;
    }
    const filteredKeys = keys.filter((x) => {
      return x.replace(/__\d+/g, "") === item;
    });
    for (const k of filteredKeys) {
      const idx = keys.indexOf(k);
      if (idx !== -1) {
        data.splice(idx, 1);
        keys.splice(idx, 1);
        seenItems.push(item);
      }
    }
  }
};

export const filterComponents = (data: RawItemBuild[], itemData: Items) => {
  const toRemove = new Set<string>();
  const keys = data.map((x) => x[0]);
  const removedComponents: string[] = [];
  const disassembleable = ["echo_sabre", "mask_of_madness"];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const itemKey: string = item[0];
    const itemTime: number = item[1]["time"];
    const itemStats = itemData["items"][itemKey.replace(/__\d+/g, "")];

    if (!itemStats) {
      continue;
    }

    if (shouldRemoveItem(itemStats, itemTime, itemKey)) {
      toRemove.add(data[i][0]);
      continue;
    }

    if (toRemove.has(itemKey)) continue;

    if (itemStats.components) {
      const components: string[] = itemStats.components;
      const removedComps = recursive_remove(
        item,
        itemData,
        components,
        data,
        keys,
        removedComponents,
      );
      removedComps.forEach((c) => toRemove.add(c));

      if (
        shouldDisassemble(
          itemKey,
          components,
          item[1]["value"],
          disassembleable,
        )
      ) {
        disassembledComponents(
          components,
          data,
          i,
          itemData,
          item,
          itemKey,
          keys,
        );
      }
    }
  }

  console.log("remove", toRemove);
  removeFilteredItems(toRemove, keys, data);
  return data;
};

export default filterComponents;

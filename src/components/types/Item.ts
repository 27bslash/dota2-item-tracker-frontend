import { SpecialValues } from './heroData';
export type Item = {
    attrib?: Array<{ footer: string, header: string, key: string, value: string }> | null,
    cd: number[] | number,
    charges?: boolean,
    components?: string[],
    cost?: number,
    created?: boolean,
    description?: string[],
    dname: string,
    hint?: string[],
    id: number,
    img?: string,
    lore?: string,
    mc?: number[] | number,
    notes?: string,
    qual?: string,
    tier?: number,
    SpecialValues?: SpecialValues,
}
export type Items = {
    items: { [key: string]: Item }
}
export default Items
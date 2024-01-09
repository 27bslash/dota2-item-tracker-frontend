export type Item = {
    attrib?: Array<{ footer: string, header: string, key: string, value: string }> | null,
    cd: number[] | boolean,
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
    mc?: number[] | boolean,
    notes?: string,
    qual?: string,
    tier?: number,
}
export type Items = {
    items: { [key: string]: Item }
}
export default Items
type Item = {
    attrib?: Array<{ footer: string, header: string, key: string, value: string }>,
    cd: number,
    charges: boolean,
    components?: string[],
    cost?: number,
    created: boolean,
    description?: string[],
    dname: string,
    hint?: string[],
    id: number,
    img: string,
    lore?: string,
    mc?: number,
    notes?: string,
    qual: string,
}
type Items = {
    items: { [key: string]: Item }
}
export default Items
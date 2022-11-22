const stringSearch = (data: any, property: string, value: string) => {
    if (!data.length) return []
    const m = data.filter((x: any) => x[property] === value)
    return m
}
export default stringSearch
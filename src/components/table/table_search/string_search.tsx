const stringSearch = (data: any, property: string, value: string) => {
    if (!data.length) return []
    const m = [...data].filter((x: any) => {
        // console.log(x[property], value)
        return String(x[property]).toLowerCase() === value.toLowerCase()
    })
    return m
}
export default stringSearch
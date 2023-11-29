const colorTooltip = (colorArray: [{ ability: string, color: number[] }], abilityName: string) => {
    if (!colorArray) return ''
    let color = ''
    for (const a of colorArray) {
        if (a.ability === abilityName) {
            color = `radial-gradient(circle at top left, rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}) 0%, #182127 160px`
        }
    }
    return color
}
export default colorTooltip
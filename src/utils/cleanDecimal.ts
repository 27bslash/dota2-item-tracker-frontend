export const cleanDecimal = (decimal: string | number) => {
    if (typeof (decimal) === 'string') {
        return String(parseFloat(decimal).toFixed(2)).replace(/\.00/, '')
    } else {
        return String((decimal).toFixed(2)).replace(/\.00/, '')
    }
}
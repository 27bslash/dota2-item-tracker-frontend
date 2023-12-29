export const cleanDecimal = (decimal: string | number) => {
    if (typeof (decimal) === 'string') {
        return String(parseFloat(decimal).toFixed(2)).replace(/\.00/, '')
    } else if (typeof (decimal) === 'number') {
        return String((decimal).toFixed(2)).replace(/\.00/, '')
    } else {
        return '0'
    }
}
export const medianValue = (values: number[]) => {
    values.sort((a,b) => a-b)
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
}
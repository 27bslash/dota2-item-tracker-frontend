export const fetchData = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
}
export const bulkRequest = async (baseUrl: string, docLength: number) => {
    const urlList = []
    const chunk = Math.ceil(docLength / 6)
    let skip = 0
    for (let i = 0; i < +docLength; i += chunk) {
        const url = `${baseUrl}?skip=${skip}&length=${chunk}`
        urlList.push(url)
        skip += chunk
    }
    const data = await Promise.all(
        urlList.map((innerPromiseArray) => {
            return fetchData(innerPromiseArray)
        })
    );
    return data
}

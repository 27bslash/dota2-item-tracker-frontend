export const fetchData = async (url: string) => {
    const newUrl = url.replace(/(\?.*?)\?(.*)/gm, '$1&$2')
    let response = await fetch(newUrl)
    if (response.status === 200) return await response.json()
    if (response.status === 304) {
        response = await fetch(newUrl.replace(/&time=\d*/, ''))
        return await response.json()
    }
}
export const bulkRequest = async (
    baseUrl: string,
    docLength: number,
    start: number
) => {
    const urlList = []
    let chunk = Math.ceil((docLength - start) / 6)
    if (chunk < 10) chunk = Math.ceil((docLength - start) / 3)
    let skip = start
    for (let i = 0; i < +docLength - start; i += chunk) {
        const url = `${baseUrl}?skip=${skip}&length=${chunk}`
        urlList.push(url)
        skip += chunk
    }
    const data = await Promise.all(
        urlList.map((innerPromiseArray) => {
            return fetchData(innerPromiseArray)
        })
    )
    return data
}

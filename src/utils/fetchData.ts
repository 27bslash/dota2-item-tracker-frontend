export const fetchData = async (url: string, retries = 2, delay = 1000) => {
    const newUrl = url.replace(/(\?.*?)\?(.*)/gm, '$1&$2')
    for (let i = 0; i < retries; i++) {
        let response = await fetch(newUrl)
        if (response.status === 200) return await response.json()
        if (response.status === 304) {
            response = await fetch(newUrl.replace(/&time=\d*/, ''))
            return await response.json()
        } else if (response.status === 429) {
            const retryAfter = response.headers.get('retry-after')
            const waitTime = retryAfter
                ? parseInt(retryAfter, 10) * 1000
                : delay * (i + 1)
            console.log(
                `Rate limited. ${url} Retrying in ${waitTime / 1000} seconds...`
            )
            await new Promise((res) => setTimeout(res, waitTime))
        }
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

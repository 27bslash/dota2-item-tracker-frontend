import { useEffect, useState } from "react"
import { baseApiUrl } from "../../../App"
import { fetchData, bulkRequest } from "../../../utils/fetchData"
import { NonProDataType } from "../../builds/build"

export const useFetchData = (heroName: string) => {
    const [nonProData, setNonProData] = useState<NonProDataType[]>()
    useEffect(() => {
        (async () => {
            const countDocsUrl = `${baseApiUrl}hero/${heroName}/count_docs?collection=non-pro`
            const docLength = await fetchData(countDocsUrl)
            let merged = []
            let data = []
            const matchDataUrl = 'https://0f2ezc19w3.execute-api.eu-west-2.amazonaws.com/dev/'
            if (docLength > 50) {
                data = await bulkRequest(`${matchDataUrl}hero/${heroName}/item_build`, docLength)
                merged = data.flat()
            } else {
                data = await fetchData(`${matchDataUrl}hero/${heroName}/item_build`)
                merged = data.flat()
            }
            setNonProData(merged.filter((x: any) => x.abilities && x.items))
        })()

    }, [])
    if (nonProData) return nonProData
}
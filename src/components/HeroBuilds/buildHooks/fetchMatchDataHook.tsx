import { useEffect, useState } from 'react'
import { baseApiUrl } from '../../../App'
import { fetchData, bulkRequest } from '../../../utils/fetchData'
import { useParams } from 'react-router'
import { NonProDataType } from '../types'

export const useFetchData = (heroName: string) => {
    const [nonProData, setNonProData] = useState<NonProDataType[]>()
    const params = useParams()
    useEffect(() => {
        const async_get = async () => {
            const countDocsUrl = `${baseApiUrl}hero/${heroName}/count_docs?collection=non-pro`
            const docLength = await fetchData(countDocsUrl)
            let merged: NonProDataType[] = []
            let data = []
            if (docLength > 50) {
                data = await bulkRequest(
                    `${baseApiUrl}hero/${heroName}/item_build`,
                    docLength,
                    0
                )
                merged = data.flat()
            } else {
                data = await fetchData(
                    `${baseApiUrl}hero/${heroName}/item_build`
                )
                merged = data.flat()
            }
            setNonProData(
                merged.filter(
                    (match) =>
                        match.abilities &&
                        match.items &&
                        (params.patch ? match.patch === params.patch : true)
                )
            )
        }
        async_get()
    }, [])
    if (nonProData) return nonProData
}

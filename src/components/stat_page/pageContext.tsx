import { ReactNode, createContext, useContext } from 'react'
import { TableSearchResults } from '../table/table_search/types/tableSearchResult.types'
import DotaMatch from '../types/matchData'
import Items from '../types/Item'
import { PageHeroData } from '../types/heroData'
import Hero from '../types/heroList'
type PageContextType = {
    searchRes: TableSearchResults | undefined
    filteredData: DotaMatch[]
    totalMatchData: DotaMatch[]
    itemData: Items | undefined
    heroData: PageHeroData
    heroList: Hero[]
    playerList: string[]
    nameParam: string
    updateSearchResults: (
        searchObj?: TableSearchResults | string | number,
        searchResKey?: string,
        matchKey?:
            | 'items'
            | 'item_neutral'
            | 'starting_items'
            | 'name'
            | 'role'
            | 'hero'
            | 'abilities'
            | 'variant',
        resultKey?: string,
        hero?:string
    ) => void
}
const PageContext = createContext<PageContextType | null>(null)
type PageContextProviderProps = {
    children: ReactNode
    value: PageContextType
}
const PageContextProvider = ({ children, value }: PageContextProviderProps) => {
    return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}
export const usePageContext = () => {
    const context = useContext(PageContext)
    if (!context) {
        throw new Error(
            'usePageContext must be used within a PageContextProvider'
        )
    }
    return context
}
export default PageContextProvider

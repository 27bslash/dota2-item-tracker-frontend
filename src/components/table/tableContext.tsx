import { createContext, useContext } from "react"
import DotaMatch from "../types/matchData"
import { RoleStrings } from "../home/home"

import { TableSearchResults } from "./table_search/types/tableSearchResult.types"
interface TableContextType {
    row: DotaMatch,
    role: RoleStrings
    showStarter: boolean
    updateMatchData: (data: DotaMatch[], searchValue?: TableSearchResults, types?: string[]) => void;
}
type tableContextProviderProps = {
    children: React.ReactNode
    value: TableContextType
}
const TableContext = createContext<TableContextType | null>(null)
export const TableContextProvider = ({ children, value }: tableContextProviderProps) => {
    return (
        <TableContext.Provider value={value}>{children}</TableContext.Provider>
    )
}
export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a tableContextProvider');
    }
    return context
}
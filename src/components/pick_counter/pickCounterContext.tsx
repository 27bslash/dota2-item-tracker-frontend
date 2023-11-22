import { createContext, useContext } from "react";
import DotaMatch from "../types/matchData";
import { MatchDataAdj } from "../stat_page/page";
import { RoleStrings } from "../home/home";
import PickStats from "../types/pickStats";
type PickCounterContextType = {
    children: React.ReactNode
    value: contextValue
}
type contextValue = {
    matchData: DotaMatch[]
    updateMatchData: MatchDataAdj['updateMatchData']
    reset: () => void;
    type: string
    role: RoleStrings
    roleSearch: (data: DotaMatch[],role: RoleStrings) => void
    totalPicks: PickStats
    heroColor: string
    nameParam: string
}

const PickCounterContext = createContext<contextValue | null>(null);
export const PickCounterContextProvider = ({ children, value }: PickCounterContextType) => {

    return (
        <PickCounterContext.Provider value={value}>{children}</PickCounterContext.Provider>
    )
}
export const usePickCounterContext = () => {
    const context = useContext(PickCounterContext);
    if (!context) {
        throw new Error('PickCounterContext must be used within a PickCounterContextProvider');
    }
    return context
}
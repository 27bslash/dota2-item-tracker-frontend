import { matchSorter } from "match-sorter"
import { useEffect, useState } from "react"

export const useFilterPlayers = (playerList: string[], value: string) => {
    const [sortedPlayers, setSortedPlayers] = useState<string[]>([])
    useEffect(() => {
        if (value.length > 1) {
            const srtedPlayers = filterPlayers(playerList, value).slice(0, 8)
            setSortedPlayers(srtedPlayers)
        } else {
            setSortedPlayers([])
        }
    }, [value])
    return sortedPlayers
}
export const filterPlayers = (accounts: string[], value: string) => {
    const values = substituteLettersForNumbers(value);
    const result: string[][] = [];
    values.forEach((value) => {
        const srtedPlayers = matchSorter(accounts, value, {
            threshold: matchSorter.rankings.ACRONYM,
        });
        result.push(srtedPlayers);
    });
    return result.flat()
}
const substituteLettersForNumbers = (string: string) => {
    const allLetterCombos = new Set([string])
    const letterPairs: { [key: string]: string } = { a: "4", o: "0", 1: "i", 5: "s" };
    const strArr: string[] = string.split("");
    strArr.forEach((char, i: number) => {
        const keys = Object.keys(letterPairs);
        const values = Object.values(letterPairs);
        const temp = string.split("")
        if (keys.includes(char)) {
            const newChar = letterPairs[char];
            temp[i] = newChar;
            allLetterCombos.add(temp.join(""));
        } else if (values.includes(char)) {
            const newChar = keys.find((key) => letterPairs[key] === char);
            if (newChar) temp[i] = newChar;
            allLetterCombos.add(temp.join(""));
        }
    })
    return allLetterCombos;
};
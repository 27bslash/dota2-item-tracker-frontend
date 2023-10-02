export const exists = (element: any[] | {} | undefined) => {
    if (!element) {
        return false
    } else if (Object.keys(element).length) {
        return true
    }
}
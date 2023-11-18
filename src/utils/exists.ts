export const exists = (element: unknown | Record<string, unknown> | undefined) => {
    if (!element) {
        return false
    } else if (Object.keys(element).length) {
        return true
    }
}
type DraftImageProps = {
    heroName: string
    highlight: boolean
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}
const DraftImage = ({
    heroName,
    highlight,
    onClick,
}: DraftImageProps) => {
    const cls = highlight ? 'draft-icon icon-highlight' : 'draft-icon'
    return (
        <img
            onError={(e) => {
                try {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.src = '/images/minimap_icons/error.jpg'
                } catch (error) {
                    console.error('Image loading error:', error)
                }
            }}
            alt={heroName}
            src={`/images/minimap_icons/${heroName}.jpg`}
            className={cls}
            onClick={onClick}
        ></img>
    )
}
export default DraftImage

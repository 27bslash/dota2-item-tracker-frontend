type DraftImageProps = {
    heroName: string
    highlight: boolean
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}
const DraftImage = ({ heroName, highlight, onClick }: DraftImageProps) => {
    const cls = highlight ? 'draft-icon icon-highlight' : 'draft-icon'
    return (
        <img
            alt={heroName}
            title={heroName}
            src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${heroName}.png`}
            className={cls}
            onClick={onClick}
        ></img>
    )
}
export default DraftImage

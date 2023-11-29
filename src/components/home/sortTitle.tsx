import { Typography } from "@mui/material"

export const SortTitle = ({ role, sort }: { sort: string, role?: string }) => {
    const displayRole = role ? role.replace(/_/, '') : ''
    const sortTitle = sort === 'trends' ? `Trending ${displayRole} Heroes` : ''
    return (
        <>
            {sort === 'trends' && (
                <Typography className='sort-title' variant="h3" gutterBottom>
                    {sortTitle}
                </Typography>
            )}
            {sort !== 'trends' &&
                <>
                    {sort !== 'winrate' ?
                        (
                            <Typography className='sort-title' variant="h3" gutterBottom>
                                Most {displayRole} {sort}
                            </Typography>
                        ) : (
                            <Typography className='sort-title' variant="h3" gutterBottom>
                                highest {displayRole} {sort}
                            </Typography>
                        )}
                </>
            }
        </>
    )
}
import { Grid } from "@mui/material";

interface GridContainerProps {
    className: string,
    width: string,
    children: React.ReactNode
}
function GridContainer({ className, children, width }: GridContainerProps) {
    return (
        className.includes('right')
            ? (
                <Grid className={`hero-grid ${className}`} container spacing={0} sx={{ width: `${width}!important` }}>
                    {children}
                </Grid>
            ) : (
                <Grid className={`hero-grid ${className}`} container spacing={3} sx={{ width }}>
                    {children}
                </Grid>
            )

    );
}
export default GridContainer
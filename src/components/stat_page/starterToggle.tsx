import { FormControlLabel, styled, Switch, SwitchProps } from '@mui/material';
import { theme } from "../.."

const ToggleSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        '&.Mui-checked': {
            // transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : 'secondary',
                opacity: 1,

            },
            '&.Mui-disabled + .MuiSwitch-track': {
                backgroundColor: 'red',
            },
        },
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#606060',
        opacity: 1,
    }
}))

export const StarterToggle = ({ updateStarter }: { updateStarter: () => void }) => {
    return (
        <div className="starter-toggle">
            <FormControlLabel
                value="start"
                control={<ToggleSwitch color="success" onChange={updateStarter} />}
                label="Starting Items"
                labelPlacement="start"
                sx={{ padding: '4px 0px 4px 8px', backgroundColor: theme.palette.primary.main, borderRadius: '5px', border: ' solid 2px black', margin: '0', marginRight: 'auto', }}
            />
        </div>
    )
}
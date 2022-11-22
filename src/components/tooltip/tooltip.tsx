import { Tooltip } from "@mui/material"

const Tip = (props: any) => {
    return (
        <Tooltip {...props}
            title=
            {props.component}
        >
            <div className="wrap">
                {props.children}
            </div>
        </Tooltip>
    )
}
export default Tip
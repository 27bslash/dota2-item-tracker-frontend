import { Tooltip } from "@mui/material"

const Tip = (props: any) => {
    console.log(props.component)
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
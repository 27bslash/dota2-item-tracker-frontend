const TooltipLore = (props: any) => {

    return (
        <div className="tooltip-lore">
            {props.itemProperties.language &&
                <p>{props.itemProperties.language.lore}</p>
            }
            {props.itemProperties.lore_loc &&
                <p>{props.itemProperties.lore_loc}</p>
            }
        </div>
    )
}
export default TooltipLore
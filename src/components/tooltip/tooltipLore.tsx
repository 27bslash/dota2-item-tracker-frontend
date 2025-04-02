const TooltipLore = (props: any) => {
  return (
    props.itemProperties.lore && (
      <div className="tooltip-lore">
        <p>{props.itemProperties.lore}</p>
        {props.itemProperties.lore_loc && (
          <p>{props.itemProperties.lore_loc}</p>
        )}
      </div>
    )
  );
};
export default TooltipLore;

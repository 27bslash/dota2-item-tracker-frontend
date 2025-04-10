type TooltipLoreProps = {
  itemProperties: {
    lore?: string;
    lore_loc?: string;
  };
};

const TooltipLore = (props: TooltipLoreProps) => {
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

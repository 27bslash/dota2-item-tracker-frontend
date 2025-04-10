import { Tooltip } from "@mui/material";
import { ReactNode } from "react";

type TipProps = {
  component: ReactNode;
  children: ReactNode;
};

const Tip = ({ component, children, ...rest }: TipProps) => {
  return (
    <Tooltip {...rest} title={component}>
      <div className="wrap" style={{ display: "flex" }}>
        {children}
      </div>
    </Tooltip>
  );
};

export default Tip;

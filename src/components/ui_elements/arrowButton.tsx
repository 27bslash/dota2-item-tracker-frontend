import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Fade } from "@mui/material";
import { useState, useEffect, ReactElement } from "react";

interface arrowProps {
  style?: { [key: string]: string };
  transition: string;
  transitionTime?: number;
  children: ReactElement;
}
const ArrowButton = (props: arrowProps) => {
  const [icon, setIcon] = useState(faCaretDown);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) {
      setIcon(faCaretDown);
    } else {
      setIcon(faCaretUp);
    }
  }, [open]);
  return (
    <div onMouseLeave={() => setOpen(false)}>
      <div
        className="arrow-button"
        style={props.style}
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={icon} color="white" />
      </div>
      {props.transition === "collapse" && (
        <Collapse in={open}>{props.children}</Collapse>
      )}
      {props.transition === "fade" && (
        <Fade in={open} timeout={props.transitionTime || 300}>
          {props.children}
        </Fade>
      )}
    </div>
  );
};
export default ArrowButton;

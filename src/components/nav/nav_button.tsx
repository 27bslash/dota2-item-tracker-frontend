import Button from "@mui/material/Button";
import { theme } from "../../main";

const HomeButton = (props: { text: string; link?: string }) => {
  return (
    <Button
      sx={{
        padding: "10px !important",
        marginRight: "10px",
        bgcolor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.secondary.main,
        },
      }}
      href={props.link}
      size="small"
      variant="contained"
      className="nav-button"
      id={props.text}
    >
      {props.text}
    </Button>
  );
};
export default HomeButton;

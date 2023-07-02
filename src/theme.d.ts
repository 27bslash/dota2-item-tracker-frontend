import { ThemeOptions } from "@mui/material/styles";
import "@mui/material";
declare module '@mui/material/styles' {

    interface Palette {
        table: {
            main: string;
            secondary: string
        };
    }
    interface PaletteOptions {
        table: {
            main: string;
            secondary: string
        };
    }
}

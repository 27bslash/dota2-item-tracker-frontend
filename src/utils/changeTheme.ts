import { theme } from ".."

export const generateColorPalette = (sourceColor: string[], heroName?: string, options?: any) => {
    // Generate a Material-UI color palette based on the source color
    if (!options) {
        options = {}
    }

    const colorMap = sourceColor.map((x) => +x <= 255 ? parseInt(x) : 255)
    // console.log('rgba', colorMap)
    const [r, g, b] = [+colorMap[0], +colorMap[1], +colorMap[2]]
    const hsl = RGBToHSL(r, g, b)
    const dark = [...hsl]
    const light = [...hsl]
    // console.log(dark)
    dark[2] -= 20
    if (dark[2] <= 20) {
        dark[2] = options['bg-lightness'] || 14
    } else if (heroName) {
        dark[2] = 30
    }
    // dark[2] = (dark[2] + 100) % 100
    // dark[1] = 50
    // console.log(dark)
    const tableDark = [...dark]
    const tableLight = [...dark]
    dark[0] -= options['bg-hue'] || 10
    dark[0] = (dark[0] + 360) % 360
    light[2] = options['button-light'] || 50
    // console.log('light color', light, dark)
    // console.log(sourceColor)
    const [h, s, l] = dark
    const background = hslToHex(h, s, l)
    // tableDark[0] -= 8
    tableDark[0] = (tableDark[0] + 360) % 360
    tableDark[2] = options['table-dark'] || 10
    // tableDark[1] = 30
    tableLight[2] = options['table-light'] || 14
    // tableLight[1] = 30
    theme.palette.background.default = background
    document.body.style.background = background
    // button colour
    // console.log(dark, light)
    if (dark[1] > 65) {
        light[2] = 30
        // light[1] = 50
        console.log(heroName, dark[1])
    } else if (dark[1] > 60) {
        light[2] = 40
    }
    theme.palette.primary.main = hslToHex(light[0], light[1], light[2])
    theme.palette.secondary.main = hslToHex(light[0], light[1], 45)
    theme.palette.secondary.dark = hslToHex(light[0], light[1], 30)
    theme.palette.table.main = hslToHex(tableDark[0], tableDark[1], tableDark[2])
    theme.palette.table.secondary = hslToHex(tableLight[0], tableLight[1], tableLight[2])
    return {
        background: { default: background },
        primary: theme.palette.primary.main,
        table: {
            main: hslToHex(tableDark[0], tableDark[1], tableDark[2]),
            secondary: hslToHex(tableLight[0], tableLight[1], tableLight[2])
        }
    }

}
const RGBToHSL = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};
function hslToHex(hue: number, saturation: number, lightness: number) {
    // const hue = Math.round(h * 360);
    // const saturation = Math.round(s * 100);
    // const lightness = Math.round(l * 100);

    const hslToRgb = (h: number, s: number, l: number) => {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;

        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
        };
    };

    const { r, g, b } = hslToRgb(hue, saturation / 100, lightness / 100);
    // console.log(r, g, b)
    const toHex = (value: number) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const hexColor = '#' + toHex(r) + toHex(g) + toHex(b);
    return hexColor;
}
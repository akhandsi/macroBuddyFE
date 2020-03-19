import {PaletteOptions} from "@material-ui/core/styles/createPalette";
import {createMuiTheme, Theme} from "@material-ui/core";

export interface ITheme {
    palette: PaletteOptions;
}

/**
 * Theme utils provides methods to control application theme.
 */
export class ThemeUtil {
    private static theme: ITheme = {
        palette: {
            type: 'dark',
        },
    };

    /**
     * Get current theme of the application.
     */
    public static getTheme(): Theme {
        return createMuiTheme({
            ...ThemeUtil.theme
        })
    }
}

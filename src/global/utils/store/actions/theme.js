import { AUTOTHEME, THEME } from "../reducers/theme";

const setAutoTheme = () => {
    return {
        type: AUTOTHEME
    }
};

const setCustomTheme = theme => {
    return {
        type: THEME,
        theme
    }
};

export default {
    setAutoTheme,
    setCustomTheme
}

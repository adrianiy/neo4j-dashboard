import { AUTOTHEME, THEME, SIZE } from "../reducers/theme";

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

const setSize = size => {
    return {
        type: SIZE,
        size
    }
}

export default {
    setAutoTheme,
    setCustomTheme,
    setSize
}

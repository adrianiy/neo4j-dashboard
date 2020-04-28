import { AUTOTHEME, THEME, SIZE, TOGGLEFS } from "../reducers/theme";

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

const toggleFullScreen = () => {
    return {
        type: TOGGLEFS
    }
}

export default {
    setAutoTheme,
    setCustomTheme,
    setSize,
    toggleFullScreen
}

const setAutoTheme = theme => {
    return {
        type: 'SET_AUTO_THEME',
        payload: theme
    }
};

const setCustomTheme = theme => {
    return {
        type: 'SET_THEME',
        payload: theme
    }
};

export default {
    setAutoTheme,
    setCustomTheme
}

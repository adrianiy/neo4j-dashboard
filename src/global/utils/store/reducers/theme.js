export const AUTOTHEME = "SET_AUTO_THEME";
export const THEME = "SET_THEME";

const themes = {
    light: {
        id: "light",
        codemirror: "cypher cypher-light",
        relColor: "#000",
    },
    dark: {
        id: "dark",
        codemirror: "cypher cypher-dark",
        relColor: "#fff",
    },
};

const manageAutoTheme = () => {
    const moment = new Date().getHours();
    if (moment >= 7 && moment < 20) {
        return "light";
    } else {
        return "dark";
    }
};

const currentTheme = (state = themes[manageAutoTheme()], action) => {
    switch(action.type) {
        case AUTOTHEME:
            return {
                ...state,
                ...themes[manageAutoTheme()]
            };
        case THEME:
            return {
                ...state,
                ...themes[action.theme]
            };
        default:
            return state;
    }
};

export default currentTheme;

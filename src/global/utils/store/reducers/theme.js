export const AUTOTHEME = "SET_AUTO_THEME";
export const THEME = "SET_THEME";
export const SIZE = "SET_SIZE";

const themes = {
    light: {
        id: "light",
        _id: "light",
        codemirror: "cypher cypher-light",
        relColor: "#000",
        relColorInternal: '#fff'
    },
    dark: {
        id: "dark",
        _id: "dark",
        codemirror: "cypher cypher-dark",
        relColor: "#fff",
        relColorInternal: '#000'
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

const initialState = {
    ...themes[manageAutoTheme()],
    ...{ _id: 'auto' },
    ...{ size: 'small' }
}

const currentTheme = (state = initialState, action) => {
    switch(action.type) {
        case AUTOTHEME:
            return {
                ...state,
                ...themes[manageAutoTheme()],
                ...{ _id: "auto" }
            };
        case THEME:
            return {
                ...state,
                ...themes[action.theme]
            };
        case SIZE:
            return {
                ...state,
                ...{ size: action.size }
            }
        default:
            return state;
    }
};

export default currentTheme;

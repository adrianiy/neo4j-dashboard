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
        case 'SET_AUTO_THEME':
            return {
                ...state,
                ...themes[manageAutoTheme()]
            };
        case 'SET_THEME':
            return {
                ...state,
                ...themes[action.payload]
            };
        default:
            return state;
    }
};

export default currentTheme;

import React from "react"

export const themes = {
    light: {
        id: 'light',
        codemirror: 'default',
        relColor: '#000'
    },
    dark: {
        id: 'dark',
        codemirror: 'material' ,
        relColor: '#fff'
    }
}

export const ThemeContext = React.createContext(themes.light);

export const manageAutoTheme = () => {
    const moment = (new Date()).getHours();
    if (moment >= 7 && moment < 20) {
        return 'light';
    } else {
        return 'dark';
    }
}

import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import Login from './components/login/Login';
import Comander from './components/comander/Comander';
import Header from './components/header/Header';

import { doLogout } from './service/neo.service';
import { themes, manageAutoTheme, ThemeContext } from './global/utils/hooks/theme';
import { cls } from './global/utils';

import './App.css';

function App() {
    const [cookies, setCookie] = useCookies(["neo4jDash.sess"]);
    const [sessionId, setSessionId] = useState(null);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => manageAutoTheme('auto'));

    const loginHandler = useCallback((response) => {
        setCookie("neo4jDash.sess", JSON.stringify(response));
        setSessionId(response.sessionId);
        setUser(response.user);
    }, [setCookie]);

    useEffect(() => {
        if (cookies["neo4jDash.sess"] && cookies["neo4jDash.sess"].sessionId && loading) {
            loginHandler(cookies['neo4jDash.sess'])
        }
        setLoading(false);
    }, [cookies, loading, loginHandler, theme]);

    const logoutHandler = () => {
        logout();
    }

    const logout = async () => {
        const logOutResult = await doLogout(sessionId);
        if (logOutResult) {
            setSessionId(null);
            setCookie('neo4jDash.sess', null);
        }
    }

    const render = () => {
        if (loading) {
            return <em className={cls('AppLoading', "material-icons")}>share</em>
        } else {
            if (!sessionId) {
                return (
                    <Login callback={ loginHandler }></Login>
                )
            } else {
                return (
                    <div className="AppContainer">
                        <Header user={user} callback={ logoutHandler } themeCallback={setTheme}></Header>
                        <Comander sessionId={sessionId}></Comander>
                    </div>
                )
            }
        }
    }

    return <ThemeContext.Provider value={themes[theme]}>
        <div className={cls('App', theme)}>
            { render() }
        </div>
    </ThemeContext.Provider>
}

export default App;

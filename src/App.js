import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

import Login from './components/login/Login';
import Comander from './components/comander/Comander';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';

import { doLogout } from './service/neo.service';
import { getDBSchema } from './service/schema.service';
import { cls } from './global/utils';

import './App.css';
import actions from './global/utils/store/actions';
import { useAsyncDispatch } from './global/utils/hooks/dispatch';

function App() {
    const [cookies, setCookie] = useCookies(["neo4jDash.sess"]);
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(false);
    const [theme, user] = useSelector(state => [state.theme, state.user]);

    const dispatch = useDispatch();
    const asyncDispatch = useAsyncDispatch();

    const loginHandler = useCallback((userData) => {
        setCookie("neo4jDash.sess", JSON.stringify(userData));
        dispatch(actions.user.setUser(userData));
        asyncDispatch(actions.db.setProperties, getDBSchema(userData.sessionId));
    }, [asyncDispatch, dispatch, setCookie]);

    useEffect(() => {
        if (cookies["neo4jDash.sess"] && cookies["neo4jDash.sess"].sessionId && loading) {
            loginHandler(cookies['neo4jDash.sess'])
        }
        setLoading(false);
    }, [cookies, loading, loginHandler, theme]);

    useEffect(() => {
        if (!loading && !user.loggedIn) {
            async function logout() {
                await doLogout(user.sessionId);
            }
            logout();
            setCookie("neo4jDash.sess", null);
        }
    }, [loading, setCookie, user]);

    const toggleMenu = (state) => {
        setMenu(state);
    }

    const render = () => {
        if (loading) {
            return <em className={cls('AppLoading', "material-icons")}>share</em>
        } else {
            if (!user.loggedIn) {
                return (
                    <Login callback={ loginHandler }></Login>
                )
            } else {
                return (
                    <div className="AppContainer">
                        <Header toggleMenu={toggleMenu}></Header>
                        <Comander></Comander>
                        {menu ? <Sidebar className="animated fadeInLeft" /> : null}
                    </div>
                )
            }
        }
    }

    return <div className={cls('App', theme.id, theme.size)}>
            { render() }
        </div>
}

export default App;

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Login from './components/login/Login';
import Comander from './components/comander/Comander';
import Header from './components/header/Header';
import { doLogout } from './service/neo.service';
import { useCookies } from 'react-cookie';
import { cls } from './global/utils';

function App() {
    const [cookies, setCookie] = useCookies(["neo4jDash.sess"]);
    const [sessionId, setSessionId] = useState(null);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);

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
    }, [cookies, loading, loginHandler]);

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
                        <Header user={user} callback={ logoutHandler }></Header>
                        <Comander sessionId={sessionId}></Comander>
                    </div>
                )
            }
        }
    }

    return <div className="App">
        { render() }
    </div>
}

export default App;

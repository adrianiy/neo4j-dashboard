import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from "react-cookie";

import { cls } from '../../global/utils';
import { ColumnLayout } from '../../global/layouts';

import styles from './Login.module.css';
import { doLogin } from '../../service/neo.service';

function Login(props) {
    const [cookies, setCookie] = useCookies(["neo4jDash.sess"]);
    const [uri, setUri] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loginHandle = async (event) => {
        if (event) {
            event.preventDefault();
        }
        login(uri, user, password);
    };

    const saveCredentials = useCallback((_uri, _user, _password) => {
        setCookie("neo4jDash.sess", btoa(`${_uri} ${_user} ${_password}`), { path: "/", maxAge: 24 * 60 * 60 });
    }, [setCookie]);

    const login = useCallback(async (_uri, _user, _password) => {
        try {
            setLoading(true);
            const sessionId = await doLogin(_uri, _user, _password);
            if (sessionId && sessionId.id) {
                saveCredentials(_uri, _user, _password);
                props.callback({ sessionId: sessionId.id, user: _user });
            } else {
                setLoading(false);
                setError("Incorrect connection credentials");
            }
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    }, [props, saveCredentials])

    const loadCookies = useCallback(() => {
        const credentials = atob(cookies["neo4jDash.sess"]).split(" ");
        login(credentials[0], credentials[1], credentials[2]);
    }, [cookies, login]);

    const loadCredentials = useCallback(() => {
        if (cookies["neo4jDash.sess"]) {
            loadCookies();
        } else {
            setLoading(false);
        }
    }, [cookies, loadCookies]);

    useEffect(() => {
        loadCredentials();
    }, [loadCredentials]);

    return (
        <ColumnLayout dist="center">
            <header className="column center">
                <em className={cls(styles.icon, "material-icons")}>share</em>
                {!loading ? (
                    <p>
                        Use your <b>Neo4j</b> credentials
                    </p>
                ) : null}
            </header>
            {!loading ? (
                <form onSubmit={loginHandle} autoComplete="on">
                    <ColumnLayout dist="center">
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="neo4j://IP:Port"
                            value={uri}
                            onChange={(e) => setUri(e.target.value)}
                        />
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="User"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error.length ? <span className={styles.error}>{error}</span> : null}
                        <button className={styles.button} type="submit">
                            Login
                        </button>
                    </ColumnLayout>
                </form>
            ) : null}
        </ColumnLayout>
    );

}

export default Login;

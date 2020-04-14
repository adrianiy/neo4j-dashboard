import React, { useState, useEffect } from 'react';
import { driver, auth } from 'neo4j-driver';
import { useCookies } from "react-cookie";

import { cls } from '../../global/utils';
import { ColumnLayout } from '../../global/layouts';

import styles from './Login.module.css';

function Login(props) {
    const [cookies, setCookie] = useCookies(["neo4jDash.sess"]);
    const [uri, setUri] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCredentials();
    });

    const doLogin = (event) => {
        if (event) {
            event.preventDefault();
        }
        try {
            const server = driver(uri, auth.basic(user, password));
            if (server._authToken) {
                const session = server.session();
                saveCredentials();
                props.callback({ session, user });
            } else {
                setError('Incorrect connection credentials');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const saveCredentials = () => {
        setCookie('neo4jDash.sess', btoa(`${uri} ${user} ${password}`), { path: '/', maxAge: 10 * 60 });
    };

    const loadCredentials = () => {
        if (cookies['neo4jDash.sess']) {
            const credentials = atob(cookies['neo4jDash.sess']).split(' ');
            setUri(credentials[0]);
            setUser(credentials[1]);
            setPassword(credentials[2]);
            doLogin();
        } else {
            setLoading(false);
        }
    };


    return (
        <ColumnLayout dist="center">
            <header className="column center">
                <em className={cls([styles.icon, "material-icons"])}>share</em>
                {!loading ? (
                    <p>
                        Use your <b>Neo4j</b> credentials
                    </p>
                ) : null}
            </header>
            {!loading ? (
                <form onSubmit={doLogin}>
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

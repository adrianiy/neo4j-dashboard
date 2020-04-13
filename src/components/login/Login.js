import React, { useState, useEffect } from 'react';
import { driver, auth } from 'neo4j-driver';

import styles from './Login.module.css';

function Login(props) {
    const [uri, setUri] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadCredentials();
    });

    function doLogin(event) {
        event.preventDefault();
        try {
            const server = driver(uri, auth.basic(user, password));
            if (server._authToken) {
                const session = server.session();
                saveCredentials();
                props.callback(session);
            } else {
                setError('Incorrect connection credentials');
            }
        } catch (err) {
            console.log(err.message);
            setError(err.message);
        }
    };

    function saveCredentials() {
        localStorage.setItem('neo4jDash.credentials', JSON.stringify({
            uri,
            user,
            password
        }))
    };

    function loadCredentials() {
        let credentials = localStorage.getItem('neo4jDash.credentials');
        if (credentials) {
            credentials = JSON.parse(credentials);
            setUri(credentials.uri);
            setUser(credentials.user);
            setPassword(credentials.password);
        }
    };


    return (
        <div className="column center" style={{height: '100vh'}}>
            <header className="column center">
                <em className={`${styles.icon} material-icons`}>share</em>
                <p>
                    Use your <b>Neo4j</b> credentials
                </p>
            </header>
            <form onSubmit={doLogin} className="column center">
                <input
                    className={styles.input}
                    type="text"
                    placeholder="IP:Port"
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
                <button className={styles.button} type="submit">Login</button>
            </form>
        </div>
    );

}

export default Login;

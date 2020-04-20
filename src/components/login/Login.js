import React, { useState, useEffect, useRef } from 'react';

import { doLogin } from '../../service/neo.service';

import { cls } from '../../global/utils';
import { ColumnLayout } from '../../global/layouts';

import Autosuggest from '@adrianiy/react-autosuggest';
import { defaultTheme } from '../../global/autosuggest';

import styles from './Login.module.css';

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value, suggestions) => {
    if (!value) {
        return []
    }
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
        ? []
        : suggestions.filter(
            (uri) => uri.uri.toLowerCase().slice(0, inputLength) === inputValue
        );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.uri;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <span>{suggestion.uri}</span>;


function Login(props) {
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [uri, setUri] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const sessionId = useRef('');

    useEffect(() => {
        const savedHistory = localStorage.getItem("neo4jDash.loginHistory");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const login = async () => {
        try {
            const sess = await doLogin(`neo4j://${uri}`, user, password);
            if (sess && sess.id) {
                sessionId.current = { sessionId: sess.id, user: user }
                localStorage.setItem("neo4jDash.loginHistory", JSON.stringify(
                    history.filter(h => h.uri !== uri).concat({ uri }))
                );
                props.callback(sessionId.current)
            } else {
                setError("Incorrect connection credentials");
            }
        } catch (err) {
            setError(err);
        }
    };

    const uriUpdate = (_, { newValue }) => {
        setUri(newValue);
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value, history));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onLogin = async (event) => {
        if (event) {
            event.preventDefault();
        }
        login(uri, user, password);
    };

    return (
        <ColumnLayout dist="center">
            <header className="column center">
                <em className={cls(styles.icon, "material-icons")}>share</em>
                <p>
                    Use your <b>Neo4j</b> credentials
                </p>
            </header>
            <form onSubmit={onLogin} autoComplete="on">
                <ColumnLayout dist="center">
                    <Autosuggest
                        theme={{
                            ...defaultTheme,
                            ...{
                                input: styles.input,
                                suggestionsContainerOpen: styles.suggestions,
                                suggestionHighlighted: styles.suggestionHighlighted,
                            },
                        }}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        highlightFirstSuggestion={true}
                        renderSuggestion={renderSuggestion}
                        inputProps={{
                            placeholder: "IP:PORT",
                            value: uri,
                            onChange: uriUpdate
                        }}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        autoComplete="user"
                        placeholder="User"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        autoComplete="password"
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
        </ColumnLayout>
    );
}

export default Login;

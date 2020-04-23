import React, { useState, useRef, useEffect, useContext } from 'react';
import { Controlled as CodeMirror } from "react-codemirror2";
import Timeline from '../timeline/Timeline';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/cypher/cypher";
import "./codemirror.css";

import { cls, concatUniqueStrings } from '../../global/utils';
import { RowLayout, ColumnLayout } from '../../global/layouts';
import { useEventListener } from "../../global/utils/hooks/events";

import styles from './Comander.module.css';
import { ThemeContext } from '../../global/utils/hooks/theme';


function Comander(props) {
    const [query, setQuery] = useState("");
    const [queries, setQueries] = useState([]);
    const [showStored, setShowStored] = useState(false);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);
    const [fullscreen, setFullscreen] = useState(false);
    const storedQueries = useRef([]);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const queries = localStorage.getItem("neo4jDashboard.queries");
        if (queries) {
            storedQueries.current = JSON.parse(queries);
        }
    }, []); // run only on component mount

    useEffect(() => {
        setQuery(storedQueries.current[highlightedSuggestion]);
    }, [highlightedSuggestion]); // run when highlightedsuggestion change

    const handlePlay = () => {
        const stored = concatUniqueStrings(query, storedQueries.current).slice(0, 10);
        setQueries(concatUniqueStrings(query, queries));
        setQuery("");
        setShowStored(false);
        storedQueries.current = stored;
        localStorage.setItem("neo4jDashboard.queries", JSON.stringify(stored));
    };

    const showStoredQueries = () => {
        setShowStored(!showStored);
    };

    const selectQuery = (query) => {
        setQuery(query);
        setShowStored(false);
    };

    const deleteQuery = (query) => {
        setQueries(queries.filter(q => q !== query));
    }

    const toggleFullScreen = (value) => {
        setFullscreen(value);
    }

    useEventListener("keydown", (event) => {
        switch (event.keyCode) {
            case 40: // ArrowDown
                setHighlightedSuggestion((hs) => (hs === storedQueries.current.length - 1 ? 0 : hs + 1));
                break;
            case 38: // ArrowUp
                setHighlightedSuggestion((hs) => (hs <= 0 ? storedQueries.current.length : hs) - 1);
                break;
            case 13: // Enter
                showStored && selectQuery(storedQueries.current(highlightedSuggestion));
                !showStored && handlePlay();
                break;
            default:
                break;
        }
    });

    return (
        <ColumnLayout dist="spaced" className={cls(styles.comanderContainer, 'animated', 'fadeInUp')}>
            <RowLayout dist="middle" className={cls(styles.inputContainer, fullscreen ? styles.fullscreen : '')}>
                <CodeMirror
                    className={styles.input}
                    value={query}
                    options={{
                        mode: "cypher",
                        theme: theme.codemirror,
                        lineNumbers: false,
                        lineWrapping: true,
                    }}
                    onBeforeChange={(_, __, value) => {
                        setQuery(value);
                    }}
                />
                <em className="material-icons" onClick={handlePlay}>
                    play_arrow
                </em>
                <em className={cls("material-icons", showStored ? styles.activeIcon : "")} onClick={showStoredQueries}>
                    history
                </em>
            </RowLayout>
            <div className={cls(styles.list, showStored ? styles.listActive : "")}>
                <div className={styles.listOverflow}></div>
                <span className={styles.listTitle}>Últimas consultas</span>
                <ul>
                    {storedQueries.current.map((q, i) => (
                        <li
                            key={i}
                            onClick={() => selectQuery(q)}
                            className={highlightedSuggestion === i ? styles.suggestionActive : ""}
                        >
                            <CodeMirror
                                value={q}
                                options={{
                                    mode: "cypher",
                                    theme: theme.codemirror,
                                    lineNumbers: false,
                                    lineWrapping: true,
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <Timeline
                queries={queries}
                selectQuery={selectQuery}
                deleteQuery={deleteQuery}
                sessionId={props.sessionId}
                toggleFullScreen={toggleFullScreen}
            />
        </ColumnLayout>
    );
}

export default Comander;

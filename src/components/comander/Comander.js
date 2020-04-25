import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Timeline from '../timeline/Timeline';
import CypherCodeMirror from './CypherCodeMirror';

import { codeMirrorSettings, neo4jSchema } from './cypher/common';

import { cls, concatUniqueStrings } from '../../global/utils';
import { RowLayout, ColumnLayout } from '../../global/layouts';
import { useEventListener } from "../../global/utils/hooks/events";

import styles from './Comander.module.css';


function Comander(props) {
    const [query, setQuery] = useState("");
    const [queries, setQueries] = useState([]);
    const [showStored, setShowStored] = useState(false);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);
    const [fullscreen, setFullscreen] = useState(false);
    const [editor, setEditor] = useState(null);
    const cm = useRef(null);
    const storedQueries = useRef([]);
    const theme = useSelector(state => state.currentTheme);

    useEffect(() => {
        if (editor) {
            cm.current = editor.getCodeMirror();
        }
    }, [editor])

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
        cm.current.setValue("");
        localStorage.setItem("neo4jDashboard.queries", JSON.stringify(stored));
    };

    const showStoredQueries = () => {
        setShowStored(!showStored);
    };

    const selectQuery = (event, query) => {
        event.preventDefault();
        setQuery(query);
        setShowStored(false);
        cm.current.setValue(query);
        cm.current.setCursor(cm.current.lineCount(), 0);
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
        <ColumnLayout dist="spaced" className={cls(styles.comanderContainer, "animated", "fadeInUp")}>
            <RowLayout dist="middle" className={cls(styles.inputContainer, fullscreen ? styles.fullscreen : "")}>
                <CypherCodeMirror
                    className={styles.input}
                    options={{ ...codeMirrorSettings, ...{ theme: theme.codemirror } }}
                    schema={neo4jSchema}
                    defaultValue={""}
                    onChange={(value) => setQuery(value)}
                    onParsed={() => null}
                    ref={(el) => setEditor(el)}
                />
                <em className="material-icons" onClick={handlePlay}>
                    play_arrow
                </em>
                <em className={cls("material-icons", showStored ? styles.activeIcon : "")} onClick={showStoredQueries}>
                    history
                </em>
            </RowLayout>
            <div className={cls(styles.list, showStored ? styles.listActive : "")}>
                <span className={styles.listTitle}>Últimas consultas</span>
                <ul>
                    {storedQueries.current.map((q, i) => (
                        <li
                            key={i}
                            onClick={e => selectQuery(e, q)}
                            className={highlightedSuggestion === i ? styles.suggestionActive : ""}
                        >
                            <CypherCodeMirror
                                value={q}
                                options={{ ...codeMirrorSettings, ...{
                                    theme: theme.codemirror,
                                    autofocus: false,
                                    readOnly: 'nocursor'
                                } }}
                                schema={neo4jSchema}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <Timeline
                queries={queries}
                selectQuery={selectQuery}
                deleteQuery={deleteQuery}
                toggleFullScreen={toggleFullScreen}
            />
        </ColumnLayout>
    );
}

export default Comander;

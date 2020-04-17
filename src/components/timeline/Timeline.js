import React, { useState, useEffect } from 'react';
import Chart from '../chart/Chart';
import styles from './Timeline.module.css';
import { RowLayout, ColumnLayout } from '../../global/layouts';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/cypher/cypher';
import './codemirror.css';
import { cls } from '../../global/utils';

function Timeline(props) {
    const [query, setQuery] = useState('');
    const [queries, setQueries] = useState([])
    const [storedQueries, setStoredQueries] = useState([]);
    const [showStored, setShowStored] = useState(false);

    useEffect(() => {
        const queries = localStorage.getItem("neo4jDashboard.queries");
        if (queries) {
            setStoredQueries(JSON.parse(queries));
        }
    }, [props])

    const handlePlay = () => {
        const stored = [query].concat(storedQueries.filter(q => q !== query)).slice(0, 5);
        setQueries([query].concat(queries.filter((q) => q !== query)));
        setStoredQueries(stored);
        localStorage.setItem("neo4jDashboard.queries", JSON.stringify(stored));
    }

    const showStoredQueries = () => {
        setShowStored(!showStored);
    }

    const selectQuery = (query) => {
        setQuery(query)
        setShowStored(false)
    }

    return (
        <ColumnLayout dist="spaced" className={styles.timelineContainer}>
            <div className={styles.overflowScroll}></div>
            <RowLayout dist="middle" className={styles.inputContainer}>
                <CodeMirror
                    className={styles.input}
                    value={query}
                    options={{
                        mode: "cypher",
                        theme: "material",
                        lineNumbers: false,
                        lineWrapping: true,
                    }}
                    onBeforeChange={(editor, data, value) => {
                        setQuery(value);
                    }}
                />
                <em className="material-icons" onClick={handlePlay}>
                    play_arrow
                </em>
                <em className={
                    cls('material-icons', showStored ? styles.activeIcon : '')
                } onClick={showStoredQueries}>
                    history
                </em>
            </RowLayout>
            {showStored ? (
                <ul className={styles.list}>
                    <span>Últimas consultas</span>
                    {storedQueries.map((q, i) => (
                        <li key={i} onClick={() => selectQuery(q)}>
                            <CodeMirror
                                value={q}
                                options={{
                                    mode: "cypher",
                                    theme: "material",
                                    lineNumbers: false,
                                    lineWrapping: true,
                                }}
                            />
                        </li>
                    ))}
                </ul>
            ) : null}
            <ColumnLayout className={styles.chartContainer}>
                {queries.length ? (
                    queries.map((q, idx) => (
                        <RowLayout key={idx} dist="center middle" className={styles.chartWrapper}>
                            <Chart sessionId={props.sessionId} query={q} />
                        </RowLayout>
                    ))
                ) : (
                    <RowLayout dist="center middle" className={styles.chartWrapper}>
                        Type a query and press RUN!
                    </RowLayout>
                )}
            </ColumnLayout>
        </ColumnLayout>
    );
};

export default Timeline;

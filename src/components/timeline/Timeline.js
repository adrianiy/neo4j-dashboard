import React, { useState } from 'react';
import Chart from '../chart/Chart';
import styles from './Timeline.module.css';
import { RowLayout, ColumnLayout } from '../../global/layouts';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/cypher/cypher';
import './codemirror.css';

function Timeline(props) {
    const [query, setQuery] = useState('');
    const [queries, setQueries] = useState([])

    const handlePlay = () => {
        setQueries(queries.concat(query));
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
                        lineWrapping: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                        setQuery(value)
                    }}
                />
                <em className="material-icons" onClick={handlePlay}>play_arrow</em>
                <em className="material-icons">history</em>
            </RowLayout>

            <ColumnLayout className={styles.chartContainer}>
                    {
                        queries.length ? queries.map((q, idx) => (
                            <RowLayout key={idx} dist="center middle" className={styles.chartWrapper}>
                                <Chart driver={props.driver} query={q}/>
                            </RowLayout>
                        ))
                        :
                        <RowLayout dist="center middle" className={styles.chartWrapper}>
                            Type a query and press RUN!
                        </RowLayout>
                    }
            </ColumnLayout>

        </ColumnLayout>
    );
};

export default Timeline;

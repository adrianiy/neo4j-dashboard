import React, { useState } from 'react';
import styles from './Timeline.module.css';
import { RowLayout } from '../../global/layouts';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/cypher/cypher';
import './codemirror.css';

function Timeline(props) {
    const [query, setQuery] = useState('');

    return (
        <div className={styles.timelineContainer}>
            <RowLayout dist="middle" className={styles.inputContainer}>
                <CodeMirror
                    className={styles.input}
                    value={query}
                    options={{
                        mode: "cypher",
                        theme: "material",
                        lineNumbers: false,
                    }}
                    onBeforeChange={(editor, data, value) => {
                        setQuery(value)
                    }}
                />
                <em className="material-icons">play_arrow</em>
                <em className="material-icons">history</em>
            </RowLayout>

            <RowLayout dist="center middle" className={styles.timeline}>
                Type a query and press RUN!
            </RowLayout>
        </div>
    );
};

export default Timeline;

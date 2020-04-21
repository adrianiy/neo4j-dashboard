import React, { useState, useEffect } from 'react';
import Card from '../card/Card';
import { RowLayout, ColumnLayout } from '../../global/layouts';

import styles from './Timeline.module.css';

function Timeline(props) {
    const [queries, setQueries] = useState([])

    useEffect(() => {
        if (props.queries !== queries) {
            setQueries(props.queries);
        }
    }, [props, queries]);

    const deleteQuery = (query) => {
        props.deleteQuery(query);
    };

    return (
        <ColumnLayout className={styles.chartContainer}>
            {queries.length ? (
                queries.map((q, idx) => (
                    <RowLayout key={idx} dist="center middle" className={styles.chartWrapper}>
                        <Card
                            sessionId={props.sessionId}
                            query={q}
                            deleteQuery={deleteQuery}
                            restoreQuery={props.selectQuery}
                        />
                    </RowLayout>
                ))
            ) : (
                <RowLayout dist="center middle" className={styles.noQueries}>
                    Type a query and press RUN!
                </RowLayout>
            )}
        </ColumnLayout>
    );
};

export default Timeline;

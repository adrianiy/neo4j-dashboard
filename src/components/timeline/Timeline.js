import React, { useState, useEffect } from 'react';
import Card from '../card/Card';
import { RowLayout, ColumnLayout } from '../../global/layouts';

import styles from './Timeline.module.css';
import { cls } from '../../global/utils';

function Timeline(props) {
    const [queries, setQueries] = useState([])

    useEffect(() => {
        if (props.queries !== queries) {
            setQueries(props.queries);
        }
    }, [props, queries]);

    /* istanbul ignore next */
    const deleteQuery = (query) => {
        props.deleteQuery(query);
    };

    return (
        <ColumnLayout data-testid="timeline" dist="center" className={cls(styles.chartContainer, 'hideScroll')}>
            {queries.length ? (
                queries.map((q, idx) => (
                    <RowLayout key={idx} dist="center middle" className={styles.chartWrapper}>
                        <Card
                            query={q}
                            idx={idx}
                            deleteQuery={deleteQuery}
                            restoreQuery={props.selectQuery}
                            toggleFullScreen={props.toggleFullScreen}
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

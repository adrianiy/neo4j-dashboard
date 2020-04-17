import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { getChart } from '../../service/neo.service';

import styles from './Card.module.css';
import { ColumnLayout, RowLayout } from '../../global/layouts';
import Chart from '../chart/Chart';

function Card(props) {
    const [results, setResults] = useState(null);
    const [updated, setUpdated] = useState(null);
    const [item, setItem] = useState(null);
    const [selected, setSelected] = useState(false);

    const fecthData = useCallback(async () => {
        const results = await getChart(props.sessionId, props.query);
        console.log(results);
        setResults(results);
        setUpdated(new Date().getTime());
    }, [props])

    useEffect(() => {
        setResults(null);
        fecthData();
    }, [props, fecthData])

    const itemHover = (_item) => {
        if (!selected) {
            setItem(_item);
        }
    }

    const itemSelected = (_item) => {
        if (!selected || item !== _item) {
            setSelected(true);
            setItem(item);
            console.log(item);
        } else {
            setSelected(false);
        }
    }

    const setSummary = (stats) => {
        console.log(stats);
    }

    return results ? (
        <ColumnLayout className={styles.card}>
            <header className="row middle spaced">
                <span className={styles.cardTitle}>QUERY</span>
                <div className={styles.cardQuery} onClick={() => props.restoreQuery(props.query)}>{ props.query }</div>
                <em className="material-icons" onClick={() => props.deleteQuery(props.query)}>close</em>
            </header>
            <RowLayout className={styles.cardBody}>
                <ColumnLayout className={styles.summary}>
                    <h3>Summary</h3>
                </ColumnLayout>
                <Chart
                    style={{width: '100%'}}
                    result={results}
                    maxNeighbours={ 30 }
                    sessionId={ props.sessionId }
                    itemHovered={itemHover}
                    itemSelected={itemSelected}
                    setSummary={setSummary}
                    autoComplete={false}
                    updated={updated}
                />
            </RowLayout>
        </ColumnLayout>
    ) :  null
}

export default Card;

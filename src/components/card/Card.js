import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { getChart } from '../../service/neo.service';

import styles from './Card.module.css';
import { ColumnLayout, RowLayout } from '../../global/layouts';
import Chart from '../chart/Chart';
import Summary from './Summary';

function Card(props) {
    const [results, setResults] = useState(null);
    const [item, setItem] = useState(null);
    const [selected, setSelected] = useState(null);
    const [stats, setStats] = useState(null);
    const [graphStyle, setGraphStyle] = useState(null);

    const fecthData = useCallback(async () => {
        const results = await getChart(props.sessionId, props.query);
        setResults(results);
    }, [props])

    useEffect(() => {
        setResults(null);
        fecthData();
    }, [props, fecthData])

    const itemHover = (_item) => {
        if (['node', 'relationship'].includes(_item.type)) {
            setItem(_item);
        } else if (_item.type === 'canvas') {
            setItem(null);
        }
    }

    const itemSelected = (item) => {
        setSelected(item)
    }

    const setSummary = (stats) => {
        setStats(stats);
    }

    const graphStyleCallback = (style) => {
        setGraphStyle(style);
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
                    <Summary
                        summary={stats}
                        item={item || selected}
                        graphStyle={graphStyle}
                    ></Summary>
                </ColumnLayout>
                <Chart
                    style={{width: '100%'}}
                    result={results}
                    maxNeighbours={ 30 }
                    sessionId={ props.sessionId }
                    itemHovered={itemHover}
                    itemSelected={itemSelected}
                    setSummary={setSummary}
                    graphStyleData={graphStyle}
                    graphStyleCallback={graphStyleCallback}
                    autoComplete={false}
                />
            </RowLayout>
        </ColumnLayout>
    ) :  null
}

export default Card;

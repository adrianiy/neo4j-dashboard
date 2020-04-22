import React, { useState, useCallback, useRef, useEffect } from 'react';
import Summary from './Summary';

import { getChart } from '../../service/neo.service';

import { ColumnLayout, RowLayout } from '../../global/layouts';
import Chart from '../../global/components/chart/Chart';
import { cls } from '../../global/utils';
import styles from './Card.module.css';

function Card(props) {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [item, setItem] = useState(null);
    const [selected, setSelected] = useState(null);
    const [stats, setStats] = useState(null);
    const [graphStyle, setGraphStyle] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const query = useRef('');

    const fecthData = useCallback(async () => {
        try {
            const results = await getChart(props.sessionId, props.query);
            setResults(results);
            setError(null);
        } catch (err) {
            setError(`${ props.query }: ${err}`);
        }
    }, [props])

    useEffect(() => {
        if (query.current !== props.query) {
            query.current = props.query;
            setResults(null);
            fecthData();
        }
    }, [props, fecthData]);

    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const toggleFullScreen = () => {
        props.toggleFullScreen(!fullscreen);
        setFullscreen(!fullscreen);
    };

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

    return (
        <ColumnLayout
            className={cls(styles.card, expanded ? styles.expanded : "", fullscreen ? styles.fullscreen : "")}
            style={{ marginTop: fullscreen ? 85 - props.idx * 500 : 0 }}
        >
            <header className="row middle spaced">
                <span className={styles.cardTitle}>QUERY</span>
                <div className={styles.cardQuery} onClick={() => props.restoreQuery(props.query)}>
                    {props.query}
                </div>
                <RowLayout dist="middle right">
                    <em
                        className="material-icons"
                        title={fullscreen ? "minimize" : "maximize"}
                        onClick={toggleFullScreen}
                    >
                        {fullscreen ? "fullscreen_exit" : "fullscreen"}
                    </em>
                    <em
                        className={cls(styles.expand, "material-icons", fullscreen ? 'disabled' : '')}
                        title={expanded ? "contract" : "expand"}
                        onClick={fullscreen ? null : toggleExpand}
                    >
                        {expanded ? "unfold_less" : "unfold_more"}
                    </em>
                    <em className="material-icons" title="close" onClick={() => props.deleteQuery(props.query)}>
                        close
                    </em>
                </RowLayout>
            </header>
            {results ? (
                <RowLayout className={styles.cardBody}>
                    <ColumnLayout className={cls(styles.summary, fullscreen || expanded ? styles.summaryWidder : '')}>
                        <h3>Summary</h3>
                        <Summary summary={stats} item={item || selected} graphStyle={graphStyle}></Summary>
                    </ColumnLayout>
                    <Chart
                        style={{ width: "100%" }}
                        result={results}
                        maxNeighbours={30}
                        sessionId={props.sessionId}
                        itemHovered={itemHover}
                        itemSelected={itemSelected}
                        setSummary={setSummary}
                        graphStyleData={graphStyle}
                        graphStyleCallback={graphStyleCallback}
                        autoComplete={false}
                    />
                </RowLayout>
            ) : (
                <ColumnLayout dist="center middle" className={cls(styles.cardBody, styles.loading)}>
                    {error ? error : <em className={cls("AppLoading", "material-icons")}>share</em>}
                </ColumnLayout>
            )}
        </ColumnLayout>
    );
}

export default Card;

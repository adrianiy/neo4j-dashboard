import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Summary from './Summary';
import Download from './components/Download';

import { getQuery } from '../../service/neo.service';

import neoGraphStyle from '../../global/components/chart/graphStyle';
import { ColumnLayout, RowLayout } from '../../global/layouts';
import Chart from '../../global/components/chart/Chart';
import { cls } from '../../global/utils';

import styles from './Card.module.css';

const graphStyle = new neoGraphStyle();

function Card(props) {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [item, setItem] = useState(null);
    const [selected, setSelected] = useState(null);
    const [stats, setStats] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [download, setDownload] = useState(false);
    const [theme, user] = useSelector(state => [state.currentTheme, state.currentUser]);
    const [graphStyleData, setGraphStyle] = useState({
        relationship: {
            'text-color-external': theme.relColor
        }
    });

    const query = useRef('');
    const visElement = useRef(null);

    useEffect(() => {
        setGraphStyle({
            relationship: {
                'text-color-external': theme.relColor
            }
        });
    }, [theme.relColor])

    const fecthData = useCallback(async () => {
        try {
            const results = await getQuery(user.sessionId, props.query);
            setResults(results);
            setError(null);
        } catch (err) {
            setError(`${ props.query }: ${err}`);
        }
    }, [props.query, user.sessionId])

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

    const toggleDownload = () => {
        setDownload(!download);
    }

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
        if (!graphStyle) {
            setGraphStyle(style.toSheet())
        }
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
                <RowLayout dist="middle right" className={styles.iconContainer}>
                    <em className="material-icons" title="download" onClick={toggleDownload}>
                        save_alt
                    </em>
                    <em
                        className="material-icons"
                        title={fullscreen ? "minimize" : "maximize"}
                        onClick={toggleFullScreen}
                    >
                        {fullscreen ? "fullscreen_exit" : "fullscreen"}
                    </em>
                    <em
                        className={cls(styles.expand, "material-icons", fullscreen ? "disabled" : "")}
                        title={expanded ? "contract" : "expand"}
                        onClick={fullscreen ? null : toggleExpand}
                    >
                        {expanded ? "unfold_less" : "unfold_more"}
                    </em>
                    <em className="material-icons" title="close" onClick={() => props.deleteQuery(props.query)}>
                        close
                    </em>
                    {download ? (
                        <Download results={results} vis={visElement.current} className={styles.downloadWrapper} />
                    ) : null}
                </RowLayout>
            </header>
            {results ? (
                <RowLayout className={styles.cardBody}>
                    <ColumnLayout className={cls(styles.summary, fullscreen || expanded ? styles.summaryWidder : "")}>
                        <h3>Summary</h3>
                        <Summary summary={stats} item={item || selected} graphStyle={graphStyle}></Summary>
                    </ColumnLayout>
                    <Chart
                        style={{ width: "100%" }}
                        result={results}
                        maxNeighbours={30}
                        itemHovered={itemHover}
                        itemSelected={itemSelected}
                        setSummary={setSummary}
                        graphStyleData={graphStyleData}
                        graphStyleCallback={graphStyleCallback}
                        autoComplete={false}
                        assignVisElement={(svgElement, graphElement) =>
                            (visElement.current = { svgElement, graphElement, type: "graph" })
                        }
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

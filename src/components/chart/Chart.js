import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { Visualization } from '../visualization/VisualizationView';
import { getChart } from '../../service/neo.service';

function Chart(props) {
    const [results, setResults] = useState(null);
    const [updated, setUpdated] = useState(null);

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

    const itemHover = (item) => {
        console.log(item);
    }

    const itemSelected = (item) => {
        console.log(item);
    }

    return results ? (
            <Visualization
                style={{width: '100%'}}
                result={results}
                maxNeighbours={ 30 }
                sessionId={ props.sessionId }
                itemHovered={itemHover}
                itemSelected={itemSelected}
                updated={updated}
            />
    ) :  null
}

export default Chart;

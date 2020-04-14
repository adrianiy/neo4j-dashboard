import React from 'react';
import { useEffect } from 'react';
import NeoVis from '../../assets/novis/neovis';

function Chart(props) {

    useEffect(() => {
        console.log(props.query);
        const config = {
            container_id: "viz",
            driver: props.driver,
            labels: {
                //"Character": "name",
                Character: {
                    caption: "name",
                    size: "pagerank",
                    community: "community",
                    //"sizeCypher": "MATCH (n) WHERE id(n) = {id} MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
                },
            },
            relationships: {
                INTERACTS: {
                    thickness: "weight",
                    caption: false,
                },
            },
            initial_cypher: props.query,
        };
        const viz = new NeoVis(config);
        viz.render()
    }, [props])

    return (
        <div id="viz" style={{ width: '100%', height: '100%'}}></div>
    )
}

export default Chart;

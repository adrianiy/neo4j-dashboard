import React, { useState, useEffect, useCallback } from 'react';
import { GraphComponent } from './../../../assets/visualization/Graph';
import { getChart } from './../../../service/neo.service';

import { extractNodesAndRelationshipsFromRecordsForOldVis } from './utils/graph-utils';
import deepmerge from 'deepmerge';
import neo4j from 'neo4j-driver';

import neoGraphStyle from './graphStyle';

const deduplicateNodes = (nodes) => {
    return nodes.reduce(
        (all, curr) => {
            if (all.taken.indexOf(curr.id) > -1) {
                return all;
            } else {
                all.nodes.push(curr);
                all.taken.push(curr.id);
                return all;
            }
        },
        { nodes: [], taken: [] }
    ).nodes;
};

function Chart (props) {
    const [nodes, setNodes] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [graphStyle, setGraphStyle] = useState(neoGraphStyle());
    let _graph;
    let _autoCompleteCallback;

    const checkNodesLength = useCallback(_nodes => {
        _nodes = deduplicateNodes(_nodes);
        if (_nodes.length > parseInt(props.initialNodeDisplay)) {
            _nodes = _nodes.slice(0, props.initialNodeDisplay);
            setRelationships(
                props.relationships.filter((item) => {
                    return _nodes.filter((node) => node.id === item.startNodeId) > 0;
                })
            );
            props.itemSelected({
                type: "status-item",
                item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${this.props.initialNodeDisplay} of ${nodes.length} nodes are being displayed`,
            });
        }
        setNodes(_nodes);
    }, [nodes.length, props]);

    const populateDataFromRecords = useCallback((records) => {
        const {
            nodes,
            relationships
        } = extractNodesAndRelationshipsFromRecordsForOldVis(
            records
        );
        checkNodesLength(nodes);
        setRelationships(relationships);
    }, [checkNodesLength]);

    const checkGraphStyle = useCallback(() => {
        const _graphStyle = graphStyle.toSheet();
        if (props.graphStyleData && props.graphStyleData.getVersion() !== graphStyle.getVersion()) {
            const rebasedStyle = deepmerge(_graphStyle, props.graphStyleData);
            graphStyle.loadRules(rebasedStyle);
            graphStyle.update();
            setGraphStyle(graphStyle);
        } else {
            graphStyle.resetToDefault();
            setGraphStyle(graphStyle);
            props.graphStyleCallback(graphStyle);
        }
    }, [graphStyle, props]);

    useEffect(() => {
        checkGraphStyle();
        const { records = [] } = props.result;
        if (records && records.length > 0) {
            setNodes([]);
            populateDataFromRecords(records);
        }
    }, [props, populateDataFromRecords, checkGraphStyle]);

    const autoCompleteRelationships = async (existingNodes, newNodes) => {
        if (props.autoComplete) {
            const existingNodeIds = existingNodes.map(node => parseInt(node.id))
            const newNodeIds = newNodes.map(node => parseInt(node.id))

            const graph = await getInternalRelationships(existingNodeIds, newNodeIds);
            _autoCompleteCallback && _autoCompleteCallback(graph.relationships);
        } else {
            _autoCompleteCallback && _autoCompleteCallback([])
        }
    }

    const getNeighbours = async (id, currentNeighbourIds = []) => {
        const query = `MATCH path = (a)--(o)
                    WHERE id(a) = ${id}
                    AND NOT (id(o) IN[${currentNeighbourIds.join(',')}])
                    RETURN path, size((a)--()) as c
                    ORDER BY id(o)
                    LIMIT ${props.maxNeighbours -
                        currentNeighbourIds.length}`
        const results = await getChart(props.sessionId, query);
        const count = results.records.length > 0 ? parseInt(results.records[0].get("c").toString()) : 0;
        const resultGraph = extractNodesAndRelationshipsFromRecordsForOldVis(results.records, false);
        await autoCompleteRelationships(_graph._nodes, resultGraph.nodes);
        return { ...resultGraph, count: count };
    }

    const getInternalRelationships = async (existingNodeIds, newNodeIds) => {
        newNodeIds = newNodeIds.map(neo4j.int)
        existingNodeIds = existingNodeIds.map(neo4j.int)
        existingNodeIds = existingNodeIds.concat(newNodeIds)
        const query =
            'MATCH (a)-[r]->(b) WHERE id(a) IN $existingNodeIds AND id(b) IN $newNodeIds RETURN r;'
        const results = await getChart(props.sessionId, query);
        return {
            ...extractNodesAndRelationshipsFromRecordsForOldVis(results.records, false),
        };
    }

    const setGraph = (graph) => {
        _graph = graph
        autoCompleteRelationships([], _graph.nodes)
    }

    const getNodeNeighbours = async (node, currentNeighbours, callback) => {
        if (currentNeighbours.length > props.maxNeighbours) {
            callback(null, { nodes: [], relationships: [] });
        }
        try {
            const result = await getNeighbours(node.id, currentNeighbours);
            const nodes = result.nodes;
            if (result.count > props.maxNeighbours - currentNeighbours.length) {
                props.itemSelected({
                    type: "status-item",
                    item: `Rendering was limited to ${props.maxNeighbours} of the node's total ${
                        result.count + currentNeighbours.length
                    } neighbours due to browser config maxNeighbours.`,
                });
            }
            callback(null, { nodes: nodes, relationships: result.relationships });
        } catch (err) {
            callback(null, { nodes: [], relationships: [] });
        }
    }

    const onGraphModelChange = (stats) => {
        props.setSummary(stats);
    }

    return !nodes.length ? null : (
        <GraphComponent
            fullscreen={props.fullscreen}
            frameHeight={props.frameHeight}
            relationships={relationships}
            nodes={nodes}
            getNodeNeighbours={getNodeNeighbours}
            onItemMouseOver={props.itemHovered}
            onItemSelect={props.itemSelected}
            graphStyle={graphStyle}
            onGraphModelChange={onGraphModelChange}
            assignVisElement={props.assignVisElement}
            getAutoCompleteCallback={props.getAutoCompleteCallback}
            setGraph={setGraph}
        />
    );
}

export default Chart;

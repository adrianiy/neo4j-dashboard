import React, { Component } from 'react'
import { deepEquals } from '../../global/utils'
import bolt from '../../assets/neo4j/services/bolt/bolt'
import { ExplorerComponent } from './Explorer'
import { getChart } from '../../service/neo.service';

export const updateGraphStyleData = (graphStyleData) => {
    return {
        type: "grass/UPDATE_GRAPH_STYLE_DATA",
        styleData: graphStyleData,
    };
};

export class Visualization extends Component {
  state = {
    nodes: [],
    relationships: []
  }

  componentDidMount() {
    const { records = [] } = this.props.result
    if (records && records.length > 0) {
      this.populateDataToStateFromProps(this.props)
    }
  }

  shouldComponentUpdate(props, state) {
    return (
      this.props.updated !== props.updated ||
      !deepEquals(props.graphStyleData, this.props.graphStyleData) ||
      this.state.updated !== state.updated ||
      this.props.frameHeight !== props.frameHeight ||
      this.props.autoComplete !== props.autoComplete
    )
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.updated !== prevProps.updated ||
      this.props.autoComplete !== prevProps.autoComplete
    ) {
        this.setState({ nodes: [] })
      this.populateDataToStateFromProps(this.props)
    }
  }

  populateDataToStateFromProps(props) {
    const {
      nodes,
      relationships
    } = bolt.extractNodesAndRelationshipsFromRecordsForOldVis(
      props.result.records
    )
    this.setState({
      nodes,
      relationships,
      updated: new Date().getTime()
    })
  }

  async autoCompleteRelationships(existingNodes, newNodes) {
    if (this.props.autoComplete) {
        const existingNodeIds = existingNodes.map(node => parseInt(node.id))
        const newNodeIds = newNodes.map(node => parseInt(node.id))

        const graph = await this.getInternalRelationships(existingNodeIds, newNodeIds);
        this.autoCompleteCallback && this.autoCompleteCallback(graph.relationships);
    } else {
      this.autoCompleteCallback && this.autoCompleteCallback([])
    }
  }

  async getNeighbours(id, currentNeighbourIds = []) {
    const query = `MATCH path = (a)--(o)
                   WHERE id(a) = ${id}
                   AND NOT (id(o) IN[${currentNeighbourIds.join(',')}])
                   RETURN path, size((a)--()) as c
                   ORDER BY id(o)
                   LIMIT ${this.props.maxNeighbours -
                     currentNeighbourIds.length}`
    const results = await getChart(this.props.sessionId, query);
    const count = results.records.length > 0 ? parseInt(results.records[0].get("c").toString()) : 0;
    const resultGraph = bolt.extractNodesAndRelationshipsFromRecordsForOldVis(results.records, false);
    await this.autoCompleteRelationships(this.graph._nodes, resultGraph.nodes);
    return { ...resultGraph, count: count };
  }

  async getInternalRelationships(existingNodeIds, newNodeIds) {
    newNodeIds = newNodeIds.map(bolt.neo4j.int)
    existingNodeIds = existingNodeIds.map(bolt.neo4j.int)
    existingNodeIds = existingNodeIds.concat(newNodeIds)
    const query =
      'MATCH (a)-[r]->(b) WHERE id(a) IN $existingNodeIds AND id(b) IN $newNodeIds RETURN r;'
    const results = await getChart(this.props.sessionId, query);
    return {
        ...bolt.extractNodesAndRelationshipsFromRecordsForOldVis(results.records, false),
    };
  }

  setGraph(graph) {
    this.graph = graph
    this.autoCompleteRelationships([], this.graph._nodes)
  }

  render() {
    if (!this.state.nodes.length) return null

    return (
        <ExplorerComponent
            maxNeighbours={this.props.maxNeighbours}
            initialNodeDisplay={this.props.initialNodeDisplay}
            graphStyleData={this.props.graphStyleData}
            updateStyle={updateGraphStyleData}
            getNeighbours={this.getNeighbours.bind(this)}
            nodes={this.state.nodes}
            itemHovered={this.props.itemHovered}
            itemSelected={this.props.itemSelected}
            relationships={this.state.relationships}
            fullscreen={this.props.fullscreen}
            frameHeight={this.props.frameHeight}
            assignVisElement={this.props.assignVisElement}
            getAutoCompleteCallback={(callback) => {
                this.autoCompleteCallback = callback;
            }}
            setGraph={this.setGraph.bind(this)}
        />
    );
  }
}

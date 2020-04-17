
import React, { Component } from "react";
import deepmerge from "deepmerge";
import neoGraphStyle from "./graphStyle";
import { deepEquals } from "../../global/utils";
import { GraphComponent } from "./Graph";

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

export class ExplorerComponent extends Component {
    constructor(props) {
        super(props);
        const graphStyle = neoGraphStyle();
        this.defaultStyle = graphStyle.toSheet();
        let relationships = this.props.relationships;
        let nodes = deduplicateNodes(this.props.nodes);
        let selectedItem = "";
        if (nodes.length > parseInt(this.props.initialNodeDisplay)) {
            nodes = nodes.slice(0, this.props.initialNodeDisplay);
            relationships = this.props.relationships.filter((item) => {
                return nodes.filter((node) => node.id === item.startNodeId) > 0;
            });
            selectedItem = {
                type: "status-item",
                item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${this.props.initialNodeDisplay} of ${nodes.length} nodes are being displayed`,
            };
        }
        if (this.props.graphStyleData) {
            const rebasedStyle = deepmerge(this.defaultStyle, this.props.graphStyleData);
            graphStyle.loadRules(rebasedStyle);
        }
        this.state = {
            stats: { labels: {}, relTypes: {} },
            graphStyle,
            styleVersion: 0,
            nodes,
            relationships,
            selectedItem,
        };
    }

    getNodeNeighbours(node, currentNeighbours, callback) {
        if (currentNeighbours.length > this.props.maxNeighbours) {
            callback(null, { nodes: [], relationships: [] });
        }
        this.props.getNeighbours(node.id, currentNeighbours).then(
            (result) => {
                const nodes = result.nodes;
                if (result.count > this.props.maxNeighbours - currentNeighbours.length) {
                    this.setState({
                        selectedItem: {
                            type: "status-item",
                            item: `Rendering was limited to ${this.props.maxNeighbours} of the node's total ${
                                result.count + currentNeighbours.length
                            } neighbours due to browser config maxNeighbours.`,
                        },
                    });
                }
                callback(null, { nodes: nodes, relationships: result.relationships });
            },
            () => {
                callback(null, { nodes: [], relationships: [] });
            }
        );
    }

    onGraphModelChange(stats) {
        this.setState({ stats: stats });
        this.props.updateStyle(this.state.graphStyle.toSheet());
    }

    onSelectedLabel(label, propertyKeys) {
        this.setState({
            selectedItem: {
                type: "legend-item",
                item: {
                    selectedLabel: { label: label, propertyKeys: propertyKeys },
                    selectedRelType: null,
                },
            },
        });
    }

    onSelectedRelType(relType, propertyKeys) {
        this.setState({
            selectedItem: {
                type: "legend-item",
                item: {
                    selectedLabel: null,
                    selectedRelType: { relType: relType, propertyKeys: propertyKeys },
                },
            },
        });
    }

    componentDidUpdate(prevProps) {
        if (!deepEquals(prevProps.graphStyleData, this.props.graphStyleData)) {
            if (this.props.graphStyleData) {
                const rebasedStyle = deepmerge(this.defaultStyle, this.props.graphStyleData);
                this.state.graphStyle.loadRules(rebasedStyle);
                this.setState({
                    graphStyle: this.state.graphStyle,
                    styleVersion: this.state.styleVersion + 1,
                });
            } else {
                this.state.graphStyle.resetToDefault();
                this.setState({ graphStyle: this.state.graphStyle, freezeLegend: true }, () => {
                    this.setState({ freezeLegend: false });
                    this.props.updateStyle(this.state.graphStyle.toSheet());
                });
            }
        }
    }

    onInspectorExpandToggled(contracted, inspectorHeight) {
        this.setState({
            inspectorContracted: contracted,
            forcePaddingBottom: inspectorHeight,
        });
    }

    render() {
        return (
            <GraphComponent
                fullscreen={this.props.fullscreen}
                frameHeight={this.props.frameHeight}
                relationships={this.state.relationships}
                nodes={this.state.nodes}
                getNodeNeighbours={this.getNodeNeighbours.bind(this)}
                onItemMouseOver={this.props.itemHovered}
                onItemSelect={this.props.itemSelected}
                graphStyle={this.state.graphStyle}
                styleVersion={this.state.styleVersion} // cheap way for child to check style updates
                onGraphModelChange={this.onGraphModelChange.bind(this)}
                assignVisElement={this.props.assignVisElement}
                getAutoCompleteCallback={this.props.getAutoCompleteCallback}
                setGraph={this.props.setGraph}
            />
        );
    }
}
export const Explorer = ExplorerComponent;

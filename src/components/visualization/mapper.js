import Graph from "./components/graph";
import Node from "./components/node";
import Relationship from "./components/relationship";
import { optionalToString } from "../../global/utils";

const mapProperties = (_) => Object.assign({}, ...stringifyValues(_));
const stringifyValues = (obj) => Object.keys(obj).map((k) => ({ [k]: optionalToString(obj[k]) }));

export function createGraph(nodes, relationships) {
    const graph = new Graph();
    graph.addNodes(mapNodes(nodes));
    graph.addRelationships(mapRelationships(relationships, graph));
    graph.display = { initialNodeDisplay: 300, nodeCount: 1 };
    return graph;
}

export function mapNodes(nodes) {
    return nodes.map((node) => new Node(node.id, node.labels, mapProperties(node.properties)));
}

export function mapRelationships(relationships, graph) {
    return relationships.map((rel) => {
        const source = graph.findNode(rel.startNodeId);
        const target = graph.findNode(rel.endNodeId);
        return new Relationship(rel.id, source, target, rel.type, mapProperties(rel.properties));
    });
}

export function getGraphStats(graph) {
    const labelStats = {};
    const relTypeStats = {};
    graph.nodes().forEach((node) => {
        node.labels.forEach((label) => {
            if (labelStats["*"]) {
                labelStats["*"].count = labelStats["*"].count + 1;
            } else {
                labelStats["*"] = {
                    count: 1,
                    properties: [],
                };
            }
            if (labelStats[label]) {
                labelStats[label].count = labelStats[label].count + 1;
                labelStats[label].properties = Object.assign({}, labelStats[label].properties, node.propertyMap);
            } else {
                labelStats[label] = {
                    count: 1,
                    properties: node.propertyMap,
                };
            }
        });
    });
    graph.relationships().forEach((rel) => {
        if (relTypeStats["*"]) {
            relTypeStats["*"].count = relTypeStats["*"].count + 1;
        } else {
            relTypeStats["*"] = {
                count: 1,
                properties: [],
            };
        }
        if (relTypeStats[rel.type]) {
            relTypeStats[rel.type].count = relTypeStats[rel.type].count + 1;
            relTypeStats[rel.type].properties = Object.assign({}, relTypeStats[rel.type].properties, rel.propertyMap);
        } else {
            relTypeStats[rel.type] = {
                count: 1,
                properties: rel.propertyMap,
            };
        }
    });
    return { labels: labelStats, relTypes: relTypeStats };
}

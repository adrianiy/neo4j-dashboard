import neo4j from 'neo4j-driver';
import { itemIntToString } from "./typing-utils";

export function extractNodesAndRelationshipsFromRecordsForOldVis(records,  filterRels = true, types = neo4j.types) {
    if (records.length === 0) {
        return { nodes: [], relationships: [] };
    }
    const keys = records[0].keys;
    let rawNodes = [];
    let rawRels = [];

    records.forEach((record) => {
        let graphItems = keys.map((key) => record.get(key));
        graphItems = flattenArray(recursivelyExtractGraphItems(types, graphItems)).filter((item) => item !== false);
        rawNodes = [...rawNodes, ...graphItems.filter((item) => item instanceof types.Node)];
        rawRels = [...rawRels, ...graphItems.filter((item) => item instanceof types.Relationship)];
        const paths = graphItems.filter((item) => item instanceof types.Path);
        paths.forEach((item) => extractNodesAndRelationshipsFromPath(item, rawNodes, rawRels, types));
    });

    const nodes = rawNodes.map((item) => {
        return {
            id: item.identity.toString(),
            labels: item.labels,
            image: item.properties.mcc,
            properties: itemIntToString(item.properties),
        };
    });
    let relationships = rawRels;
    if (filterRels) {
        relationships = rawRels.filter(
            (item) =>
                nodes.filter((node) => node.id === item.start.toString()).length > 0 &&
                nodes.filter((node) => node.id === item.end.toString()).length > 0
        );
    }
    relationships = relationships.map((item) => {
        return {
            id: item.identity.toString(),
            startNodeId: item.start.toString(),
            endNodeId: item.end.toString(),
            type: item.type,
            properties: itemIntToString(item.properties),
        };
    });
    return { nodes: nodes, relationships: relationships };
}

export const recursivelyExtractGraphItems = (types, item) => {
    if (item instanceof types.Node) return item;
    if (item instanceof types.Relationship) return item;
    if (item instanceof types.Path) return item;
    if (Array.isArray(item)) {
        return item.map((i) => recursivelyExtractGraphItems(types, i));
    }
    if (["number", "string", "boolean"].indexOf(typeof item) !== -1) return false;
    if (item === null) return false;
    if (typeof item === "object") {
        return Object.keys(item).map((key) => recursivelyExtractGraphItems(types, item[key]));
    }
    return item;
};

export const flattenArray = (arr) => {
    return arr.reduce((all, curr) => {
        if (Array.isArray(curr)) return all.concat(flattenArray(curr));
        return all.concat(curr);
    }, []);
};

const extractNodesAndRelationshipsFromPath = (item, rawNodes, rawRels) => {
    const paths = Array.isArray(item) ? item : [item];
    paths.forEach((path) => {
        let segments = path.segments;
        // Zero length path. No relationship, end === start
        if (!Array.isArray(path.segments) || path.segments.length < 1) {
            segments = [{ ...path, end: null }];
        }
        segments.forEach((segment) => {
            if (segment.start) rawNodes.push(segment.start);
            if (segment.end) rawNodes.push(segment.end);
            if (segment.relationship) rawRels.push(segment.relationship);
        });
    });
};

import Record from "neo4j-driver/lib/record";
import { Path, Node, PathSegment, Relationship } from "neo4j-driver/lib/graph-types";
import Integer from "neo4j-driver/lib/integer";

const parseProperties = (props) => {
    Object.keys(props).forEach((key) => {
        if (props[key] instanceof Object) {
            props[key] = createInteger(props[key]);
        }
    });
    return props;
};

const createPath = (path) => {
    if (path.start) {
        path.start = createNode(path.start);
    }
    if (path.end) {
        path.end = createNode(path.end);
    }
    if (path.segments) {
        path.segments = createSegments(path.segments);
    }
    return new Path(path.start, path.end, path.segments);
};

const createSegments = (segments) => {
    return segments.map((seg) => {
        return createSegment(seg);
    });
};

const createSegment = (seg) => {
    if (seg.start) {
        seg.start = createNode(seg.start);
    }
    if (seg.end) {
        seg.end = createNode(seg.end);
    }
    if (seg.relationship) {
        seg.relationship = createRel(seg.relationship);
    }
    return new PathSegment(seg.start, seg.relationship, seg.end);
};

const createRel = (rel) => {
    if (rel.identity) {
        rel.identity = createInteger(rel.identity);
    }
    if (rel.start) {
        rel.start = createInteger(rel.start);
    }
    if (rel.end) {
        rel.end = createInteger(rel.end);
    }
    if (rel.properties) {
        rel.properties = parseProperties(rel.properties);
    }
    return new Relationship(rel.identity, rel.start, rel.end, rel.type, rel.properties);
};

const createInteger = (data) => {
    return new Integer(data.low, data.high);
};

const createNode = (node) => {
    if (node.properties) {
        node.properties = parseProperties(node.properties);
    }
    if (node.identity) {
        node.identity = createInteger(node.identity);
    }
    return new Node(node.identity, node.labels, node.properties);
};

export const createRecord = (record) => {
    record._fields = record._fields.map((field) => {
        if (field) {
            if (field.segments) {
                return createPath(field);
            } else if (field.relationship) {
                return createSegment(field);
            } else if (field.identity && field.start && field.end) {
                return createRel(field);
            } else if (field.identity) {
                return createNode(field);
            } else {
                return parseProperties(field);
            }
        } else {
            return field;
        }
    });
    return new Record(record.keys, record._fields);
};

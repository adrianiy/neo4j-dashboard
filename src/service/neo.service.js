import Record from "neo4j-driver/lib/record";
import { Path, Node, PathSegment, Relationship } from "neo4j-driver/lib/graph-types";
import Integer from "neo4j-driver/lib/integer";

const SERVICE_URL = process.env.NODE_ENV === 'production' ? "https://neo4j-service.azurewebsites.net/api" : "http://localhost:5000";

export const doLogin = async (uri, user, password) => {
    const result = await fetch(`${SERVICE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ uri, user, password }),
        headers: { "Content-Type": "application/json" },
    });
    if (result.ok) {
        return await result.json();
    } else {
        return null;
    }
};

export const doLogout = async (sessionId) => {
    const result = await fetch(`${SERVICE_URL}/logout/${sessionId}`, { method: "DELETE" });
    if (result.ok) {
        return await result.json();
    } else {
        return null;
    }
};

export const getChart = async (sessionId, query) => {
    const result = await fetch(`${SERVICE_URL}/query/${sessionId}?q=${encodeURIComponent(query)}`);
    if (result.ok) {
        const parsed = await result.json();
        parsed.records = parsed.records.map((res) => {
            res._fields = res._fields.map((field) => {
                field.start = createNode(field.start)
                field.end = createNode(field.end)
                field.segments = field.segments.map((seg) => {
                    seg.start = createNode(seg.start)
                    seg.end = createNode(seg.end)
                    seg.relationship = createRel(seg.relationship)
                    return new PathSegment(seg.start, seg.relationship, seg.end)
                });
                return new Path(field.start, field.end, field.segments)
            });
            return new Record(res.keys, res._fields)
        });
        return parsed;
    } else {
        return null;
    }
};

const parseProperties = props => {
    Object.keys(props).forEach(key => {
        if (props[key] instanceof Object) {
            props[key] = createInteger(props[key])
        }
    })
    return props
}

const createRel = (rel) => {
    rel.identity = createInteger(rel.identity)
    rel.start = createInteger(rel.start)
    rel.end = createInteger(rel.end)
    rel.properties = parseProperties(rel.properties)
    return new Relationship(rel.identity, rel.start, rel.end, rel.type, rel.properties)
}

const createInteger = (data) => {
    return new Integer(data.low, data.high)
}

const createNode = (node) => {
    node.properties = parseProperties(node.properties)
    node.identity = createInteger(node.identity)
    return new Node(node.identity, node.labels, node.properties);
};

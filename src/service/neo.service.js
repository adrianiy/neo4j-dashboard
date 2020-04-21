import Record from "neo4j-driver/lib/record";
import { Path, Node, PathSegment, Relationship } from "neo4j-driver/lib/graph-types";
import Integer from "neo4j-driver/lib/integer";

const SERVICE_URL = process.env.NODE_ENV === 'production' ? "https://neo4j-service.azurewebsites.net/api" : "http://localhost:5000/api";

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
    const result = await fetch(`${SERVICE_URL}/logout/${sessionId}`);
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
                if (field.segments) {
                    return createPath(field)
                } else if (field.relationship) {
                    return createSegment(field)
                } else if (field.identity && field.start && field.end) {
                    return createRel(field)
                } else if (field.identity) {
                    return createNode(field)
                } else {
                    return parseProperties(field)
                }
            });
            return new Record(res.keys, res._fields)
        });
        return parsed;
    } else {
        throw (await result.json()).message;
    }
};

const getPhoto = mcc => {
    const model = mcc.slice(1, 5);
    const quality = mcc.slice(5, 8);
    const color = mcc.slice(8, 11);
    const camp = mcc.slice(12, 13);
    const year = mcc.slice(13, 17);
    return `https://static.zara.net/photos/${year}/${camp}/0/1/p/${model}/${quality}/${color}/2/w/400/${
        model}${quality}${color}_1_1_1.jpg?ts=1583248723772`;
}

const parseProperties = props => {
    Object.keys(props).forEach(key => {
        if (props[key] instanceof Object) {
            props[key] = createInteger(props[key])
        }
        if (key === 'mcc' && !Object.keys(props).includes('image')) {
            props['image'] = getPhoto(props[key])
        }
    })
    return props
}

const createPath = (path) => {
    if (path.start) {
        path.start = createNode(path.start);
    }
    if (path.end) {
        path.end = createNode(path.end);
    }
    if (path.segments) {
        path.segments = createSegments(path.segments)
    }
    return new Path(path.start, path.end, path.segments);
}

const createSegments = (segments) => {
    return segments.map((seg) => {
        return createSegment(seg);
    });

}

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
}

const createRel = (rel) => {
    if (rel.identity) {
        rel.identity = createInteger(rel.identity)
    }
    if (rel.start) {
        rel.start = createInteger(rel.start)
    }
    if (rel.end) {
        rel.end = createInteger(rel.end)
    }
    if (rel.properties) {
        rel.properties = parseProperties(rel.properties)
    }
    return new Relationship(rel.identity, rel.start, rel.end, rel.type, rel.properties)
}

const createInteger = (data) => {
    return new Integer(data.low, data.high)
}

const createNode = (node) => {
    if (node.properties) {
        node.properties = parseProperties(node.properties)
    }
    if (node.identity) {
        node.identity = createInteger(node.identity)
    }
    return new Node(node.identity, node.labels, node.properties);
};

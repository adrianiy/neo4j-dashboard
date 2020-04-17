import neo4j from 'neo4j-driver'

const isTemporalType = (anything) =>
    anything instanceof neo4j.types.Date ||
    anything instanceof neo4j.types.DateTime ||
    anything instanceof neo4j.types.Duration ||
    anything instanceof neo4j.types.LocalDateTime ||
    anything instanceof neo4j.types.LocalTime ||
    anything instanceof neo4j.types.Time;

const numberFormat = (anything) => {
    // Exclude false positives and return early
    if ([Infinity, -Infinity, NaN].includes(anything)) {
        return `${anything}`;
    }
    if (Math.floor(anything) === anything) {
        return `${anything}.0`;
    }
    return undefined;
};

const spacialFormat = (anything) => {
    const zString = anything.z ? `, z:${anything.z}` : "";
    return `point({srid:${anything.srid}, x:${anything.x}, y:${anything.y}${zString}})`;
};

const extractPathForRows = (path, converters) => {
    let segments = path.segments;
    // Zero length path. No relationship, end === start
    if (!Array.isArray(path.segments) || path.segments.length < 1) {
        segments = [{ ...path, end: null }];
    }
    return segments.map(function (segment) {
        return [
            objIntToString(segment.start, converters),
            objIntToString(segment.relationship, converters),
            objIntToString(segment.end, converters),
        ].filter((part) => part !== null);
    });
};

export function extractFromNeoObjects(obj, converters) {
    if (obj instanceof neo4j.types.Node || obj instanceof neo4j.types.Relationship) {
        return obj.properties;
    } else if (obj instanceof neo4j.types.Path) {
        return [].concat.apply([], extractPathForRows(obj, converters));
    }
    return obj;
}

export const stringModifier = (anything) => {
    if (typeof anything === "number") {
        return numberFormat(anything);
    }
    if (neo4j.isInt(anything)) {
        return anything.toString();
    }
    if (anything instanceof neo4j.types.Point) {
        return spacialFormat(anything);
    }
    if (isTemporalType(anything)) {
        return `"${anything.toString()}"`;
    }
    return undefined;
};

export function arrayIntToString(arr) {
    return arr.map((item) => itemIntToString(item));
}

export function objIntToString(obj) {
    const entry = extractFromNeoObjects(obj);
    let newObj = null;
    if (Array.isArray(entry)) {
        newObj = entry.map((item) => itemIntToString(item));
    } else if (entry !== null && typeof entry === "object") {
        newObj = {};
        Object.keys(entry).forEach((key) => {
            newObj[key] = itemIntToString(entry[key]);
        });
    }
    return newObj;
}

export function itemIntToString(item) {
    const res = stringModifier(item);
    if (res) return res;
    if (neo4j.isInt(item)) return neo4j.int(item);
    if (Array.isArray(item)) return arrayIntToString(item);
    if (["number", "string", "boolean"].indexOf(typeof item) !== -1) return item;
    if (item === null) return item;
    if (typeof item === "object") return objIntToString(item);
}

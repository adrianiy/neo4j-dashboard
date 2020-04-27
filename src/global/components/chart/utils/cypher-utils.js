import neo4j from 'neo4j-driver'

export const csvFormat = (anything) => {
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
    if (typeof anything === "string") {
        return anything;
    }
    return undefined;
};

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

/**
 * Transforms an array of neo4j driver records to an array of objects.
 * Leaves all values as they were, just changing the data structure.
 */
export const extractRecordsToResultArray = (records = []) => {
  records = Array.isArray(records) ? records : []
  const keys = records[0] ? [records[0].keys] : undefined
  return (keys || []).concat(
    records.map(record => {
      return record.keys.map((key, i) => record._fields[i])
    })
  )
}

export const flattenGraphItemsInResultArray = (
  types = neo4j.types,
  intChecker = neo4j.isInt,
  result = []
) => {
  return result.map(flattenGraphItems.bind(null, types, intChecker))
}

/**
 * Recursively looks for graph items and elevates their properties if found.
 * Leaves everything else (including neo4j integers) as is
 */
export const flattenGraphItems = (
  types = neo4j.types,
  intChecker = neo4j.isInt,
  item
) => {
  if (Array.isArray(item)) {
    return item.map(flattenGraphItems.bind(null, types, intChecker))
  }
  if (
    typeof item === 'object' &&
    item !== null &&
    !isGraphItem(types, item) &&
    !intChecker(item)
  ) {
    const out = {}
    const keys = Object.keys(item)
    for (let i = 0; i < keys.length; i++) {
      out[keys[i]] = flattenGraphItems(types, intChecker, item[keys[i]])
    }
    return out
  }
  if (isGraphItem(types, item)) {
    return extractPropertiesFromGraphItems(types, item)
  }
  return item
}

export const isGraphItem = (types = neo4j.types, item) => {
  return (
    item instanceof types.Node ||
    item instanceof types.Relationship ||
    item instanceof types.Path ||
    item instanceof types.PathSegment ||
    item instanceof neo4j.types.Date ||
    item instanceof neo4j.types.DateTime ||
    item instanceof neo4j.types.Duration ||
    item instanceof neo4j.types.LocalDateTime ||
    item instanceof neo4j.types.LocalTime ||
    item instanceof neo4j.types.Time ||
    item instanceof neo4j.types.Point
  )
}

export function isNeo4jValue(value) {
    switch (value['constructor']) {
        case neo4j.types.Date:
        case neo4j.types.DateTime:
        case neo4j.types.Duration:
        case neo4j.types.LocalDateTime:
        case neo4j.types.LocalTime:
        case neo4j.types.Time:
        case neo4j.types.Integer: // not exposed in typings but still there
            return true;
        default:
            return false;
    }
}

function neo4jValueToPlainValue(value) {
    switch (value['constructor']) {
        case neo4j.types.Date:
        case neo4j.types.DateTime:
        case neo4j.types.Duration:
        case neo4j.types.LocalDateTime:
        case neo4j.types.LocalTime:
        case neo4j.types.Time:
            return value.toString();
        case neo4j.types.Integer: // not exposed in typings but still there
            return value.inSafeRange() ? value.toInt() : value.toNumber();
        default:
            return value;
    }
}

export function extractPropertiesFromGraphItems(types = neo4j.types, obj) {
    if (obj instanceof types.Node || obj instanceof types.Relationship) {
        return obj.properties;
    } else if (obj instanceof types.Path) {
        return [].concat.apply([], arrayifyPath(types, obj));
    }
    return obj;
}

const arrayifyPath = (types = neo4j.types, path) => {
    let segments = path.segments;
    // Zero length path. No relationship, end === start
    if (!Array.isArray(path.segments) || path.segments.length < 1) {
        segments = [{ ...path, end: null }];
    }
    return segments.map(function (segment) {
        return [
            extractPropertiesFromGraphItems(types, segment.start),
            extractPropertiesFromGraphItems(types, segment.relationship),
            extractPropertiesFromGraphItems(types, segment.end),
        ].filter((part) => part !== null);
    });
};

/**
 * Converts a raw Neo4j record into a JSON friendly format, mimicking APOC output
 * @param     {Record}    record
 * @return    {*}
 */
export function recordToJSONMapper(record) {
  const keys = record.keys;

  return keys.reduce((agg, key) => {
      const field = record.get(key)

      return {
        ...agg,
        [key]: mapNeo4jValuesToPlainValues(field)
      }
    }, {})
}

function mapNeo4jValuesToPlainValues(values) {
    if (values && typeof values === "object") {
        return values
    }

    if (Array.isArray(values)) {
        return values.map(mapNeo4jValuesToPlainValues)
    }

    if (isNeo4jValue(values)) {
        return neo4jValueToPlainValue(values)
    }
}

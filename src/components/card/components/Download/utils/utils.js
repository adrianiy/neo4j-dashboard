import { stringModifier, extractRecordsToResultArray, flattenGraphItemsInResultArray } from "../../../../../global/components/chart/utils/cypher-utils";
import neo4j from "neo4j-driver";

/**
 * Takes an array of objects and stringifies it using a
 * modified version of JSON.stringify.
 * It takes a replacer without enforcing quoting rules to it.
 * Used so we can have Neo4j integers as string without quotes.
 */
export const stringifyResultArray = (formatter = stringModifier, arr = []) => {
    return arr.map((col) => {
        if (!col) return col;
        return col.map((fVal) => {
            return _stringifyMod(fVal, formatter);
        });
    });
};

export const transformResultRecordsToResultArray = (records) => {
    return records && records.length
        ? [records]
              .map(extractRecordsToResultArray)
              .map(flattenGraphItemsInResultArray.bind(null, neo4j.types, neo4j.isInt))[0]
        : undefined;
};

const _stringifyMod = (value, modFn = null, prettyLevel = false, skipOpeningIndentation = false) => {
    prettyLevel = !prettyLevel ? false : prettyLevel === true ? 1 : parseInt(prettyLevel);
    const nextPrettyLevel = prettyLevel ? prettyLevel + 1 : false;
    const newLine = prettyLevel ? "\n" : "";
    const indentation = prettyLevel && !skipOpeningIndentation ? Array(prettyLevel).join("  ") : "";
    const endIndentation = prettyLevel ? Array(prettyLevel).join("  ") : "";
    const propSpacing = prettyLevel ? " " : "";
    const toString = Object.prototype.toString;
    const isArray =
        Array.isArray ||
        function (a) {
            return toString.call(a) === "[object Array]";
        };
    const escMap = {
        '"': '"',
        "\\": "\\",
        "\b": "\b",
        "\f": "\f",
        "\n": "\n",
        "\r": "\r",
        "\t": "\t",
    };
    const escFunc = function (m) {
        return escMap[m] || "\\u" + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
    };
    const escRE = /[\\"\u0000-\u001F\u2028\u2029]/g; // eslint-disable-line no-control-regex
    if (modFn) {
        const modVal = modFn && modFn(value);
        if (typeof modVal !== "undefined") return indentation + modVal;
    }
    if (value == null) return indentation + "null";
    if (typeof value === "number") {
        return indentation + (isFinite(value) ? value.toString() : "null");
    }
    if (typeof value === "boolean") return indentation + value.toString();
    if (typeof value === "object") {
        if (typeof value.toJSON === "function") {
            return _stringifyMod(value.toJSON(), modFn, nextPrettyLevel);
        } else if (isArray(value)) {
            let hasValues = false;
            let res = "";
            for (let i = 0; i < value.length; i++) {
                hasValues = true;
                res += (i ? "," : "") + newLine + _stringifyMod(value[i], modFn, nextPrettyLevel);
            }
            return indentation + "[" + res + (hasValues ? newLine + endIndentation : "") + "]";
        } else if (toString.call(value) === "[object Object]") {
            const tmp = [];
            for (const k in value) {
                if (value.hasOwnProperty(k)) {
                    tmp.push(
                        _stringifyMod(k, modFn, nextPrettyLevel) +
                            ":" +
                            propSpacing +
                            _stringifyMod(value[k], modFn, nextPrettyLevel, true)
                    );
                }
            }
            return indentation + "{" + newLine + tmp.join("," + newLine) + newLine + endIndentation + "}";
        }
    }
    return indentation + '"' + value.toString().replace(escRE, escFunc) + '"';
};

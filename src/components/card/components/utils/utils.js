import { stringModifier, extractRecordsToResultArray, flattenGraphItemsInResultArray } from "../../../../global/components/chart/utils/cypher-utils";
import { stringifyMod } from "../../../../global/utils";
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
            return stringifyMod(fVal, formatter);
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

import { getQuery } from "./neo.service";

const queries = {
    propertyKeys: 'call db.propertyKeys',
    relationshipTypes: 'call db.relationshipTypes',
    labels: 'call db.labels',
    procedures: 'call dbms.procedures',
    functions: 'call dbms.functions'
};

export const getDBSchema = async (sessionId) => {
    const schemaInfo = await Promise.all(Object.entries(queries)
        .map(query => getQuery(sessionId, query[1]))
    );
    return Object.fromEntries(Object.entries(queries).map((e, i) => [e[0], schemaInfo[i]]));
}

import { createRecord } from './utils';

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

export const getQuery = async (sessionId, query) => {
    const result = await fetch(`${SERVICE_URL}/query/${sessionId}?q=${encodeURIComponent(query)}`);
    if (result.ok) {
        const parsed = await result.json();
        parsed.records = parsed.records.map((res) => {
            return createRecord(res);
        });
        return parsed;
    } else {
        throw (await result.json()).message;
    }
};

const SERVICE_URL = 'http://localhost:5000/api'

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
    const result = await fetch(`${SERVICE_URL}/logout/${sessionId}`, { method: 'DELETE' })
    if (result.ok) {
        return await result.json();
    } else {
        return null;
    }
}

export const getChart = async (sessionId, query) => {
    const result = await fetch(`${SERVICE_URL}/query/${sessionId}?q=${encodeURIComponent(query)}`)
    if (result.ok) {
        return await result.json();
    } else {
        return null;
    }
}

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Safe fetch wrapper to handle JSON parsing and common errors
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });
        
        // Handle no content
        if (response.status === 204) {
            return { ok: true, data: null };
        }

        // Try parsing JSON
        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
            return { ok: false, status: response.status, error: "Invalid response from server." };
        }

        if (!response.ok) {
            return { ok: false, status: response.status, error: data.detail || data.message || "An error occurred" };
        }

        return { ok: true, data };
    } catch (error) {
        console.error("Network Error:", error);
        return { ok: false, error: "Unable to connect to Mediease server. Please make sure the backend is running." };
    }
}

// Check auth state
function getAuth() {
    const userStr = localStorage.getItem('mediease_user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

function setAuth(userObj) {
    localStorage.setItem('mediease_user', JSON.stringify(userObj));
}

function logout() {
    localStorage.removeItem('mediease_user');
    window.location.href = '/index.html';
}

// Transparent client adapter to bridge Trickle API calls to our Express + Neon Postgres API backend
(function() {
    console.log("Neon Postgres Client Adapter Loaded: Intercepting Trickle database APIs and routing to native Express backend...");

    window.trickleListObjects = async function(tableName, limit = 100, order = true) {
        try {
            const response = await fetch(`/api/requests?limit=${limit}&order=${order}`);
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            const data = await response.json();
            return data; // Expected format: { items: [...] }
        } catch (error) {
            console.error("Failed to fetch requests via api-client:", error);
            throw error;
        }
    };

    window.trickleCreateObject = async function(tableName, data) {
        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            const newObject = await response.json();
            return newObject; // Expected format: { objectId, createdAt, objectData }
        } catch (error) {
            console.error("Failed to create request via api-client:", error);
            throw error;
        }
    };

    window.trickleDeleteObject = async function(tableName, objectId) {
        try {
            const response = await fetch(`/api/requests/${objectId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            const result = await response.json();
            return result; // Expected format: { success: true }
        } catch (error) {
            console.error("Failed to delete request via api-client:", error);
            throw error;
        }
    };
})();

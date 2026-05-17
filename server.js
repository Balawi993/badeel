// Monolithic Express Server with Neon PostgreSQL Integration for Badeeli SPA
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Express Body Parser middleware
app.use(express.json());

// Initialize PostgreSQL Connection Pool using Neon DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error("\n========================================================");
    console.error("CRITICAL CONFIGURATION ERROR:");
    console.error("DATABASE_URL environment variable is missing!");
    console.error("Please add the DATABASE_URL variable in your Railway dashboard settings");
    console.error("with your Neon PostgreSQL connection string.");
    console.error("========================================================\n");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for serverless database connections like Neon
    }
});

// Test Database Connection and Initialize Schema
async function initializeDatabase() {
    try {
        console.log("Connecting to Neon PostgreSQL database...");
        const client = await pool.connect();
        console.log("Connected successfully to Neon Postgres!");
        
        // Create table schema if it does not exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS transfer_requests (
                object_id VARCHAR(50) PRIMARY KEY,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                specialty VARCHAR(100) NOT NULL,
                current_region VARCHAR(100) NOT NULL,
                hospital_name VARCHAR(255),
                desired_regions JSONB NOT NULL,
                phone VARCHAR(50) NOT NULL,
                notes TEXT
            );
        `);
        console.log("Database schema initialized and verified.");
        client.release();
    } catch (error) {
        console.error("CRITICAL: Failed to connect or initialize Neon PostgreSQL database:", error);
        process.exit(1);
    }
}

initializeDatabase();

// --- API Routes ---

// 1. GET ALL REQUESTS (Retrieve from Neon Postgres and map to Trickle React format)
app.get('/api/requests', async (req, res) => {
    try {
        const queryResult = await pool.query(
            'SELECT * FROM transfer_requests ORDER BY created_at DESC'
        );
        
        // Map database row columns back to Trickle React front-end structure
        const formattedItems = queryResult.rows.map(row => ({
            objectId: row.object_id,
            createdAt: row.created_at.toISOString(),
            objectData: {
                specialty: row.specialty,
                current_region: row.current_region,
                hospital_name: row.hospital_name || '',
                desired_regions: row.desired_regions, // pg parses JSONB column automatically into JS array
                phone: row.phone,
                notes: row.notes || ''
            }
        }));

        res.json({ items: formattedItems });
    } catch (error) {
        console.error("Error fetching transfer requests:", error);
        res.status(500).json({ error: "Failed to fetch transfer requests" });
    }
});

// 2. CREATE REQUEST (Insert into Neon Postgres and return standard Trickle React format)
app.post('/api/requests', async (req, res) => {
    try {
        const data = req.body;
        
        // Validation check
        if (!data.specialty || !data.current_region || !data.desired_regions || !data.phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const objectId = "req_" + Math.random().toString(36).substring(2, 11);
        const desiredRegionsJson = JSON.stringify(data.desired_regions);

        const insertQuery = `
            INSERT INTO transfer_requests (object_id, specialty, current_region, hospital_name, desired_regions, phone, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING created_at;
        `;
        
        const queryResult = await pool.query(insertQuery, [
            objectId,
            data.specialty,
            data.current_region,
            data.hospital_name || '',
            desiredRegionsJson,
            data.phone,
            data.notes || ''
        ]);

        const createdAt = queryResult.rows[0].created_at.toISOString();

        // Return standard Trickle React-compatible format
        res.status(201).json({
            objectId,
            createdAt,
            objectData: {
                ...data,
                hospital_name: data.hospital_name || '',
                notes: data.notes || ''
            }
        });
    } catch (error) {
        console.error("Error creating transfer request:", error);
        res.status(500).json({ error: "Failed to create transfer request" });
    }
});

// 3. DELETE REQUEST (Remove from Neon Postgres)
app.delete('/api/requests/:id', async (req, res) => {
    try {
        const objectId = req.params.id;
        
        const deleteQuery = 'DELETE FROM transfer_requests WHERE object_id = $1';
        await pool.query(deleteQuery, [objectId]);
        
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting transfer request:", error);
        res.status(500).json({ error: "Failed to delete transfer request" });
    }
});

// --- Static Serving & SPA Support ---

// Serve static frontend assets
app.use(express.static(__dirname));

// Route mapping for clean URLs in local & production
app.get('/adminn', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminn.html'));
});

// SPA catch-all routing fallback (serves index.html for undefined routes)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start monolithic server
app.listen(PORT, () => {
    console.log(`Badeeli Monolith Server is running at http://localhost:${PORT}`);
});

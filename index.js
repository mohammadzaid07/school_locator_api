// Import required modules
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const db_host = String(process.env.DB_HOST);
const db_user = String(process.env.DB_USER);
const db_password = String(process.env.DB_PASSWORD);
const db_name = String(process.env.DB_NAME);

// Configure your MySQL connection here
const pool = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper: Validate School Data
function validateSchool(data) {
    if (!data.name || typeof data.name !== 'string') return 'Invalid or missing name';
    if (!data.address || typeof data.address !== 'string') return 'Invalid or missing address';
    if (typeof data.latitude !== 'number' || isNaN(data.latitude)) return 'Invalid latitude';
    if (typeof data.longitude !== 'number' || isNaN(data.longitude)) return 'Invalid longitude';
    return null;
}

// Haversine Distance Calculation
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Add School API
app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    const error = validateSchool({ name, address, latitude, longitude });
    if (error) return res.status(400).json({ error });

    try {
        const [result] = await pool.execute(
            'INSERT INTO schools_table (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.json({ message: 'School added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// List Schools API
app.get('/listSchools', async (req, res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ error: 'Invalid or missing latitude/longitude parameters' });
    }

    try {
        const [schools] = await pool.query('SELECT * FROM schools_table');

        // Calculate distance and sort
        schools.forEach(school => {
            school.distance = getDistance(userLat, userLon, school.latitude, school.longitude);
        });
        schools.sort((a, b) => a.distance - b.distance);

        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
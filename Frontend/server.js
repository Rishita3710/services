const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vehicle-maintenance', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Schemas
const maintenanceSchema = new mongoose.Schema({
    vehicle: String,
    service: String,
    date: Date
});

const scheduleSchema = new mongoose.Schema({
    vehicle: String,
    date: Date
});

// Maintenance Models
const maintenanceModel = mongoose.model('Maintenance', maintenanceSchema);
const scheduleModel = mongoose.model('Schedule', scheduleSchema);

// Mock Distance Matrix for Route Optimization
const distanceMatrix = {
    "CityA": { "CityB": 50, "CityC": 60, "CityD": 120 },
    "CityB": { "CityA": 50, "CityC": 40, "CityD": 80 },
    "CityC": { "CityA": 60, "CityB": 40, "CityD": 70 },
    "CityD": { "CityA": 120, "CityB": 80, "CityC": 70 },
};

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

/* Vehicle Maintenance APIs */

// Get all maintenance records
app.get('/api/maintenance', async (req, res) => {
    try {
        const records = await maintenanceModel.find();
        res.json(records);
    } catch (error) {
        res.status(500).send('Error retrieving maintenance records');
    }
});

// Add new maintenance record
app.post('/api/maintenance', async (req, res) => {
    const { vehicle, service, date } = req.body;
    const newRecord = new maintenanceModel({ vehicle, service, date });

    try {
        await newRecord.save();
        res.status(201).send('Maintenance record added');
    } catch (error) {
        res.status(500).send('Error saving maintenance record');
    }
});

// Get maintenance schedules
app.get('/api/schedule', async (req, res) => {
    try {
        const schedules = await scheduleModel.find();
        res.json(schedules);
    } catch (error) {
        res.status(500).send('Error retrieving schedules');
    }
});

// Add new maintenance schedule
app.post('/api/schedule', async (req, res) => {
    const { vehicle, date } = req.body;
    const newSchedule = new scheduleModel({ vehicle, date });

    try {
        await newSchedule.save();
        res.status(201).send('Maintenance schedule added');
    } catch (error) {
        res.status(500).send('Error saving maintenance schedule');
    }
});

// Get service history
app.get('/api/history', async (req, res) => {
    try {
        const history = await maintenanceModel.find();
        res.json(history);
    } catch (error) {
        res.status(500).send('Error retrieving service history');
    }
});

/* Route Optimization APIs */

// Calculate optimal route
function calculateOptimalRoute(source, destinations, costPerKm) {
    let route = [source];
    let totalDistance = 0;

    let currentCity = source;
    destinations = [...destinations]; // Clone the array

    while (destinations.length > 0) {
        let nearestCity = null;
        let minDistance = Infinity;

        for (let city of destinations) {
            const distance = distanceMatrix[currentCity][city.trim()];
            if (distance < minDistance) {
                nearestCity = city.trim();
                minDistance = distance;
            }
        }

        route.push(nearestCity);
        totalDistance += minDistance;
        currentCity = nearestCity;

        destinations = destinations.filter(city => city.trim() !== nearestCity);
    }

    return {
        route,
        totalDistance,
        totalCost: totalDistance * costPerKm,
    };
}

// Optimize route API
app.post('/api/optimize-route', (req, res) => {
    const { source, destinations, costPerKm } = req.body;

    if (!source || !destinations || destinations.length === 0 || !costPerKm) {
        return res.status(400).send('Missing required parameters');
    }

    const result = calculateOptimalRoute(source, destinations, costPerKm);
    res.json(result);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

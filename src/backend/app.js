const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const dashboardRoutes = require('./routes/dashboard.routes');
const projectsRoutes = require('./routes/projects.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const manpowerRoutes = require('./routes/manpower.routes');
const safetyRoutes = require('./routes/safety.routes');
const alertsRoutes = require('./routes/alerts.routes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route Mounting
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/manpower', manpowerRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/alerts', alertsRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;

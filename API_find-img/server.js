require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WorkflowController = require('./controllers/workflowController');
const { router: workflowRouter, setController } = require('./routes/workflow');

const app = express();
const PORT = process.env.PORT || 3000;
const R2_BASE_URL = process.env.R2_BASE_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize controller
const workflowController = new WorkflowController(R2_BASE_URL);
setController(workflowController);

// Routes
app.use('/api/workflow', workflowRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Logo Selection API',
    version: '1.0.0',
    endpoints: {
      'POST /api/workflow/initialize': 'Initialize session with chatbot output',
      'POST /api/workflow/:sessionId/logo': 'Select logo',
      'POST /api/workflow/:sessionId/color': 'Select color',
      'POST /api/workflow/:sessionId/layout': 'Select layout',
      'POST /api/workflow/:sessionId/background': 'Select background',
      'POST /api/workflow/:sessionId/customization': 'Customize text and colors',
      'POST /api/workflow/:sessionId/export': 'Finalize and get export JSON',
      'GET /api/workflow/:sessionId/status': 'Get session status',
      'POST /api/workflow/:sessionId/reset': 'Reset session to specific step',
      'GET /health': 'Health check'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`🗂️  R2 Base URL: ${R2_BASE_URL}`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/initialize`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/logo`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/color`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/layout`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/background`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/customization`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/export`);
  console.log(`   GET  http://localhost:${PORT}/api/workflow/:sessionId/status`);
  console.log(`   POST http://localhost:${PORT}/api/workflow/:sessionId/reset`);
  console.log(`   GET  http://localhost:${PORT}/health\n`);
});

module.exports = app;

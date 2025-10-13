const express = require('express');
const router = express.Router();

// Initialize controller (will be done in server.js)
let workflowController;

const setController = (controller) => {
  workflowController = controller;
};

// Step 1: Initialize session and get logo options
router.post('/initialize', (req, res) => {
  return workflowController.initializeSession(req, res);
});

// Step 2: Select logo and get color options
router.post('/:sessionId/logo', (req, res) => {
  return workflowController.selectLogo(req, res);
});

// Step 3: Select color and get layout options
router.post('/:sessionId/color', (req, res) => {
  return workflowController.selectColor(req, res);
});

// Step 4: Select layout and get background options
router.post('/:sessionId/layout', (req, res) => {
  return workflowController.selectLayout(req, res);
});

// Step 5: Select background and move to customization
router.post('/:sessionId/background', (req, res) => {
  return workflowController.selectBackground(req, res);
});

// Step 6: Customize content (text, colors, fonts)
router.post('/:sessionId/customization', (req, res) => {
  return workflowController.customizeContent(req, res);
});

// Step 7: Finalize and get export JSON
router.post('/:sessionId/export', (req, res) => {
  return workflowController.finalizeExport(req, res);
});

// Get session status
router.get('/:sessionId/status', (req, res) => {
  return workflowController.getSessionStatus(req, res);
});

// Reset session to a specific step
router.post('/:sessionId/reset', (req, res) => {
  return workflowController.resetStep(req, res);
});

module.exports = { router, setController };

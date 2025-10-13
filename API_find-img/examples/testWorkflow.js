#!/usr/bin/env node

/**
 * Complete workflow test script
 * Run with: node examples/testWorkflow.js
 */

const axios = require('axios');
const { chatbotOutput } = require('./testData');

const BASE_URL = 'http://localhost:3000/api/workflow';
let sessionId;

// Helper function for API calls
async function apiCall(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Test workflow
async function testCompleteWorkflow() {
  console.log('\n🚀 Starting Complete Workflow Test\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Initialize session
    console.log('\n📝 Step 1: Initialize Session');
    console.log('-'.repeat(60));
    const initResponse = await apiCall('POST', '/initialize', chatbotOutput);
    sessionId = initResponse.data.sessionId;
    console.log('✅ Session created:', sessionId);
    console.log('📁 Category detected:', initResponse.data.category);
    console.log('🎨 Total logos:', initResponse.data.totalLogos);
    console.log('First logo:', initResponse.data.logos[0]);

    // Wait for user input
    await sleep(1000);

    // Step 2: Select logo
    console.log('\n🎯 Step 2: Select Logo');
    console.log('-'.repeat(60));
    const logoSelection = {
      logoId: initResponse.data.logos[0].id,
      category: initResponse.data.category,
      variant: 1
    };
    const logoResponse = await apiCall('POST', `/${sessionId}/logo`, logoSelection);
    console.log('✅ Logo selected:', logoSelection.logoId);
    console.log('🎨 Total colors:', logoResponse.data.totalColors);
    console.log('Available colors:', logoResponse.data.colors.map(c => c.color).join(', '));

    await sleep(1000);

    // Step 3: Select color
    console.log('\n🌈 Step 3: Select Color');
    console.log('-'.repeat(60));
    const blueColor = logoResponse.data.colors.find(c => c.color === 'blue');
    const colorSelection = {
      color: blueColor.color,
      colorUrl: blueColor.url
    };
    const colorResponse = await apiCall('POST', `/${sessionId}/color`, colorSelection);
    console.log('✅ Color selected:', colorSelection.color);
    console.log('🎨 Total backgrounds:', colorResponse.data.totalBackgrounds);
    console.log('First 3 backgrounds:', colorResponse.data.backgrounds.slice(0, 3));

    await sleep(1000);

    // Step 4: Select background
    console.log('\n🖼️  Step 4: Select Background');
    console.log('-'.repeat(60));
    const background = colorResponse.data.backgrounds[0];
    const backgroundSelection = {
      backgroundId: background.id,
      type: background.type,
      value: background.value
    };
    const backgroundResponse = await apiCall('POST', `/${sessionId}/background`, backgroundSelection);
    console.log('✅ Background selected:', background.name || background.id);
    console.log('🎨 Total layouts:', backgroundResponse.data.totalLayouts);
    console.log('Layout types:', [...new Set(backgroundResponse.data.layouts.map(l => l.type))].join(', '));

    await sleep(1000);

    // Step 5: Select layouts
    console.log('\n📐 Step 5: Select Layouts');
    console.log('-'.repeat(60));
    const selectedLayouts = backgroundResponse.data.layouts.slice(0, 3).map(l => l.id);
    const layoutSelection = {
      layouts: selectedLayouts
    };
    const finalResponse = await apiCall('POST', `/${sessionId}/layout`, layoutSelection);
    console.log('✅ Layouts selected:', selectedLayouts.join(', '));
    console.log('\n🎉 WORKFLOW COMPLETED!');
    console.log('=' .repeat(60));

    // Display final result
    console.log('\n📊 Final Export JSON:');
    console.log('-'.repeat(60));
    console.log(JSON.stringify(finalResponse.data, null, 2));

    // Get session status
    console.log('\n📈 Session Status:');
    console.log('-'.repeat(60));
    const statusResponse = await apiCall('GET', `/${sessionId}/status`);
    console.log(JSON.stringify(statusResponse.data, null, 2));

    console.log('\n✨ Test completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Helper sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run test
if (require.main === module) {
  console.log('\n🧪 Logo Selection API - Workflow Test');
  console.log('Make sure the server is running on http://localhost:3000\n');
  
  testCompleteWorkflow()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { testCompleteWorkflow };

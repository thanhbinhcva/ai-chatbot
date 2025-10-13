#!/usr/bin/env node

/**
 * Test New Workflow: Logo → Color → Layout → Background → Customization → Export
 * Run with: node examples/testNewFlow.js
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
async function testNewWorkflow() {
  console.log('\n🚀 Starting New Workflow Test');
  console.log('=' .repeat(70));
  console.log('Flow: Logo → Color → Layout → Background → Customization → Export\n');

  try {
    // Step 1: Initialize session
    console.log('📝 Step 1: Initialize Session');
    console.log('-'.repeat(70));
    const initResponse = await apiCall('POST', '/initialize', chatbotOutput);
    sessionId = initResponse.data.sessionId;
    console.log('✅ Session created:', sessionId);
    console.log('📁 Category detected:', initResponse.data.category);
    console.log('🎨 Total logos:', initResponse.data.totalLogos);
    console.log('First logo:', initResponse.data.logos[0].name);
    await sleep(1000);

    // Step 2: Select logo
    console.log('\n🎯 Step 2: Select Logo');
    console.log('-'.repeat(70));
    const logoSelection = {
      logoId: initResponse.data.logos[0].id,
      category: initResponse.data.category,
      variant: 1
    };
    const logoResponse = await apiCall('POST', `/${sessionId}/logo`, logoSelection);
    console.log('✅ Logo selected:', logoSelection.logoId);
    console.log('🎨 Total colors:', logoResponse.data.totalColors);
    console.log('Available colors:', logoResponse.data.colors.slice(0, 3).map(c => c.color).join(', '), '...');
    await sleep(1000);

    // Step 3: Select color
    console.log('\n🌈 Step 3: Select Color');
    console.log('-'.repeat(70));
    const blueColor = logoResponse.data.colors.find(c => c.color === 'blue');
    const colorSelection = {
      color: blueColor.color,
      colorUrl: blueColor.url
    };
    const colorResponse = await apiCall('POST', `/${sessionId}/color`, colorSelection);
    console.log('✅ Color selected:', colorSelection.color);
    console.log('📐 Total layouts:', colorResponse.data.totalLayouts);
    console.log('Layout types:', [...new Set(colorResponse.data.layouts.map(l => l.type))].join(', '));
    await sleep(1000);

    // Step 4: Select layout (NEW POSITION)
    console.log('\n📐 Step 4: Select Layout');
    console.log('-'.repeat(70));
    const selectedLayout = colorResponse.data.layouts[0];
    const layoutSelection = {
      layoutId: selectedLayout.id
    };
    const layoutResponse = await apiCall('POST', `/${sessionId}/layout`, layoutSelection);
    console.log('✅ Layout selected:', selectedLayout.name);
    console.log('🖼️  Total backgrounds:', layoutResponse.data.totalBackgrounds);
    console.log('Background types: color & image');
    await sleep(1000);

    // Step 5: Select background (NEW POSITION)
    console.log('\n🖼️  Step 5: Select Background');
    console.log('-'.repeat(70));
    const background = layoutResponse.data.backgrounds[0];
    const backgroundSelection = {
      backgroundId: background.id,
      type: background.type,
      value: background.value
    };
    const backgroundResponse = await apiCall('POST', `/${sessionId}/background`, backgroundSelection);
    console.log('✅ Background selected:', background.name || background.id);
    console.log('📝 Current customization:');
    console.log('   Brand Name:', backgroundResponse.data.currentCustomization.brandName);
    console.log('   Slogan:', backgroundResponse.data.currentCustomization.slogan);
    console.log('   Phone:', backgroundResponse.data.currentCustomization.phoneNumber);
    await sleep(1000);

    // Step 6: Customize content (NEW STEP)
    console.log('\n✏️  Step 6: Customize Content');
    console.log('-'.repeat(70));
    const customization = {
      brandName: 'Nhôm Kính An Phát - UPDATED',
      slogan: 'Chất Lượng Là Danh Dự',
      phoneNumber: '0986899001',
      location: '212 Quang Trung, Hà Đông, Hà Nội',
      textColor: '#0066CC',
      textFont: 'Arial Bold'
    };
    const customResponse = await apiCall('POST', `/${sessionId}/customization`, customization);
    console.log('✅ Customization updated:');
    console.log('   Brand Name:', customResponse.data.customization.brandName);
    console.log('   Slogan:', customResponse.data.customization.slogan);
    console.log('   Text Color:', customResponse.data.customization.textColor);
    console.log('   Text Font:', customResponse.data.customization.textFont);
    console.log('   Can Export:', customResponse.data.canExport ? '✅ Yes' : '❌ No');
    await sleep(1000);

    // Step 7: Finalize export (NEW ENDPOINT)
    console.log('\n📊 Step 7: Finalize Export');
    console.log('-'.repeat(70));
    const finalResponse = await apiCall('POST', `/${sessionId}/export`);
    console.log('✅ Export completed!');
    console.log('📦 Brief ID:', finalResponse.data.briefId);
    console.log('🎨 Chosen Logo:', finalResponse.data.chosenLogoUrl.split('/').pop());
    console.log('🌈 Chosen Color:', finalResponse.data.chosenColor);
    console.log('📐 Chosen Layout:', finalResponse.data.chosenLayout.name);
    console.log('🖼️  Background Type:', finalResponse.data.chosenBackground.type);

    console.log('\n🎉 WORKFLOW COMPLETED!');
    console.log('=' .repeat(70));

    // Display final result
    console.log('\n📊 Final Export JSON:');
    console.log('-'.repeat(70));
    console.log(JSON.stringify(finalResponse.data, null, 2));

    // Validate output
    console.log('\n✅ VALIDATION CHECKS:');
    console.log('-'.repeat(70));
    validateOutput(finalResponse.data);

    console.log('\n✨ All tests passed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Validate output structure
function validateOutput(data) {
  const checks = [
    { name: 'briefId exists', check: !!data.briefId },
    { name: 'sessionId exists', check: !!data.sessionId },
    { name: 'chosenLogoUrl exists', check: !!data.chosenLogoUrl },
    { name: 'chosenColor exists', check: !!data.chosenColor },
    { name: 'chosenLayout exists', check: !!data.chosenLayout },
    { name: 'chosenBackground exists', check: !!data.chosenBackground },
    { name: 'customization exists', check: !!data.customization },
    { name: 'assetsToExport exists', check: !!data.assetsToExport },
    { name: 'assetsToExport is array', check: Array.isArray(data.assetsToExport) },
    { name: 'assetsToExport has items', check: data.assetsToExport.length > 0 },
    { name: 'layoutLink in customizations', check: !!data.assetsToExport[0].customizations.layoutLink },
    { name: 'brand_name in customizations', check: !!data.assetsToExport[0].customizations.brand_name },
    { name: 'color URL in customizations', check: !!data.assetsToExport[0].customizations.color },
    { name: 'background in customizations', check: !!data.assetsToExport[0].customizations.background },
    { name: 'logo URL in customizations', check: !!data.assetsToExport[0].customizations.logo },
    { name: 'text color applied', check: data.customization.textColor === '#0066CC' },
    { name: 'text font applied', check: data.customization.textFont === 'Arial Bold' },
    { name: 'brand name updated', check: data.customization.brandName.includes('UPDATED') }
  ];

  checks.forEach(({ name, check }) => {
    console.log(`   ${check ? '✅' : '❌'} ${name}`);
    if (!check) {
      throw new Error(`Validation failed: ${name}`);
    }
  });

  console.log(`\n   ✅ All ${checks.length} validation checks passed!`);
}

// Helper sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run test
if (require.main === module) {
  console.log('\n🧪 Logo Selection API - New Workflow Test');
  console.log('Make sure the server is running on http://localhost:3000\n');
  
  testNewWorkflow()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { testNewWorkflow };

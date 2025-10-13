// Quick test to verify the layout fix
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLayoutFix() {
  console.log('🧪 Testing Layout ID Fix\n');

  try {
    // Step 1: Initialize session
    console.log('1️⃣  Initializing session...');
    const initResponse = await axios.post(`${BASE_URL}/api/workflow/initialize`, {
      brand_name_full: "Nhôm kính An Phát",
      slogan: "Chất Lượng Dẫn Đầu",
      phone: "0986899001",
      location: "212 Quang Trung, Hà Đông",
      main_products: ["cửa nhôm", "cửa kính"],
      logo_style: ["Hiện đại"],
      main_color: ["xanh dương"]
    });
    
    const sessionId = initResponse.data.data.sessionId;
    console.log(`✅ Session created: ${sessionId}\n`);

    // Step 2: Select logo
    console.log('2️⃣  Selecting logo...');
    const logoResponse = await axios.post(`${BASE_URL}/api/workflow/${sessionId}/logo`, {
      logoId: "Door-1",
      category: "Door",
      variant: 1
    });
    console.log(`✅ Logo selected\n`);

    // Step 3: Select color
    console.log('3️⃣  Selecting color...');
    const firstColor = logoResponse.data.data.colors[0];
    const colorResponse = await axios.post(`${BASE_URL}/api/workflow/${sessionId}/color`, {
      color: firstColor.color,
      colorUrl: firstColor.url
    });
    
    const layouts = colorResponse.data.data.layouts;
    console.log(`✅ Color selected, got ${layouts.length} layouts\n`);
    
    // Show available layout IDs
    console.log('📋 Available Layout IDs:');
    layouts.forEach(layout => {
      console.log(`   - ${layout.id} (${layout.type} ${layout.name})`);
    });
    console.log();

    // Step 4: Test layout selection with NEW ID format
    console.log('4️⃣  Testing layout selection with NEW ID format...');
    
    // Test with Avt-1 (correct format)
    try {
      const layoutResponse = await axios.post(`${BASE_URL}/api/workflow/${sessionId}/layout`, {
        layoutId: "Avt-1"
      });
      console.log(`✅ SUCCESS: Layout "Avt-1" accepted!`);
      console.log(`   Selected: ${layoutResponse.data.data.selectedLayout.name}`);
    } catch (error) {
      console.log(`❌ FAILED: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testLayoutFix();

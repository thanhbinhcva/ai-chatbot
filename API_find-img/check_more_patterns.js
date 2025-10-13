// Test more patterns for Card and Cover
const axios = require('axios');

const R2_BASE_URL = 'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev';

async function testMorePatterns() {
  console.log('🔍 Testing Card and Cover patterns:\n');
  
  // Test Card patterns
  console.log('📁 Card:');
  const cardPatterns = ['Card-1', 'card-1', 'C-1', 'Cd-1'];
  for (const pattern of cardPatterns) {
    const url = `${R2_BASE_URL}/Layout/Card/${pattern}.svg`;
    try {
      const response = await axios.head(url, { timeout: 3000 });
      console.log(`✅ Found: ${pattern}.svg`);
    } catch (error) {
      console.log(`❌ Not found: ${pattern}.svg`);
    }
  }

  console.log('\n📁 Cover:');
  const coverPatterns = ['Cover-1', 'cover-1', 'Cv-1', 'Cvr-1'];
  for (const pattern of coverPatterns) {
    const url = `${R2_BASE_URL}/Layout/Cover/${pattern}.svg`;
    try {
      const response = await axios.head(url, { timeout: 3000 });
      console.log(`✅ Found: ${pattern}.svg`);
    } catch (error) {
      console.log(`❌ Not found: ${pattern}.svg`);
    }
  }

  // Test thumbnail patterns
  console.log('\n📁 Thumbnails:');
  const thumbPatterns = [
    'Layout/Avatar/Avt-1_thumb.jpg',
    'Layout/Avatar/Avt-1-thumb.jpg',
    'Layout/Avatar/avt-1_thumb.jpg',
    'Layout/Billboard/Billboard-1_thumb.jpg',
    'Layout/Billboard/Billboard-1-thumb.jpg',
  ];
  
  for (const path of thumbPatterns) {
    const url = `${R2_BASE_URL}/${path}`;
    try {
      const response = await axios.head(url, { timeout: 3000 });
      console.log(`✅ Found: ${path}`);
    } catch (error) {
      console.log(`❌ Not found: ${path}`);
    }
  }
}

testMorePatterns();

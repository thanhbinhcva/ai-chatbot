// Script to verify and list actual R2 file structure for Layout files
const axios = require('axios');

const R2_BASE_URL = 'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev';

// Layout types based on R2 structure
const layoutTypes = ['Avatar', 'Billboard', 'Card', 'Cover'];

// Actual file naming patterns from R2
const actualLayoutPatterns = {
  // Pattern 1: Avt-1, Avt-2, etc (shortened)
  'Avatar': {
    prefix: 'Avt',  // Shortened from Avatar
    count: 5
  },
  'Billboard': {
    prefix: 'Billboard',  // Full name
    count: 5
  },
  'Card': {
    prefix: 'Card',  // Full name
    count: 5
  },
  'Cover': {
    prefix: 'Cover',  // Full name
    count: 5
  }
};

async function testLayoutUrls() {
  console.log('🔍 Testing Layout URLs on R2...\n');

  for (const [type, config] of Object.entries(actualLayoutPatterns)) {
    console.log(`\n📁 ${type}:`);
    console.log('=' .repeat(50));

    for (let i = 1; i <= config.count; i++) {
      // Test different naming patterns
      const patterns = [
        `${config.prefix}-${i}`,           // Avt-1, Card-1
        `${config.prefix}_${i}`,           // Avt_1, Card_1
        `${type.toLowerCase()}-${i}`,      // avatar-1, card-1
        `${type.toLowerCase()}_${i}`,      // avatar_1, card_1
      ];

      for (const pattern of patterns) {
        const url = `${R2_BASE_URL}/Layout/${type}/${pattern}.svg`;
        
        try {
          const response = await axios.head(url, { timeout: 3000 });
          if (response.status === 200) {
            console.log(`✅ Found: ${pattern}.svg`);
            console.log(`   URL: ${url}`);
            break;
          }
        } catch (error) {
          // Try next pattern
          if (patterns.indexOf(pattern) === patterns.length - 1) {
            console.log(`❌ Not found: ${pattern}.svg`);
          }
        }
      }
    }
  }
}

// Test a few URLs directly
async function quickTest() {
  console.log('🚀 Quick test of common patterns:\n');
  
  const testUrls = [
    'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Avatar/Avt-1.svg',
    'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Avatar/Avt_1.svg',
    'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Avatar/avatar-1.svg',
    'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Avatar/avatar_1.svg',
    'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Card/Card-1.svg',
    'https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Card/card-1.svg',
  ];

  for (const url of testUrls) {
    try {
      const response = await axios.head(url, { timeout: 3000 });
      console.log(`✅ ${response.status}: ${url}`);
    } catch (error) {
      console.log(`❌ Failed: ${url}`);
    }
  }
}

// Run tests
(async () => {
  await quickTest();
  console.log('\n' + '='.repeat(60) + '\n');
  await testLayoutUrls();
})();

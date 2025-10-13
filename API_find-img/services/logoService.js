const { logoMapping, logoVariants, availableColors, layoutTypes } = require('../config/constants');

class LogoService {
  constructor(r2BaseUrl) {
    this.r2BaseUrl = r2BaseUrl;
  }

  // Determine logo category from chatbot output
  determineLogoCategory(chatbotOutput) {
    const { logo_style, logo_shape, main_products, business_model } = chatbotOutput;

    // Ưu tiên logo_shape nếu có
    if (logo_shape && logo_shape.length > 0) {
      const shape = logo_shape[0].toLowerCase();
      for (const [key, folder] of Object.entries(logoMapping)) {
        if (shape.includes(key)) {
          return folder;
        }
      }
    }

    // Dựa vào main_products
    if (main_products && main_products.length > 0) {
      for (const product of main_products) {
        const productLower = product.toLowerCase();
        for (const [key, folder] of Object.entries(logoMapping)) {
          if (productLower.includes(key)) {
            return folder;
          }
        }
      }
    }

    // Default: Door (phổ biến với nhôm kính)
    return 'Door';
  }

  // Get actual folder name based on category pattern (preserves original case)
  getFolderName(category, index) {
    // Categories with space in subfolder names
    const spaceFolderCategories = ['Abstract geometric'];
    
    if (spaceFolderCategories.includes(category)) {
      return `${category} ${index}`;
    } else {
      // Categories with underscore in subfolder names - use original case prefix
      const prefix = this.getCategoryFolderPrefix(category);
      return `${prefix}_${index}`;
    }
  }

  // Generate logo URLs for original color
  generateLogoUrls(category) {
    const variantCount = logoVariants[category] || 10;
    const logos = [];

    for (let i = 1; i <= variantCount; i++) {
      const prefix = this.getCategoryPrefix(category);
      // Use actual folder structure from R2 (same as local)
      const folderName = this.getFolderName(category, i);
      const fileName = `${prefix.toLowerCase()}_${i}_original.svg`;
      
      // Encode spaces in URL
      const encodedCategory = encodeURIComponent(category);
      const encodedFolder = encodeURIComponent(folderName);
      
      logos.push({
        id: `${category}-${i}`,
        name: folderName,
        url: `${this.r2BaseUrl}/${encodedCategory}/${encodedFolder}/${fileName}`,
        category,
        variant: i,
        color: 'original'
      });
    }

    return logos;
  }

  // Get category prefix for folder naming (preserves case for folder names)
  getCategoryFolderPrefix(category) {
    const prefixMap = {
      'Abstract geometric': 'abstract',
      'Building - Tower': 'Building',
      'Door': 'Door',
      'Gear - mechanism': 'Gear',
      'House': 'House',
      'Lock - security': 'Lock',
      'Rolling door - shutter': 'Roller',
      'Roof': 'Roof',
      'Shield': 'Shield',
      'Window': 'Window'
    };
    return prefixMap[category] || category;
  }

  // Get category prefix for file naming (returns lowercase for filename consistency)
  getCategoryPrefix(category) {
    const prefixMap = {
      'Abstract geometric': 'abstract',
      'Building - Tower': 'building',
      'Door': 'door',
      'Gear - mechanism': 'gear',
      'House': 'house',
      'Lock - security': 'lock',
      'Rolling door - shutter': 'roller',
      'Roof': 'roof',
      'Shield': 'shield',
      'Window': 'window'
    };
    return prefixMap[category] || category.toLowerCase();
  }

  // Generate color variants for selected logo
  generateColorVariants(logoId, category, variant) {
    const colors = [];
    const prefix = this.getCategoryPrefix(category);
    // Use actual folder structure from R2 (same as local)
    const folderName = this.getFolderName(category, variant);
    
    // Encode spaces in URL
    const encodedCategory = encodeURIComponent(category);
    const encodedFolder = encodeURIComponent(folderName);

    for (const color of availableColors) {
      const fileName = `${prefix.toLowerCase()}_${variant}_${color}.svg`;
      colors.push({
        color,
        url: `${this.r2BaseUrl}/${encodedCategory}/${encodedFolder}/${fileName}`,
        logoId,
        category,
        variant
      });
    }

    return colors;
  }

  // Get backgrounds
  getBackgrounds() {
    const backgrounds = [];
    
    // Color backgrounds (9 colors)
    const colorOptions = [
      { name: 'Trắng', value: '#FFFFFF' },
      { name: 'Đen', value: '#000000' },
      { name: 'Xám', value: '#9E9E9E' },
      { name: 'Xanh dương', value: '#2196F3' },
      { name: 'Xanh lá', value: '#4CAF50' },
      { name: 'Đỏ', value: '#F44336' },
      { name: 'Vàng', value: '#FFEB3B' },
      { name: 'Cam', value: '#FF9800' },
      { name: 'Tím', value: '#9C27B0' }
    ];

    colorOptions.forEach((color, index) => {
      backgrounds.push({
        id: `color-${index + 1}`,
        type: 'color',
        name: color.name,
        value: color.value,
        thumbnail: null
      });
    });

    // Image backgrounds (17 images from R2)
    for (let i = 1; i <= 17; i++) {
      backgrounds.push({
        id: `image-${i}`,
        type: 'image',
        name: `Background ${i}`,
        value: `${this.r2BaseUrl}/Background/background_${i}.jpg`,
        thumbnail: `${this.r2BaseUrl}/Background/background_${i}.jpg`
      });
    }

    return backgrounds;
  }

  // Get layouts
  getLayouts() {
    const layouts = [];

    layoutTypes.forEach(type => {
      // Each type has 5 variants
      for (let i = 1; i <= 5; i++) {
        const fileName = `${type.toLowerCase()}_${i}.svg`;
        const thumbFileName = `${type.toLowerCase()}_${i}_thumb.jpg`;
        
        layouts.push({
          id: `${type.toLowerCase()}-${i}`,
          type,
          name: `${type} ${i}`,
          url: `${this.r2BaseUrl}/Layout/${type}/${fileName}`,
          thumbnail: `${this.r2BaseUrl}/Layout/${type}/${thumbFileName}`
        });
      }
    });

    return layouts;
  }
}

module.exports = LogoService;

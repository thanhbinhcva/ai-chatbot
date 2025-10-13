const { v4: uuidv4 } = require('uuid');

class ExportService {
  constructor(r2BaseUrl) {
    this.r2BaseUrl = r2BaseUrl;
  }

  // Generate final JSON output
  generateExportJson(session) {
    const { briefId, chatbotOutput, selections } = session;
    const { logo, color, layout, background, customization } = selections;

    if (!logo || !color || !layout || !background) {
      throw new Error('Incomplete selections. Please complete all steps.');
    }

    const assetsToExport = [{
      layoutId: layout.id,
      outputFileName: `${layout.type.toLowerCase()}_${layout.name.replace(/\s+/g, '_').toLowerCase()}.pdf`,
      format: 'pdf',
      customizations: {
        layoutLink: layout.url,
        brand_name: { 
          text: customization.brandName,
          font: customization.textFont,
          color: customization.textColor
        },
        slogan: {
          text: customization.slogan,
          font: customization.textFont,
          color: customization.textColor
        },
        phone_number: { 
          text: customization.phoneNumber, 
          font: customization.textFont, 
          color: customization.textColor
        },
        location: { 
          text: customization.location,
          font: customization.textFont,
          color: customization.textColor
        },
        color: color.url,
        background: {
          type: background.type,
          value: background.value
        },
        logo: logo.url
      }
    }];

    return {
      briefId,
      sessionId: session.sessionId,
      chatbotOutput: {
        brand_name: chatbotOutput.brand_name_full,
        slogan: chatbotOutput.slogan,
        phone: chatbotOutput.dealer_id,
        location: chatbotOutput.location,
        core_values: chatbotOutput.core_values,
        main_products: chatbotOutput.main_products
      },
      chosenLogoUrl: logo.url,
      chosenColor: color.color,
      chosenLayout: layout,
      chosenBackground: background,
      customization: customization,
      assetsToExport,
      createdAt: session.createdAt,
      completedAt: new Date()
    };
  }

  // Validate export data
  validateExportData(session) {
    const { selections } = session;
    const errors = [];

    if (!selections.logo) {
      errors.push('Logo not selected');
    }
    if (!selections.color) {
      errors.push('Color not selected');
    }
    if (!selections.layout) {
      errors.push('Layout not selected');
    }
    if (!selections.background) {
      errors.push('Background not selected');
    }
    if (!selections.customization) {
      errors.push('Customization not completed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ExportService;

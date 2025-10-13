const SessionService = require('../services/sessionService');
const LogoService = require('../services/logoService');
const ExportService = require('../services/exportService');

class WorkflowController {
  constructor(r2BaseUrl) {
    this.logoService = new LogoService(r2BaseUrl);
    this.exportService = new ExportService(r2BaseUrl);
  }

  // Step 1: Initialize session with chatbot output and get logos
  async initializeSession(req, res) {
    try {
      const chatbotOutput = req.body;

      if (!chatbotOutput || !chatbotOutput.brand_name_full) {
        return res.status(400).json({
          success: false,
          message: 'Invalid chatbot output'
        });
      }

      // Create session
      const session = SessionService.createSession(chatbotOutput);

      // Determine logo category
      const logoCategory = this.logoService.determineLogoCategory(chatbotOutput);
      
      // Get logo options
      const logos = this.logoService.generateLogoUrls(logoCategory);

      return res.status(201).json({
        success: true,
        message: 'Session created successfully',
        data: {
          sessionId: session.sessionId,
          currentStep: 'logo',
          category: logoCategory,
          logos,
          totalLogos: logos.length
        }
      });
    } catch (error) {
      console.error('Initialize session error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize session',
        error: error.message
      });
    }
  }

  // Step 2: Select logo and get color options
  async selectLogo(req, res) {
    try {
      const { sessionId } = req.params;
      const { logoId, category, variant } = req.body;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.currentStep !== 'logo') {
        return res.status(400).json({
          success: false,
          message: `Invalid step. Current step is: ${session.currentStep}`
        });
      }

      // Save logo selection
      const logoUrl = this.logoService.generateLogoUrls(category)
        .find(l => l.id === logoId);

      SessionService.updateSelection(sessionId, 'logo', logoUrl);

      // Get color variants
      const colors = this.logoService.generateColorVariants(logoId, category, variant);

      // Move to next step
      SessionService.moveToNextStep(sessionId, 'logo');

      return res.status(200).json({
        success: true,
        message: 'Logo selected successfully',
        data: {
          sessionId,
          currentStep: 'color',
          selectedLogo: logoUrl,
          colors,
          totalColors: colors.length
        }
      });
    } catch (error) {
      console.error('Select logo error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to select logo',
        error: error.message
      });
    }
  }

  // Step 3: Select color and get layout options
  async selectColor(req, res) {
    try {
      const { sessionId } = req.params;
      const { color, colorUrl } = req.body;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.currentStep !== 'color') {
        return res.status(400).json({
          success: false,
          message: `Invalid step. Current step is: ${session.currentStep}`
        });
      }

      // Save color selection
      SessionService.updateSelection(sessionId, 'color', {
        color,
        url: colorUrl
      });

      // Get layout options (moved from step 4)
      const layouts = this.logoService.getLayouts();

      // Move to next step
      SessionService.moveToNextStep(sessionId, 'color');

      return res.status(200).json({
        success: true,
        message: 'Color selected successfully',
        data: {
          sessionId,
          currentStep: 'layout',
          selectedColor: color,
          layouts,
          totalLayouts: layouts.length
        }
      });
    } catch (error) {
      console.error('Select color error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to select color',
        error: error.message
      });
    }
  }

  // Step 3: Select layout and get background options (swapped position)
  async selectLayout(req, res) {
    try {
      const { sessionId } = req.params;
      const { layoutId } = req.body;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.currentStep !== 'layout') {
        return res.status(400).json({
          success: false,
          message: `Invalid step. Current step is: ${session.currentStep}`
        });
      }

      if (!layoutId) {
        return res.status(400).json({
          success: false,
          message: 'Layout must be selected'
        });
      }

      // Get full layout object
      const allLayouts = this.logoService.getLayouts();
      const selectedLayout = allLayouts.find(l => l.id === layoutId);

      if (!selectedLayout) {
        return res.status(400).json({
          success: false,
          message: 'Invalid layout ID'
        });
      }

      // Save layout selection
      SessionService.updateSelection(sessionId, 'layout', selectedLayout);

      // Get background options (moved from step 3)
      const backgrounds = this.logoService.getBackgrounds();

      // Move to next step
      SessionService.moveToNextStep(sessionId, 'layout');

      return res.status(200).json({
        success: true,
        message: 'Layout selected successfully',
        data: {
          sessionId,
          currentStep: 'background',
          selectedLayout,
          backgrounds,
          totalBackgrounds: backgrounds.length
        }
      });
    } catch (error) {
      console.error('Select layout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to select layout',
        error: error.message
      });
    }
  }

  // Step 4: Select background and move to customization
  async selectBackground(req, res) {
    try {
      const { sessionId } = req.params;
      const { backgroundId, type, value } = req.body;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.currentStep !== 'background') {
        return res.status(400).json({
          success: false,
          message: `Invalid step. Current step is: ${session.currentStep}`
        });
      }

      // Save background selection
      SessionService.updateSelection(sessionId, 'background', {
        id: backgroundId,
        type,
        value
      });

      // Move to next step (customization)
      SessionService.moveToNextStep(sessionId, 'background');

      return res.status(200).json({
        success: true,
        message: 'Background selected successfully',
        data: {
          sessionId,
          currentStep: 'customization',
          selectedBackground: { id: backgroundId, type, value },
          currentCustomization: session.selections.customization
        }
      });
    } catch (error) {
      console.error('Select background error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to select background',
        error: error.message
      });
    }
  }

  // Step 5: Customize text, colors, and content
  async customizeContent(req, res) {
    try {
      const { sessionId } = req.params;
      const { 
        brandName, 
        slogan, 
        phoneNumber, 
        location, 
        textColor, 
        textFont 
      } = req.body;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.currentStep !== 'customization') {
        return res.status(400).json({
          success: false,
          message: `Invalid step. Current step is: ${session.currentStep}`
        });
      }

      // Update customization
      const customization = {
        brandName: brandName !== undefined ? brandName : session.selections.customization.brandName,
        slogan: slogan !== undefined ? slogan : session.selections.customization.slogan,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : session.selections.customization.phoneNumber,
        location: location !== undefined ? location : session.selections.customization.location,
        textColor: textColor || session.selections.customization.textColor,
        textFont: textFont || session.selections.customization.textFont
      };

      SessionService.updateSelection(sessionId, 'customization', customization);

      return res.status(200).json({
        success: true,
        message: 'Customization updated successfully',
        data: {
          sessionId,
          currentStep: 'customization',
          customization,
          canExport: true
        }
      });
    } catch (error) {
      console.error('Customize content error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to customize content',
        error: error.message
      });
    }
  }

  // Step 6: Generate final export JSON
  async finalizeExport(req, res) {
    try {
      const { sessionId } = req.params;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.currentStep !== 'customization') {
        return res.status(400).json({
          success: false,
          message: 'Please complete customization step first'
        });
      }

      // Validate all selections
      const validation = this.exportService.validateExportData(session);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Incomplete selections',
          errors: validation.errors
        });
      }

      // Generate final export JSON
      const exportJson = this.exportService.generateExportJson(session);

      return res.status(200).json({
        success: true,
        message: 'Workflow completed successfully',
        data: exportJson
      });
    } catch (error) {
      console.error('Finalize export error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to complete workflow',
        error: error.message
      });
    }
  }

  // Get session status
  async getSessionStatus(req, res) {
    try {
      const { sessionId } = req.params;

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          sessionId: session.sessionId,
          currentStep: session.currentStep,
          selections: session.selections,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        }
      });
    } catch (error) {
      console.error('Get session status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get session status',
        error: error.message
      });
    }
  }

  // Reset session to a specific step
  async resetStep(req, res) {
    try {
      const { sessionId } = req.params;
      const { step } = req.body;

      const validSteps = ['logo', 'color', 'layout', 'background', 'customization'];
      if (!validSteps.includes(step)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid step. Valid steps: logo, color, layout, background, customization'
        });
      }

      const session = SessionService.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Reset selections from the specified step onwards
      const stepIndex = validSteps.indexOf(step);
      const stepsToReset = validSteps.slice(stepIndex);
      
      stepsToReset.forEach(s => {
        if (s === 'customization') {
          // Keep default customization values
          session.selections[s] = {
            brandName: session.chatbotOutput.brand_name_full || '',
            slogan: session.chatbotOutput.slogan || '',
            phoneNumber: session.chatbotOutput.dealer_id || '',
            location: session.chatbotOutput.location || '',
            textColor: '#000000',
            textFont: 'Roboto Bold'
          };
        } else {
          session.selections[s] = null;
        }
      });

      SessionService.updateSession(sessionId, {
        currentStep: step,
        selections: session.selections
      });

      return res.status(200).json({
        success: true,
        message: `Session reset to ${step} step`,
        data: {
          sessionId,
          currentStep: step,
          selections: session.selections
        }
      });
    } catch (error) {
      console.error('Reset step error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reset step',
        error: error.message
      });
    }
  }
}

module.exports = WorkflowController;

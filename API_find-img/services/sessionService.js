const { v4: uuidv4 } = require('uuid');

// In-memory storage for sessions (in production, use Redis or Database)
const sessions = new Map();

class SessionService {
  // Tạo session mới từ chatbot output
  static createSession(chatbotOutput) {
    const sessionId = chatbotOutput.session_id || uuidv4();
    
    const session = {
      sessionId,
      briefId: uuidv4(),
      chatbotOutput,
      currentStep: 'logo', // logo -> color -> layout -> background -> customization
      selections: {
        logo: null,
        color: null,
        layout: null,
        background: null,
        customization: {
          brandName: chatbotOutput.brand_name_full || '',
          slogan: chatbotOutput.slogan || '',
          phoneNumber: chatbotOutput.dealer_id || '',
          location: chatbotOutput.location || '',
          textColor: '#000000',
          textFont: 'Roboto Bold'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    sessions.set(sessionId, session);
    return session;
  }

  // Lấy session
  static getSession(sessionId) {
    return sessions.get(sessionId);
  }

  // Update session
  static updateSession(sessionId, updates) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    Object.assign(session, updates, { updatedAt: new Date() });
    sessions.set(sessionId, session);
    return session;
  }

  // Update selection
  static updateSelection(sessionId, step, value) {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.selections[step] = value;
    session.updatedAt = new Date();
    sessions.set(sessionId, session);
    return session;
  }

  // Move to next step
  static moveToNextStep(sessionId, currentStep) {
    const steps = ['logo', 'color', 'layout', 'background', 'customization'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      return null;
    }

    const nextStep = steps[currentIndex + 1];
    return this.updateSession(sessionId, { currentStep: nextStep });
  }

  // Delete session
  static deleteSession(sessionId) {
    return sessions.delete(sessionId);
  }

  // Get all sessions (for debugging)
  static getAllSessions() {
    return Array.from(sessions.values());
  }
}

module.exports = SessionService;

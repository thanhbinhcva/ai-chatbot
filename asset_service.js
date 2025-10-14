/**
 * Asset Service - RESTful API với Express.js
 * Quản lý Logo Assets (Emblems, Layouts, Backgrounds)
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ============================================
// MOCK DATA - Dữ liệu theo ERD
// ============================================

// Session Status Tracking (theo dõi bước của người dùng)
// Các bước: emblem_selection -> variant_selection -> layout_category_selection -> layout_selection -> background_selection -> completed
const sessionStatus = {
  'session-001': {
    session_id: 'session-001',
    current_step: 'emblem_selection',
    selected_emblem_id: null,
    selected_variant_id: null,
    selected_layout_category_id: null,
    selected_layout_id: null,
    selected_background_id: null,
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

// Asset Table (emblem, layout, background)
const assets = [
  { uid: 'A001', type: 'emblem' },
  { uid: 'A002', type: 'emblem' },
  { uid: 'A003', type: 'emblem' },
  { uid: 'A004', type: 'layout' },
  { uid: 'A005', type: 'layout' },
  { uid: 'A006', type: 'layout' },
  { uid: 'A007', type: 'layout' },
  { uid: 'A008', type: 'layout' },
  { uid: 'A009', type: 'layout' },
  { uid: 'A010', type: 'background' },
  { uid: 'A011', type: 'background' }
];

// Category Table
const categories = [
  { uid: 'C001', asset_id: 'A001', name: 'door' },
  { uid: 'C002', asset_id: 'A002', name: 'windows' },
  { uid: 'C003', asset_id: 'A003', name: 'houses' },
  { uid: 'C101', asset_id: 'A004', name: 'Avatar' },
  { uid: 'C102', asset_id: 'A005', name: 'Billboard' },
  { uid: 'C103', asset_id: 'A006', name: 'Business Card' },
  { uid: 'C104', asset_id: 'A007', name: 'Poster' },
  { uid: 'C105', asset_id: 'A008', name: 'Social Media' },
  { uid: 'C106', asset_id: 'A009', name: 'Brochure' },
  { uid: 'C201', asset_id: 'A010', name: 'background' },
  { uid: 'C202', asset_id: 'A011', name: 'background' }
];

// Emblem Table
const emblems = [
  { 
    uid: 'E001', 
    category_id: 'C001', 
    url: 'https://assert-service.com/emblems/door.png', 
    name: 'Door Icon' 
  },
  { 
    uid: 'E002', 
    category_id: 'C002', 
    url: 'https://assert-service.com/emblems/windows.png', 
    name: 'Windows Icon' 
  },
  { 
    uid: 'E003', 
    category_id: 'C003', 
    url: 'https://assert-service.com/emblems/houses.png', 
    name: 'Houses Icon' 
  }
];

// Variant Table (màu sắc của emblem)
const variants = [
  { 
    uid: 'V001', 
    emblem_id: 'E001', 
    url: 'https://assert-service.com/variants/E001_blue.png', 
    name: 'blue' 
  },
  { 
    uid: 'V002', 
    emblem_id: 'E001', 
    url: 'https://assert-service.com/variants/E001_red.png', 
    name: 'red' 
  },
  { 
    uid: 'V003', 
    emblem_id: 'E001', 
    url: 'https://assert-service.com/variants/E001_green.png', 
    name: 'green' 
  },
  { 
    uid: 'V004', 
    emblem_id: 'E002', 
    url: 'https://assert-service.com/variants/E002_blue.png', 
    name: 'blue' 
  },
  { 
    uid: 'V005', 
    emblem_id: 'E002', 
    url: 'https://assert-service.com/variants/E002_yellow.png', 
    name: 'yellow' 
  },
  { 
    uid: 'V006', 
    emblem_id: 'E003', 
    url: 'https://assert-service.com/variants/E003_brown.png', 
    name: 'brown' 
  },
  { 
    uid: 'V007', 
    emblem_id: 'E003', 
    url: 'https://assert-service.com/variants/E003_gray.png', 
    name: 'gray' 
  }
];

// Layout Table
const layouts = [
  { 
    uid: 'L201', 
    category_id: 'C101', 
    url: 'https://assert-service.com/layouts/avatar_1.svg',
    details: {
      text_position: '0,0',
      logo_size: '50x50',
      element_count: 3
    }
  },
  { 
    uid: 'L202', 
    category_id: 'C101', 
    url: 'https://assert-service.com/layouts/avatar_2.svg',
    details: {
      text_position: '10,10',
      logo_size: '60x60',
      element_count: 2
    }
  },
  { 
    uid: 'L203', 
    category_id: 'C102', 
    url: 'https://assert-service.com/layouts/billboard_1.svg',
    details: {
      text_position: '100,50',
      logo_size: '200x200',
      element_count: 5
    }
  },
  { 
    uid: 'L204', 
    category_id: 'C103', 
    url: 'https://assert-service.com/layouts/business_card_1.svg',
    details: {
      text_position: '20,30',
      logo_size: '40x40',
      element_count: 4
    }
  },
  { 
    uid: 'L205', 
    category_id: 'C104', 
    url: 'https://assert-service.com/layouts/poster_1.svg',
    details: {
      text_position: '150,100',
      logo_size: '180x180',
      element_count: 6
    }
  },
  { 
    uid: 'L206', 
    category_id: 'C105', 
    url: 'https://assert-service.com/layouts/social_media_1.svg',
    details: {
      text_position: '50,50',
      logo_size: '80x80',
      element_count: 3
    }
  }
];

// Background Table
const backgrounds = [
  { 
    uid: 'B301', 
    category_id: 'C201', 
    url: 'https://assert-service.com/backgrounds/pattern_1.png' 
  },
  { 
    uid: 'B302', 
    category_id: 'C201', 
    url: 'https://assert-service.com/backgrounds/gradient_2.jpg' 
  },
  { 
    uid: 'B303', 
    category_id: 'C202', 
    url: 'https://assert-service.com/backgrounds/solid_3.png' 
  },
  { 
    uid: 'B304', 
    category_id: 'C202', 
    url: 'https://assert-service.com/backgrounds/texture_4.jpg' 
  }
];

// Context Input (Tham khảo - không sử dụng trong API)
const contextInput = {
  session_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  dealer_id: 'D12345',
  brand_name_full: 'Công ty TNHH ABC',
  location: {
    number: '123',
    street: 'Nguyễn Huệ',
    ward: 'Bến Nghé',
    city: 'Hồ Chí Minh'
  },
  main_services: ['Thiết kế Logo', 'Branding', 'Marketing'],
  product_portfolio: [
    { 'tên': 'Logo Design', 'tỷ trọng': '40%' },
    { 'tên': 'Branding', 'tỷ trọng': '35%' },
    { 'tên': 'Marketing', 'tỷ trọng': '25%' }
  ],
  target_customers: ['SME', 'Startup', 'Enterprise'],
  competitive_advantage: ['Chất lượng cao', 'Giá cạnh tranh', 'Giao hàng nhanh'],
  core_values: ['Chuyên nghiệp', 'Sáng tạo', 'Tận tâm'],
  slogan: 'Your Brand, Our Passion',
  future_vision: ['Trở thành công ty thiết kế hàng đầu Việt Nam'],
  logo_style: ['Modern', 'Minimalist', 'Professional'],
  main_color: ['#0066CC', '#FF6600', '#00CC66'],
  revenue: ['> 1 tỷ/năm']
};

// ============================================
// API ROUTES
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Asset Service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * API: Khởi tạo Session mới
 * POST /api/v1/logo/session/init
 */
app.post('/api/v1/logo/session/init', (req, res) => {
  try {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    sessionStatus[sessionId] = {
      session_id: sessionId,
      current_step: 'emblem_selection',
      selected_emblem_id: null,
      selected_variant_id: null,
      selected_layout_category_id: null,
      selected_layout_id: null,
      selected_background_id: null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      session_id: sessionId,
      status: sessionStatus[sessionId]
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API: Lấy trạng thái Session
 * GET /api/v1/logo/session/status?sessionId={id}
 */
app.get('/api/v1/logo/session/status', (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'sessionId query parameter is required' 
      });
    }

    const session = sessionStatus[sessionId];
    if (!session) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: `Session with ID ${sessionId} not found` 
      });
    }

    res.json({
      success: true,
      status: session
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API: Cập nhật trạng thái Session
 * PUT /api/v1/logo/session/update
 */
app.put('/api/v1/logo/session/update', (req, res) => {
  try {
    const { 
      sessionId, 
      emblemId, 
      variantId, 
      layoutCategoryId, 
      layoutId, 
      backgroundId 
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'sessionId is required' 
      });
    }

    const session = sessionStatus[sessionId];
    if (!session) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: `Session with ID ${sessionId} not found` 
      });
    }

    // Cập nhật các giá trị và xác định bước hiện tại
    if (emblemId) {
      session.selected_emblem_id = emblemId;
      session.current_step = 'variant_selection';
    }
    if (variantId) {
      session.selected_variant_id = variantId;
      session.current_step = 'layout_category_selection';
    }
    if (layoutCategoryId) {
      session.selected_layout_category_id = layoutCategoryId;
      session.current_step = 'layout_selection';
    }
    if (layoutId) {
      session.selected_layout_id = layoutId;
      session.current_step = 'background_selection';
    }
    if (backgroundId) {
      session.selected_background_id = backgroundId;
      session.current_step = 'completed';
      session.completed = true;
    }

    session.updated_at = new Date().toISOString();

    res.json({
      success: true,
      status: session
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API 1: Lấy danh sách Biểu tượng (Emblems)
 * GET /api/v1/logo/emblem/search
 * Query params: sessionId (optional) - để track status
 */
app.get('/api/v1/logo/emblem/search', (req, res) => {
  try {
    const { sessionId } = req.query;
    
    // Lấy tất cả emblems và join với category để lấy category name
    const results = emblems.map(emblem => {
      const category = categories.find(c => c.uid === emblem.category_id);
      return {
        uid: emblem.uid,
        type: 'emblem',
        category: category ? category.name : 'unknown',
        url: emblem.url
      };
    });

    const response = { results };
    
    // Thêm thông tin status nếu có sessionId
    if (sessionId && sessionStatus[sessionId]) {
      response.session_status = {
        current_step: sessionStatus[sessionId].current_step,
        expected_step: 'emblem_selection'
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API 2: Lấy danh sách Màu của Biểu tượng
 * GET /api/v1/logo/emblem/variant/search?emblemId=E001&sessionId={id}
 */
app.get('/api/v1/logo/emblem/variant/search', (req, res) => {
  try {
    const { emblemId, sessionId } = req.query;

    if (!emblemId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'emblemId query parameter is required' 
      });
    }

    // Kiểm tra emblem có tồn tại không
    const emblem = emblems.find(e => e.uid === emblemId);
    if (!emblem) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: `Emblem with ID ${emblemId} not found` 
      });
    }

    // Lấy tất cả variants của emblem này
    const emblemVariants = variants.filter(v => v.emblem_id === emblemId);

    const results = emblemVariants.map(variant => ({
      variantID: variant.uid,
      url: variant.url,
      name: variant.name
    }));

    const response = {
      emblemId,
      results
    };

    // Thêm thông tin status nếu có sessionId
    if (sessionId && sessionStatus[sessionId]) {
      response.session_status = {
        current_step: sessionStatus[sessionId].current_step,
        expected_step: 'variant_selection'
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API 3: Lấy danh sách Danh mục Layout
 * GET /api/v1/logo/layout/category?sessionId={id}
 */
app.get('/api/v1/logo/layout/category', (req, res) => {
  try {
    const { sessionId } = req.query;
    
    // Lấy các category của layout (loại bỏ duplicate)
    const layoutAssets = assets.filter(a => a.type === 'layout');
    const layoutCategories = categories
      .filter(c => layoutAssets.some(a => a.uid === c.asset_id))
      .map(c => ({
        categoryID: c.uid,
        categoryName: c.name
      }));

    // Loại bỏ duplicate category names
    const uniqueCategories = layoutCategories.filter((cat, index, self) =>
      index === self.findIndex(c => c.categoryName === cat.categoryName)
    );

    const response = { results: uniqueCategories };

    // Thêm thông tin status nếu có sessionId
    if (sessionId && sessionStatus[sessionId]) {
      response.session_status = {
        current_step: sessionStatus[sessionId].current_step,
        expected_step: 'layout_category_selection'
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API 4: Lấy danh sách Layout trong một Danh mục
 * GET /api/v1/logo/layout/search?categoryID=C101&sessionId={id}
 */
app.get('/api/v1/logo/layout/search', (req, res) => {
  try {
    const { categoryID, sessionId } = req.query;

    if (!categoryID) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'categoryID query parameter is required' 
      });
    }

    // Kiểm tra category có tồn tại không
    const category = categories.find(c => c.uid === categoryID);
    if (!category) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: `Category with ID ${categoryID} not found` 
      });
    }

    // Lấy tất cả layouts trong category này
    const categoryLayouts = layouts.filter(l => l.category_id === categoryID);

    const results = categoryLayouts.map(layout => ({
      layoutID: layout.uid,
      layoutURL: layout.url,
      components: layout.details
    }));

    const response = {
      categoryID,
      categoryName: category.name,
      results
    };

    // Thêm thông tin status nếu có sessionId
    if (sessionId && sessionStatus[sessionId]) {
      response.session_status = {
        current_step: sessionStatus[sessionId].current_step,
        expected_step: 'layout_selection'
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * API 5: Lấy danh sách Background sẵn có
 * GET /api/v1/logo/background/search?sessionId={id}
 */
app.get('/api/v1/logo/background/search', (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const results = backgrounds.map(bg => ({
      backgroundID: bg.uid,
      backgroundURL: bg.url
    }));

    const response = { results };

    // Thêm thông tin status nếu có sessionId
    if (sessionId && sessionStatus[sessionId]) {
      response.session_status = {
        current_step: sessionStatus[sessionId].current_step,
        expected_step: 'background_selection'
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      'GET /health',
      'POST /api/v1/logo/session/init',
      'GET /api/v1/logo/session/status?sessionId={id}',
      'PUT /api/v1/logo/session/update',
      'GET /api/v1/logo/emblem/search',
      'GET /api/v1/logo/emblem/variant/search?emblemId={id}',
      'GET /api/v1/logo/layout/category',
      'GET /api/v1/logo/layout/search?categoryID={id}',
      'GET /api/v1/logo/background/search'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Asset Service is running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n📚 Session Management:`);
  console.log(`   POST /api/v1/logo/session/init`);
  console.log(`   GET  /api/v1/logo/session/status?sessionId={id}`);
  console.log(`   PUT  /api/v1/logo/session/update`);
  console.log(`\n📚 Asset Endpoints:`);
  console.log(`   GET /api/v1/logo/emblem/search`);
  console.log(`   GET /api/v1/logo/emblem/variant/search?emblemId={id}`);
  console.log(`   GET /api/v1/logo/layout/category`);
  console.log(`   GET /api/v1/logo/layout/search?categoryID={id}`);
  console.log(`   GET /api/v1/logo/background/search`);
});

module.exports = app;

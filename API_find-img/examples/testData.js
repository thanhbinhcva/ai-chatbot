// Example test data for the API
const chatbotOutput = {
  "session_id": "62e3f3d3",
  "dealer_id": "0986899001",
  "brand_name_full": "Nhôm kính An Phát",
  "location": "212 Quang Trung, Hà Đông, Hà Nội",
  "business_model": "Vừa sản xuất vừa thương mại",
  "main_products": [
    "cửa nhôm",
    "cửa kính",
    "vách ngăn",
    "cửa cuốn",
    "phụ kiện"
  ],
  "main_services": [],
  "product_portfolio": [
    "cửa nhôm",
    "cửa kính",
    "vách ngăn",
    "cửa cuốn",
    "phụ kiện"
  ],
  "target_customers": [
    "hộ gia đình",
    "chủ thầu xây dựng",
    "dự án lớn"
  ],
  "competitive_advantage": [
    "tay nghề thợ cao",
    "sản phẩm chất lượng",
    "giá thành cạnh tranh"
  ],
  "core_values": [
    "Uy tín",
    "Chất lượng",
    "Tận tâm"
  ],
  "slogan": "An Phát – Uy Tín Kiến Tạo, Chất Lượng Dẫn Đầu.",
  "future_vision": [
    "Uy tín kiến tạo",
    "Chất lượng dẫn đầu"
  ],
  "logo_style": [
    "Hiện đại (Modern Geometric)"
  ],
  "main_color": [
    "xanh dương"
  ],
  "revenue": "200 triệu đồng/tháng",
  "logo_shape": [
    "cách điệu từ tên thương hiệu An Phát"
  ]
};

// Test scenarios
const testScenarios = {
  // Scenario 1: Door category (based on "cửa nhôm", "cửa kính")
  door: {
    chatbot: chatbotOutput,
    expectedCategory: "Door",
    logoSelection: {
      logoId: "Door-1",
      category: "Door",
      variant: 1
    },
    colorSelection: {
      color: "blue",
      colorUrl: "https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/image-logo/Door/Door_1/door_1_blue.svg"
    },
    backgroundSelection: {
      backgroundId: "color-1",
      type: "color",
      value: "#FFFFFF"
    },
    layoutSelection: {
      layouts: ["Avt-1", "Card-1", "Billboard-1"]
    }
  },

  // Scenario 2: Gear category (for mechanism products)
  gear: {
    chatbot: {
      ...chatbotOutput,
      main_products: ["cơ khí", "thiết bị công nghiệp"],
      logo_shape: ["bánh răng"]
    },
    expectedCategory: "Gear - mechanism",
    logoSelection: {
      logoId: "Gear - mechanism-5",
      category: "Gear - mechanism",
      variant: 5
    },
    colorSelection: {
      color: "gold",
      colorUrl: "https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/image-logo/Gear - mechanism/Gear_5/gear_5_gold.svg"
    },
    backgroundSelection: {
      backgroundId: "image-5",
      type: "image",
      value: "https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/Background/bg_5.jpg"
    },
    layoutSelection: {
      layouts: ["Cover-1"]
    }
  },

  // Scenario 3: Shield category (for security products)
  shield: {
    chatbot: {
      ...chatbotOutput,
      main_products: ["an ninh", "bảo vệ", "khóa cửa"],
      logo_shape: ["lá chắn"]
    },
    expectedCategory: "Shield",
    logoSelection: {
      logoId: "Shield-3",
      category: "Shield",
      variant: 3
    },
    colorSelection: {
      color: "red",
      colorUrl: "https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/image-logo/Shield/Shield_3/shield_3_red.svg"
    },
    backgroundSelection: {
      backgroundId: "color-5",
      type: "color",
      value: "#1976D2"
    },
    layoutSelection: {
      layouts: ["Avt-1", "Card-2"]
    }
  }
};

module.exports = {
  chatbotOutput,
  testScenarios
};

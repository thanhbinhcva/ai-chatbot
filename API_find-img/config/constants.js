// Mapping từ chatbot output sang folder tương ứng
const logoMapping = {
  'abstract geometric': 'Abstract geometric',
  'building': 'Building - Tower',
  'tower': 'Building - Tower',
  'door': 'Door',
  'cửa': 'Door',
  'gear': 'Gear - mechanism',
  'mechanism': 'Gear - mechanism',
  'house': 'House',
  'nhà': 'House',
  'lock': 'Lock - security',
  'security': 'Lock - security',
  'khóa': 'Lock - security',
  'rolling door': 'Rolling door - shutter',
  'shutter': 'Rolling door - shutter',
  'cửa cuốn': 'Rolling door - shutter',
  'roof': 'Roof',
  'mái': 'Roof',
  'shield': 'Shield',
  'khiên': 'Shield',
  'window': 'Window',
  'cửa sổ': 'Window',
};

// Số lượng logo variants cho mỗi category
const logoVariants = {
  'Abstract geometric': 10,
  'Building - Tower': 10,
  'Door': 10,
  'Gear - mechanism': 10,
  'House': 10,
  'Lock - security': 10,
  'Rolling door - shutter': 10,
  'Roof': 10,
  'Shield': 10,
  'Window': 13, // Window có 13 variants
};

// Màu sắc available (8 colors - based on actual R2 files)
const availableColors = [
  'blue',
  'brown',
  'gold',
  'green',
  'purple',
  'red',
  'silver',
  'yellow'
];

// Mapping màu từ tiếng Việt sang tiếng Anh
const colorMapping = {
  'xanh dương': 'blue',
  'xanh': 'blue',
  'nâu': 'brown',
  'vàng kim': 'gold',
  'vàng': 'yellow',
  'xanh lá': 'green',
  'xám': 'grey',
  'cam': 'orange',
  'đỏ': 'red',
  'trắng': 'white',
  'blue': 'blue',
  'brown': 'brown',
  'gold': 'gold',
  'green': 'green',
  'grey': 'grey',
  'orange': 'orange',
  'red': 'red',
  'white': 'white',
  'yellow': 'yellow'
};

// Layout types
const layoutTypes = [
  'Avatar',
  'Billboard',
  'Card',
  'Cover'
];

module.exports = {
  logoMapping,
  logoVariants,
  availableColors,
  colorMapping,
  layoutTypes
};

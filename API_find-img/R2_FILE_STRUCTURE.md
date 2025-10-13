# 📁 R2 File Structure Mapping

Tài liệu này mô tả cấu trúc file thực tế trên Cloudflare R2 Storage.

## 🎯 Base URL
```
https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev
```

## 📂 Layout Files

### ✅ Đã verify trên R2:

#### Avatar (Shortened: Avt)
```
/Layout/Avatar/Avt-1.svg  ✅
/Layout/Avatar/Avt-2.svg  ✅
/Layout/Avatar/Avt-3.svg  ✅
/Layout/Avatar/Avt-4.svg  ✅
/Layout/Avatar/Avt-5.svg  ✅
```
**Pattern:** `Avt-{number}.svg` (NOT `avatar-{number}`)

#### Billboard (Full name)
```
/Layout/Billboard/Billboard-1.svg  ✅
/Layout/Billboard/Billboard-2.svg  ✅
/Layout/Billboard/Billboard-3.svg  ✅
/Layout/Billboard/Billboard-4.svg  ✅
/Layout/Billboard/Billboard-5.svg  ✅
```
**Pattern:** `Billboard-{number}.svg`

#### Card (Chưa có trên R2)
```
/Layout/Card/Card-1.svg  ❌ (planned)
/Layout/Card/Card-2.svg  ❌ (planned)
/Layout/Card/Card-3.svg  ❌ (planned)
/Layout/Card/Card-4.svg  ❌ (planned)
/Layout/Card/Card-5.svg  ❌ (planned)
```
**Pattern:** `Card-{number}.svg`

#### Cover (Chưa có trên R2)
```
/Layout/Cover/Cover-1.svg  ❌ (planned)
/Layout/Cover/Cover-2.svg  ❌ (planned)
/Layout/Cover/Cover-3.svg  ❌ (planned)
/Layout/Cover/Cover-4.svg  ❌ (planned)
/Layout/Cover/Cover-5.svg  ❌ (planned)
```
**Pattern:** `Cover-{number}.svg`

## 📊 Logo Files

### Pattern Structure:
```
/{Category}/{FolderName}/{filename}.svg
```

### Categories với folder patterns:

#### Door
```
/Door/Door_1/door_1_original.svg
/Door/Door_1/door_1_blue.svg
/Door/Door_1/door_1_brown.svg
... (8 colors per variant)
/Door/Door_10/door_10_original.svg
```
**Folder Pattern:** `Door_{number}`
**File Pattern:** `door_{number}_{color}.svg`

#### House
```
/House/House_1/house_1_original.svg
/House/House_1/house_1_blue.svg
...
/House/House_10/house_10_yellow.svg
```
**Folder Pattern:** `House_{number}`
**File Pattern:** `house_{number}_{color}.svg`

#### Building - Tower
```
/Building - Tower/Building_1/building_1_original.svg
/Building - Tower/Building_1/building_1_blue.svg
...
/Building - Tower/Building_10/building_10_yellow.svg
```
**Folder Pattern:** `Building_{number}`
**File Pattern:** `building_{number}_{color}.svg`

#### Window
```
/Window/Window_1/window_1_original.svg
...
/Window/Window_13/window_13_yellow.svg
```
**Note:** Window có 13 variants (không phải 10)
**Folder Pattern:** `Window_{number}`
**File Pattern:** `window_{number}_{color}.svg`

#### Roof
```
/Roof/Roof_1/roof_1_original.svg
...
/Roof/Roof_10/roof_10_yellow.svg
```
**Folder Pattern:** `Roof_{number}`
**File Pattern:** `roof_{number}_{color}.svg`

#### Lock - security
```
/Lock - security/Lock_1/lock_1_original.svg
...
/Lock - security/Lock_10/lock_10_yellow.svg
```
**Folder Pattern:** `Lock_{number}`
**File Pattern:** `lock_{number}_{color}.svg`

#### Shield
```
/Shield/Shield_1/shield_1_original.svg
...
/Shield/Shield_10/shield_10_yellow.svg
```
**Folder Pattern:** `Shield_{number}`
**File Pattern:** `shield_{number}_{color}.svg`

#### Gear - mechanism
```
/Gear - mechanism/Gear_1/gear_1_original.svg
...
/Gear - mechanism/Gear_10/gear_10_yellow.svg
```
**Folder Pattern:** `Gear_{number}`
**File Pattern:** `gear_{number}_{color}.svg`

#### Rolling door - shutter
```
/Rolling door - shutter/Roller_1/roller_1_original.svg
...
/Rolling door - shutter/Roller_10/roller_10_yellow.svg
```
**Folder Pattern:** `Roller_{number}`
**File Pattern:** `roller_{number}_{color}.svg`

#### Abstract geometric
```
/Abstract geometric/abstract 1/abstract_1_original.svg
...
/Abstract geometric/abstract 10/abstract_10_yellow.svg
```
**Note:** Folder name có space: `abstract {number}` (không phải underscore)
**Folder Pattern:** `abstract {number}`
**File Pattern:** `abstract_{number}_{color}.svg`

## 🎨 Available Colors
```
- blue
- brown
- gold
- green
- purple
- red
- silver
- yellow
- original (màu gốc)
```

## 🖼️ Background Files

### Color Backgrounds (9 màu):
- Trắng (#FFFFFF)
- Đen (#000000)
- Xám (#9E9E9E)
- Xanh dương (#2196F3)
- Xanh lá (#4CAF50)
- Đỏ (#F44336)
- Vàng (#FFEB3B)
- Cam (#FF9800)
- Tím (#9C27B0)

### Image Backgrounds (17 images):
```
/Background/background_1.jpg
/Background/background_2.jpg
...
/Background/background_17.jpg
```

## 🔧 API Mapping

### Layout IDs in API:
```javascript
// ĐÚNG (theo file thực tế trên R2):
"Avt-1", "Avt-2", "Avt-3", "Avt-4", "Avt-5"
"Billboard-1", "Billboard-2", ..., "Billboard-5"
"Card-1", "Card-2", ..., "Card-5"     // Chưa có file
"Cover-1", "Cover-2", ..., "Cover-5"   // Chưa có file

// SAI (không match với R2):
"avatar-1"  ❌ (lowercase, tên file thực tế là Avt-1)
"avt-1"     ❌ (lowercase A)
"Avatar-1"  ❌ (full name, tên file thực tế đã shortened)
```

## ⚠️ Lưu ý quan trọng

1. **Avatar được shorten thành Avt** trong tên file
2. **Billboard, Card, Cover** giữ nguyên tên đầy đủ
3. **Logo folder names** dùng underscore: `Door_1`, `House_1`
4. **Abstract geometric folder** dùng space: `abstract 1`, `abstract 2`
5. **File names** luôn lowercase: `door_1_blue.svg`, `avt-1.svg`
6. **Layout file names** có dash và uppercase: `Avt-1.svg`, `Billboard-1.svg`
7. **Window category** có 13 variants (khác biệt với các category khác có 10)

## 📝 Code Implementation

Xem file `/services/logoService.js` method `getLayoutFilePrefix()` để biết cách code map các tên này.

---

**Last Updated:** October 13, 2025
**Verified against:** Cloudflare R2 Production Storage

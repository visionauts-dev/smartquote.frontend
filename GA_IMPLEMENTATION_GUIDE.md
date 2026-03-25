# GA Processing Flow - Implementation Guide

## 🎯 Summary

I've successfully implemented a complete React TypeScript frontend flow for handling **GA (General Arrangement) processing** within your project-based quotation system. The implementation includes a 5-tab workflow with PDF viewing, item detection review, product mapping, fabrication cost calculation, and quote generation.

---

## 📁 File Structure Created

### **1. Types & API**
- **[src/types/api.types.ts](src/types/api.types.ts)** - Extended with GA, Detection, Product Selection, Fabrication, and Quote types
- **[src/services/api/gasApi.ts](src/services/api/gasApi.ts)** - Updated with full GA processing endpoints

### **2. State Management** 
- **[src/redux/slices/gaSlice.ts](src/redux/slices/gaSlice.ts)** - Redux slice for managing entire GA workflow state
  - Detection results, edited items, selected products, fabrication data, quote data
  - Tab navigation and save progress tracking
- **[src/redux/store.ts](src/redux/store.ts)** - Updated to include gaReducer

### **3. Components**

#### **Main Workspace**
- **[src/components/ga/GAWorkspace.tsx](src/components/ga/GAWorkspace.tsx)** - Main layout with:
  - Split-screen: PDF viewer (left) + Tabs (right)
  - Tab navigation with completion indicators
  - Access control based on saved steps

#### **Upload & Viewer**
- **[src/components/ga/AddGAModal.tsx](src/components/ga/AddGAModal.tsx)** - PDF upload modal
  - File validation (PDF only, <50MB)
  - Upload progress indicator
  - Auto-redirect to workspace after upload
  
- **[src/components/ga/PDFViewer.tsx](src/components/ga/PDFViewer.tsx)** - PDF viewer with:
  - Zoom in/out (Ctrl+Scroll or ±buttons)
  - Pan/drag functionality
  - Reset view button

#### **Tab Components**
- **[src/components/ga/tabs/DetectionTable.tsx](src/components/ga/tabs/DetectionTable.tsx)**
  - Editable table for detected items
  - Add/edit/delete items
  - Re-run detection button
  - Inline dimension editing (W, H, D)

- **[src/components/ga/tabs/ProductSelector.tsx](src/components/ga/tabs/ProductSelector.tsx)**
  - Map detection items to products
  - Dynamic product list per category
  - Quantity adjustment
  - Cost preview per selection

- **[src/components/ga/tabs/FabricationPanel.tsx](src/components/ga/tabs/FabricationPanel.tsx)**
  - Material selection (6 materials with density/cost data)
  - Thickness input
  - Dimension editing
  - Real-time weight & cost calculation
  - Cost breakdown (material + 30% fabrication)

- **[src/components/ga/tabs/QuoteBuilder.tsx](src/components/ga/tabs/QuoteBuilder.tsx)**
  - Editable quote line items
  - Add/remove/edit products
  - Price customization
  - Discount & tax inputs
  - Grand total calculation

- **[src/components/ga/tabs/ExportPanel.tsx](src/components/ga/tabs/ExportPanel.tsx)**
  - Quote summary display
  - Export to PDF/Word/Excel
  - File download handling
  - Export history tracking

- **[src/components/ga/index.ts](src/components/ga/index.ts)** - Component exports

### **4. Pages**
- **[src/pages/ga/GAWorkspacePage.tsx](src/pages/ga/GAWorkspacePage.tsx)** - Workspace page wrapper
- **[src/pages/project/ProjectDetailPage.tsx](src/pages/project/ProjectDetailPage.tsx)** - Updated to use AddGAModal

### **5. Routing**
- **[src/App.tsx](src/App.tsx)** - Added route: `/project/:projectId/ga/:gaId/workspace`

---

## 🚀 User Flow

### **Entry Point: Project Detail Screen**
1. User navigates to project detail
2. Sees list of GAs below project info
3. Clicks **"+ Add GA"** button

### **Step 1: Upload Flow**
1. AddGAModal opens
2. User enters GA name (e.g., "GA-001")
3. Selects PDF file (with validation)
4. Upload progress shown
5. Auto-navigates to workspace on success

### **Step 2: GA Workspace (Main Processing)**

#### **Tab 1: 🔍 Detection**
- View auto-detected items from PDF
- Edit category, count, dimensions
- Add items manually
- Re-run detection if needed
- **Save** → Updates GA status to REVIEWED

#### **Tab 2: 📦 Product Selection**
- Map each detected item to actual product
- View product details (price, specs)
- Adjust quantities
- See total cost breakdown
- **Save** → Updates status to PRODUCT_SELECTED

#### **Tab 3: 🔧 Fabrication**
- Select material (6 options: Steel, SS304, SS316, Aluminum, Brass, Copper)
- Set thickness and dimensions
- View automatic weight calculation
- See cost breakdown:
  - Material cost = weight × ₹/kg
  - Fabrication = 30% markup
  - Total cost
- **Save** → Updates status to PRICED

#### **Tab 4: 💰 Quote Builder**
- Combined quote from products + fabrication
- Edit product names, quantities, unit prices
- Add custom line items
- Apply discount
- Apply tax (GST)
- See grand total
- **Save** → Updates status to QUOTED

#### **Tab 5: 📤 Export**
- Quote summary view
- Download options:
  - **PDF** - Professional quote format
  - **Word** - Editable document
  - **Excel** - Spreadsheet with calculations
- Shows download history

---

## 🔌 API Integration

### **Endpoints Used**
```typescript
// Upload
POST /api/detection/upload (multipart/form-data)

// Detection
GET  /api/detection/results/{gaId}
POST /api/detection/save
POST /api/detection/rerun/{gaId}

// GA Management
GET    /api/Projects/{projectId}/GAs
GET    /api/Projects/{projectId}/GAs/{gaId}
PUT    /api/Projects/{projectId}/GAs/{gaId}

// Processing
POST /api/ga/product-selection
POST /api/ga/fabrication
POST /api/ga/quote
POST /api/ga/export
GET  {export_url} (file download)

// Products
GET  /api/products (with category filtering)
```

---

## 🧠 State Management

### **Redux Store Structure**
```typescript
ga: {
  currentGA: GADto | null
  detectionResults: DetectionItem[]
  editedDetectionItems: DetectionItem[]
  selectedProducts: ProductSelection[]
  fabricationData: FabricationData[]
  quoteData: QuoteLineItem[]
  quoteMetadata: {
    subtotal, discount, tax, grandTotal
  }
  
  // UI
  activeTab: 'detection' | 'product' | 'fabrication' | 'quote' | 'export'
  isLoading: boolean
  error: string | null
  savedSteps: {
    detection, product, fabrication, quote
  }
}
```

### **Key Actions**
- Tab navigation: `setActiveTab()`
- Detection: `setDetectionResults()`, `updateDetectionItem()`, `addDetectionItem()`, etc.
- Save progress: `markDetectionAsSaved()`, `markProductSelectionAsSaved()`, etc.
- Quote: `setQuoteData()`, `updateQuoteMetadata()`

---

## ✨ Key Features

### **1. Validation**
- PDF file validation (type & size)
- Product selection required before continuing
- Prevents moving forward without saving previous step

### **2. Real-time Calculations**
- Weight: `(W × H × Thickness) × Density`
- Material cost: `Weight × Cost/kg`
- Fabrication cost: `Material × 0.30`
- Quote totals: `Subtotal - Discount + Tax`

### **3. User Experience**
- Tab-based workflow (no stepper complexity)
- Save progress indicators (✓ on tabs)
- Access control (disabled tabs until previous saved)
- Inline editing (no modal dialogs)
- Real-time cost updates
- Upload progress bar

### **4. Data Persistence**
- All changes saved to Redux
- API sync on "Save & Continue"
- Can switch tabs without losing data
- GA status tracks workflow completion

---

## 🎨 Material Density & Costs Reference

| Material | Density (g/cm³) | Cost/kg |
|----------|-----------------|---------|
| Mild Steel | 7.85 | ₹50 |
| SS 304 | 8.0 | ₹120 |
| SS 316 | 8.0 | ₹150 |
| Aluminum | 2.7 | ₹200 |
| Brass | 8.5 | ₹400 |
| Copper | 8.96 | ₹500 |

*(Editable in FabricationPanel.tsx)*

---

## 📋 Integration Checklist

- [x] Add GA types to api.types.ts
- [x] Create gaSlice Redux state
- [x] Update store.ts with gaReducer
- [x] Create all 5 tab components
- [x] Create AddGAModal for upload
- [x] Create PDFViewer component
- [x] Create GAWorkspace main layout
- [x] Create GAWorkspacePage
- [x] Add route to App.tsx
- [x] Update ProjectDetailPage with AddGAModal
- [x] Add grid click handler to navigate

---

## 🔌 Backend API Requirements

### **Expected Responses**

**GA Upload Response:**
```json
{
  "id": 123,
  "projectId": 45,
  "gaName": "GA-001",
  "pdfUrl": "https://...",
  "status": "processing",
  "createdDate": "2026-03-23T10:00:00Z"
}
```

**Detection Results:**
```json
{
  "gaId": 123,
  "items": [
    {
      "id": "item-1",
      "category": "Panel",
      "count": 5,
      "width": 1000,
      "height": 800,
      "depth": 100,
      "unit": "mm"
    }
  ],
  "detectionScore": 0.95
}
```

**Export Response:**
```json
{
  "url": "https://storage/quote-123.pdf",
  "fileName": "quote-ABC-001.pdf"
}
```

---

## 🚀 Future Enhancements

1. **Batch GA Processing** - Upload multiple GAs at once
2. **Template System** - Save standard GA configurations
3. **Comparison View** - Compare multiple quote versions
4. **Collaboration** - Comments/approvals on GAs
5. **History Tracking** - View all changes to a GA
6. **Integration with CRM** - Link to customer data
7. **Automated Pricing** - Rules engine for pricing
8. **Mobile App** - React Native version

---

## 📝 Notes

- All components use controlled state via Redux
- Loading states handled on every API call
- Error messages displayed inline
- Tab access controlled by `savedSteps` object
- Material costs/density easily customizable
- Fabrication markup hardcoded at 30% (can be parameterized)

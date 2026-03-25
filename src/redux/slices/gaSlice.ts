/**
 * GA (General Arrangement) Redux Slice
 * Manages GA processing workflow state
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GADto, DetectionItem, ProductSelection, FabricationData, GAQuoteLineItem } from '../../types/api.types';

export interface GAWorkflowState {
  currentGA: GADto | null;
  detectionResults: DetectionItem[];
  editedDetectionItems: DetectionItem[];
  selectedProducts: ProductSelection[];
  fabricationData: FabricationData[];
  quoteData: GAQuoteLineItem[];
  quoteMetadata: {
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
  };
  
  // UI State
  isLoading: boolean;
  error: string | null;
  activeTab: 'detection' | 'product' | 'fabrication' | 'quote' | 'export';
  savedSteps: {
    detection: boolean;
    product: boolean;
    fabrication: boolean;
    quote: boolean;
  };
}

const initialState: GAWorkflowState = {
  currentGA: null,
  detectionResults: [],
  editedDetectionItems: [],
  selectedProducts: [],
  fabricationData: [],
  quoteData: [],
  quoteMetadata: {
    subtotal: 0,
    discount: 0,
    tax: 0,
    grandTotal: 0,
  },
  isLoading: false,
  error: null,
  activeTab: 'detection',
  savedSteps: {
    detection: false,
    product: false,
    fabrication: false,
    quote: false,
  },
};

const gaSlice = createSlice({
  name: 'ga',
  initialState,
  reducers: {
    // GA Management
    setCurrentGA: (state, action: PayloadAction<GADto>) => {
      state.currentGA = action.payload;
    },

    clearCurrentGA: (state) => {
      state.currentGA = null;
      state.detectionResults = [];
      state.editedDetectionItems = [];
      state.selectedProducts = [];
      state.fabricationData = [];
      state.quoteData = [];
      state.activeTab = 'detection';
      state.savedSteps = {
        detection: false,
        product: false,
        fabrication: false,
        quote: false,
      };
    },

    // Detection Tab
    setDetectionResults: (state, action: PayloadAction<DetectionItem[]>) => {
      state.detectionResults = action.payload;
      state.editedDetectionItems = JSON.parse(JSON.stringify(action.payload));
    },

    updateDetectionItem: (
      state,
      action: PayloadAction<{ index: number; item: DetectionItem }>
    ) => {
      if (state.editedDetectionItems[action.payload.index]) {
        state.editedDetectionItems[action.payload.index] = action.payload.item;
      }
    },

    addDetectionItem: (state, action: PayloadAction<DetectionItem>) => {
      state.editedDetectionItems.push(action.payload);
    },

    removeDetectionItem: (state, action: PayloadAction<number>) => {
      state.editedDetectionItems.splice(action.payload, 1);
    },

    markDetectionAsSaved: (state) => {
      state.detectionResults = JSON.parse(JSON.stringify(state.editedDetectionItems));
      state.savedSteps.detection = true;
    },

    // Product Selection Tab
    setSelectedProducts: (state, action: PayloadAction<ProductSelection[]>) => {
      state.selectedProducts = action.payload;
    },

    updateProductSelection: (
      state,
      action: PayloadAction<{ index: number; selection: ProductSelection }>
    ) => {
      if (state.selectedProducts[action.payload.index]) {
        state.selectedProducts[action.payload.index] = action.payload.selection;
      }
    },

    addProductSelection: (state, action: PayloadAction<ProductSelection>) => {
      state.selectedProducts.push(action.payload);
    },

    removeProductSelection: (state, action: PayloadAction<number>) => {
      state.selectedProducts.splice(action.payload, 1);
    },

    markProductSelectionAsSaved: (state) => {
      state.savedSteps.product = true;
    },

    // Fabrication Tab
    setFabricationData: (state, action: PayloadAction<FabricationData[]>) => {
      state.fabricationData = action.payload;
    },

    updateFabricationDataItem: (
      state,
      action: PayloadAction<{ index: number; data: FabricationData }>
    ) => {
      if (state.fabricationData[action.payload.index]) {
        state.fabricationData[action.payload.index] = action.payload.data;
      }
    },

    markFabricationAsSaved: (state) => {
      state.savedSteps.fabrication = true;
    },

    // Quote Tab
    setQuoteData: (state, action: PayloadAction<GAQuoteLineItem[]>) => {
      state.quoteData = action.payload;
    },

    updateQuoteLineItem: (
      state,
      action: PayloadAction<{ index: number; item: GAQuoteLineItem }>
    ) => {
      if (state.quoteData[action.payload.index]) {
        state.quoteData[action.payload.index] = action.payload.item;
      }
    },

    addQuoteLineItem: (state, action: PayloadAction<GAQuoteLineItem>) => {
      state.quoteData.push(action.payload);
    },

    removeQuoteLineItem: (state, action: PayloadAction<number>) => {
      state.quoteData.splice(action.payload, 1);
    },

    updateQuoteMetadata: (
      state,
      action: PayloadAction<{
        subtotal?: number;
        discount?: number;
        tax?: number;
        grandTotal?: number;
      }>
    ) => {
      if (action.payload.subtotal !== undefined) {
        state.quoteMetadata.subtotal = action.payload.subtotal;
      }
      if (action.payload.discount !== undefined) {
        state.quoteMetadata.discount = action.payload.discount;
      }
      if (action.payload.tax !== undefined) {
        state.quoteMetadata.tax = action.payload.tax;
      }
      if (action.payload.grandTotal !== undefined) {
        state.quoteMetadata.grandTotal = action.payload.grandTotal;
      }
    },

    markQuoteAsSaved: (state) => {
      state.savedSteps.quote = true;
    },

    // Tab Navigation
    setActiveTab: (
      state,
      action: PayloadAction<'detection' | 'product' | 'fabrication' | 'quote' | 'export'>
    ) => {
      state.activeTab = action.payload;
    },

    // Loading & Error
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentGA,
  clearCurrentGA,
  setDetectionResults,
  updateDetectionItem,
  addDetectionItem,
  removeDetectionItem,
  markDetectionAsSaved,
  setSelectedProducts,
  updateProductSelection,
  addProductSelection,
  removeProductSelection,
  markProductSelectionAsSaved,
  setFabricationData,
  updateFabricationDataItem,
  markFabricationAsSaved,
  setQuoteData,
  updateQuoteLineItem,
  addQuoteLineItem,
  removeQuoteLineItem,
  updateQuoteMetadata,
  markQuoteAsSaved,
  setActiveTab,
  setIsLoading,
  setError,
} = gaSlice.actions;

export default gaSlice.reducer;

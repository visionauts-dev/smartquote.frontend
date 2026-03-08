/**
 * Redux Templates Slice
 * Manages quote templates
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { QuoteTemplate } from '../../types/template.types';

export interface TemplatesState {
  items: QuoteTemplate[];
  selectedTemplateId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TemplatesState = {
  items: [],
  selectedTemplateId: null,
  isLoading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      return [] as QuoteTemplate[];
    } catch (e) {
      return rejectWithValue('Failed to fetch templates');
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (
    payload: Omit<QuoteTemplate, 'id' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue }
  ) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      const now = new Date().toISOString();
      return { ...payload, id: `t-${Date.now()}`, createdAt: now, updatedAt: now } as QuoteTemplate;
    } catch (e) {
      return rejectWithValue('Failed to create template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 200));
      return id;
    } catch (e) {
      return rejectWithValue('Failed to delete template');
    }
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setSelectedTemplateId: (state, action: PayloadAction<string | null>) => {
      state.selectedTemplateId = action.payload;
    },
    addTemplateLocal: (state, action: PayloadAction<QuoteTemplate>) => {
      state.items = [action.payload, ...state.items];
    },
    removeTemplateLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.selectedTemplateId === action.payload) state.selectedTemplateId = null;
    },
    clearTemplatesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch templates';
      });
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      state.items = [action.payload, ...state.items];
      state.selectedTemplateId = action.payload.id;
    });
    builder.addCase(deleteTemplate.fulfilled, (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.selectedTemplateId === action.payload) state.selectedTemplateId = null;
    });
  },
});

export const {
  setSelectedTemplateId,
  addTemplateLocal,
  removeTemplateLocal,
  clearTemplatesError,
} = templatesSlice.actions;
export default templatesSlice.reducer;

/**
 * Redux Quotes Slice
 * Manages quotes list, current quote, and form state
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Quote, QuoteStatus } from '../../types/quote.types';

export interface QuotesState {
  items: Quote[];
  currentQuote: Quote | null;
  selectedQuoteId: string | null;
  filterStatus: QuoteStatus | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuotesState = {
  items: [],
  currentQuote: null,
  selectedQuoteId: null,
  filterStatus: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

// Async thunks (mock for now - can wire to API later)
export const fetchQuotes = createAsyncThunk(
  'quotes/fetchQuotes',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data - replace with API call
      await new Promise((r) => setTimeout(r, 300));
      return [] as Quote[];
    } catch (e) {
      return rejectWithValue('Failed to fetch quotes');
    }
  }
);

export const fetchQuoteById = createAsyncThunk(
  'quotes/fetchQuoteById',
  async (_id: string, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 200));
      return null as Quote | null;
    } catch (e) {
      return rejectWithValue('Failed to fetch quote');
    }
  }
);

export const createQuote = createAsyncThunk(
  'quotes/createQuote',
  async (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      const now = new Date().toISOString();
      return {
        ...quote,
        id: `q-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      } as Quote;
    } catch (e) {
      return rejectWithValue('Failed to create quote');
    }
  }
);

export const updateQuote = createAsyncThunk(
  'quotes/updateQuote',
  async (
    { id, ...payload }: Partial<Quote> & { id: string },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      return { id, ...payload, updatedAt: new Date().toISOString() } as Quote;
    } catch (e) {
      return rejectWithValue('Failed to update quote');
    }
  }
);

export const deleteQuote = createAsyncThunk(
  'quotes/deleteQuote',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 200));
      return id;
    } catch (e) {
      return rejectWithValue('Failed to delete quote');
    }
  }
);

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    setCurrentQuote: (state, action: PayloadAction<Quote | null>) => {
      state.currentQuote = action.payload;
      state.selectedQuoteId = action.payload?.id ?? null;
    },
    setSelectedQuoteId: (state, action: PayloadAction<string | null>) => {
      state.selectedQuoteId = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<QuoteStatus | null>) => {
      state.filterStatus = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearQuoteSelection: (state) => {
      state.currentQuote = null;
      state.selectedQuoteId = null;
    },
    clearQuotesError: (state) => {
      state.error = null;
    },
    addQuoteLocal: (state, action: PayloadAction<Quote>) => {
      state.items = [action.payload, ...state.items];
    },
    updateQuoteLocal: (state, action: PayloadAction<Quote>) => {
      const i = state.items.findIndex((q) => q.id === action.payload.id);
      if (i !== -1) state.items[i] = action.payload;
      if (state.currentQuote?.id === action.payload.id) {
        state.currentQuote = action.payload;
      }
    },
    removeQuoteLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((q) => q.id !== action.payload);
      if (state.currentQuote?.id === action.payload) {
        state.currentQuote = null;
        state.selectedQuoteId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch quotes';
      });

    builder
      .addCase(fetchQuoteById.fulfilled, (state, action) => {
        state.currentQuote = action.payload;
        state.selectedQuoteId = action.payload?.id ?? null;
      });

    builder
      .addCase(createQuote.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.currentQuote = action.payload;
        state.selectedQuoteId = action.payload.id;
      });

    builder
      .addCase(updateQuote.fulfilled, (state, action) => {
        const q = action.payload;
        const i = state.items.findIndex((x) => x.id === q.id);
        if (i !== -1) state.items[i] = { ...state.items[i], ...q };
        if (state.currentQuote?.id === q.id) {
          state.currentQuote = { ...state.currentQuote, ...q };
        }
      });

    builder
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.items = state.items.filter((q) => q.id !== action.payload);
        if (state.currentQuote?.id === action.payload) {
          state.currentQuote = null;
          state.selectedQuoteId = null;
        }
      });
  },
});

export const {
  setCurrentQuote,
  setSelectedQuoteId,
  setFilterStatus,
  setSearchQuery,
  clearQuoteSelection,
  clearQuotesError,
  addQuoteLocal,
  updateQuoteLocal,
  removeQuoteLocal,
} = quotesSlice.actions;
export default quotesSlice.reducer;

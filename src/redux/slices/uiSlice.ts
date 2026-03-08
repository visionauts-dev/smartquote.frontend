/**
 * Redux UI Slice
 * Sidebar, modals, toasts, etc.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalId = 'createQuote' | 'editQuote' | 'deleteQuote' | 'createTemplate' | 'confirmDelete' | null;

export interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalId;
  modalPayload: Record<string, unknown> | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModal: null,
  modalPayload: null,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<{ id: ModalId; payload?: Record<string, unknown> }>) => {
      state.activeModal = action.payload.id;
      state.modalPayload = action.payload.payload ?? null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalPayload = null;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>
    ) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showToast,
  clearToast,
} = uiSlice.actions;
export default uiSlice.reducer;

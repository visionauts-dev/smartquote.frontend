/**
 * Quote domain types
 */

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quote {
  id: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  status: QuoteStatus;
  totalAmount: number;
  currency: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  lineItems: QuoteLineItem[];
  notes?: string;
  templateId?: string;
}

export interface QuoteFormState {
  title: string;
  clientName: string;
  clientEmail: string;
  status: QuoteStatus;
  validUntil: string;
  lineItems: QuoteLineItem[];
  notes: string;
  templateId: string;
}

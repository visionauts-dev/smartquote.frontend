/**
 * Template domain types
 */

import type { QuoteLineItem } from './quote.types';

export interface QuoteTemplate {
  id: string;
  name: string;
  description?: string;
  lineItems: QuoteLineItem[];
  createdAt: string;
  updatedAt: string;
}

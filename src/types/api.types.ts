/**
 * Type definitions for all API DTOs and requests/responses
 * Generated from OpenAPI 3.1.1 specification
 */

import type { QuoteLineItem } from "./quote.types";

// ==================== Addon Types ====================
export interface CreateAddonDto {
  addonName: string;
  price: number | string;
}

export interface UpdateAddonDto {
  addonName: string;
  price: number | string;
}

export interface AddonDto extends CreateAddonDto {
  id: number;
}

// ==================== Category Types ====================
export interface CreateCategoryDto {
  categoryName: string;
}

export interface UpdateCategoryDto {
  categoryName: string;
}

export interface CategoryDto extends CreateCategoryDto {
  id: number;
}

// ==================== Subcategory Types ====================
export interface CreateSubcategoryDto {
  categoryId: number;
  subcategoryName: string;
}

export interface UpdateSubcategoryDto {
  categoryId: number;
  subcategoryName: string;
}

export interface SubcategoryDto extends CreateSubcategoryDto {
  id: number;
}

// ==================== Product Types ====================
export interface CreateProductDto {
  vendorId: number;
  subcategoryId: number;
  vendorCatNo?: string | null;
  model?: string | null;
  mrp: number | string;
  stdPkg?: number | null;
  addOns: boolean;
  description?: string | null;
  attributes?: string | null;
}

export interface UpdateProductDto {
  vendorId: number;
  subcategoryId: number;
  vendorCatNo?: string | null;
  model?: string | null;
  mrp: number | string;
  stdPkg?: number | null;
  addOns: boolean;
  description?: string | null;
  attributes?: string | null;
}

export interface ProductDto extends CreateProductDto {
  id: number;
  vendor?: string | null;
  category?: string | null;
  subcategory?: string | null;
}

// ==================== Vendor Types ====================
export interface CreateVendorDto {
  vendorName: string;
}

export interface UpdateVendorDto {
  vendorName: string;
}

export interface VendorDto extends CreateVendorDto {
  id: number;
}

// ==================== User Types ====================
export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  isActive?: boolean;
}

// ==================== GA (General Arrangement) Types ====================
export type GAStatus = 'uploaded' | 'processing' | 'reviewed' | 'product_selected' | 'priced' | 'quoted' | 'completed' | 'failed';

export interface CreateGADto {
  projectId: number;
  gaName: string;
  pdfUrl?: string;
}

export interface UpdateGADto {
  gaName?: string;
  status?: GAStatus;
}

export interface GADto extends CreateGADto {
  id: number;
  projectId: number;
  status: GAStatus;
  createdDate: string;
  updatedDate: string;
}

// ==================== Detection Types ====================
export interface DetectionItem {
  id?: string;
  category: string;
  count: number;
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
}

export interface DetectionResult {
  gaId: number;
  items: DetectionItem[];
  detectionScore?: number;
  processedDate?: string;
}

export interface SaveDetectionDto {
  gaId: number;
  items: DetectionItem[];
}

// ==================== Product Selection Types ====================
export interface ProductSelection {
  detectionItemId?: string;
  productId: number;
  count: number;
  productName?: string;
  price?: number;
}

export interface SaveProductSelectionDto {
  gaId: number;
  selections: ProductSelection[];
}

// ==================== Fabrication Types ====================
export interface FabricationData {
  detectionItemId?: string;
  gaId: number;
  material: string;
  thickness: number;
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  materialCost?: number;
  fabricationCost?: number;
  totalCost?: number;
}

export interface SaveFabricationDto {
  gaId: number;
  items: FabricationData[];
}

// ==================== Quote Types ====================
export interface GAQuoteLineItem {
  id?: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteData {
  gaId: number;
  lineItems: QuoteLineItem[];
  subtotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
}

export interface SaveQuoteDto {
  gaId: number;
  lineItems: QuoteLineItem[];
  subtotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
}

export interface ExportQuoteDto {
  gaId: number;
  format: 'pdf' | 'word' | 'excel';
}

export interface ExportResponse {
  url: string;
  fileName: string;
}

export interface UpdateUserDto {
  fullName: string;
  email: string;
  isActive?: boolean;
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  isActive?: boolean;
}

// ==================== Organization Types ====================
export interface CreateOrganizationDto {
  name: string;
  isActive?: boolean;
}

export interface UpdateOrganizationDto {
  name: string;
  isActive?: boolean;
}

export interface OrganizationDto extends CreateOrganizationDto {
  id: string;
}

// ==================== Organization User Types ====================
export interface CreateOrganizationUserDto {
  organizationId: string;
  userId: string;
  role: string;
}

export interface UpdateOrganizationUserDto {
  role: string;
}

export interface OrganizationUserDto {
  organizationId: string;
  userId: string;
  role: string;
}

// ==================== Organization Product Discount Types ====================
export interface CreateOrganizationProductDiscountDto {
  organizationId: string;
  productId: number;
  discountPercent: number | string;
}

export interface UpdateOrganizationProductDiscountDto {
  discountPercent: number | string;
}

export interface OrganizationProductDiscountDto extends CreateOrganizationProductDiscountDto {
  id: number;
}

// ==================== Auth Types ====================
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

// ==================== Weather Forecast Types ====================
export interface WeatherForecast {
  date: string; // ISO 8601 date format
  temperatureC: number;
  temperatureF: number;
  summary?: string | null;
}

// ==================== Project Types ====================
export interface CreateProjectDto {
  projectName: string;
  description: string;
  clientName: string;
  clientEmail: string;
  phoneNumber: string;
  address: string;
  enquiryDate: string; // ISO 8601 date format
}

export interface UpdateProjectDto {
  projectName: string;
  description: string;
  clientName: string;
  clientEmail: string;
  phoneNumber: string;
  address: string;
  enquiryDate: string;
}

export interface ProjectDto extends CreateProjectDto {
  id: number;
}

// ==================== Generic API Response Types ====================
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Type definitions for all API DTOs and requests/responses
 * Generated from OpenAPI 3.1.1 specification
 */

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

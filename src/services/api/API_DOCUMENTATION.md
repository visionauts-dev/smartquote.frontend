# SmartQuote API Services Documentation

This document provides a comprehensive guide for using the SmartQuote API services.

## Overview

The API services are organized by resource type, making it easy to locate and use the endpoints you need. All services follow a consistent pattern for CRUD operations.

## API Services

### Authentication Service (`authApi`)

Handle user authentication and session management.

```typescript
import { authApi } from '@/services/api';

// Login
const loginResponse = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
await authApi.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

// Logout
await authApi.logout();
```

### Addons Service (`addonsApi`)

Manage product addons.

```typescript
import { addonsApi } from '@/services/api';

// Get all addons
const addons = await addonsApi.getAll();

// Get addon by ID
const addon = await addonsApi.getById(1);

// Create addon
const newAddon = await addonsApi.create({
  addonName: 'Premium Support',
  price: 99.99
});

// Update addon
const updated = await addonsApi.update(1, {
  addonName: 'Premium Support',
  price: 129.99
});

// Delete addon
await addonsApi.delete(1);
```

### Categories Service (`categoriesApi`)

Manage product categories.

```typescript
import { categoriesApi } from '@/services/api';

// Get all categories
const categories = await categoriesApi.getAll();

// Get category by ID
const category = await categoriesApi.getById(1);

// Create category
const newCategory = await categoriesApi.create({
  categoryName: 'Electronics'
});

// Update category
const updated = await categoriesApi.update(1, {
  categoryName: 'Updated Electronics'
});

// Delete category
await categoriesApi.delete(1);
```

### Subcategories Service (`subcategoriesApi`)

Manage product subcategories.

```typescript
import { subcategoriesApi } from '@/services/api';

// Get all subcategories
const subcategories = await subcategoriesApi.getAll();

// Get subcategory by ID
const subcategory = await subcategoriesApi.getById(1);

// Create subcategory
const newSubcategory = await subcategoriesApi.create({
  categoryId: 1,
  subcategoryName: 'Laptops'
});

// Update subcategory
const updated = await subcategoriesApi.update(1, {
  categoryId: 1,
  subcategoryName: 'Updated Laptops'
});

// Delete subcategory
await subcategoriesApi.delete(1);
```

### Products Service (`productsApi`)

Manage products.

```typescript
import { productsApi } from '@/services/api';

// Get all products
const products = await productsApi.getAll();

// Get product by ID
const product = await productsApi.getById(1);

// Create product
const newProduct = await productsApi.create({
  vendorId: 1,
  subcategoryId: 1,
  vendorCatNo: 'VENDOR-001',
  model: 'Model X',
  mrp: 999.99,
  stdPkg: 10,
  addOns: true,
  description: 'Premium product',
  attributes: 'color:black,size:large'
});

// Update product
const updated = await productsApi.update(1, {
  vendorId: 1,
  subcategoryId: 1,
  vendorCatNo: 'VENDOR-002',
  model: 'Model Y',
  mrp: 1099.99,
  stdPkg: 15,
  addOns: true,
  description: 'Updated product',
  attributes: 'color:silver,size:xlarge'
});

// Delete product
await productsApi.delete(1);
```

### Vendors Service (`vendorsApi`)

Manage vendors/suppliers.

```typescript
import { vendorsApi } from '@/services/api';

// Get all vendors
const vendors = await vendorsApi.getAll();

// Get vendor by ID
const vendor = await vendorsApi.getById(1);

// Create vendor
const newVendor = await vendorsApi.create({
  vendorName: 'Tech Supplier Inc'
});

// Update vendor
const updated = await vendorsApi.update(1, {
  vendorName: 'Updated Tech Supplier'
});

// Delete vendor
await vendorsApi.delete(1);
```

### Users Service (`usersApi`)

Manage system users.

```typescript
import { usersApi } from '@/services/api';

// Get all users
const users = await usersApi.getAll();

// Get user by ID
const user = await usersApi.getById('user-uuid');

// Create user
const newUser = await usersApi.create({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  isActive: true
});

// Update user
const updated = await usersApi.update('user-uuid', {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  isActive: true
});

// Delete user
await usersApi.delete('user-uuid');
```

### Organizations Service (`organizationsApi`)

Manage organizations.

```typescript
import { organizationsApi } from '@/services/api';

// Get all organizations
const organizations = await organizationsApi.getAll();

// Get organization by ID
const organization = await organizationsApi.getById('org-uuid');

// Create organization
const newOrg = await organizationsApi.create({
  name: 'Acme Corporation',
  isActive: true
});

// Update organization
const updated = await organizationsApi.update('org-uuid', {
  name: 'Updated Acme Corporation',
  isActive: true
});

// Delete organization
await organizationsApi.delete('org-uuid');
```

### Organization Users Service (`organizationUsersApi`)

Manage organization memberships and roles.

```typescript
import { organizationUsersApi } from '@/services/api';

// Get organization user
const orgUser = await organizationUsersApi.getById('org-uuid', 'user-uuid');

// Create organization user
const newOrgUser = await organizationUsersApi.create({
  organizationId: 'org-uuid',
  userId: 'user-uuid',
  role: 'Admin'
});

// Update organization user role
const updated = await organizationUsersApi.update('org-uuid', 'user-uuid', {
  role: 'Manager'
});

// Delete organization user
await organizationUsersApi.delete('org-uuid', 'user-uuid');
```

### Organization Product Discounts Service (`organizationProductDiscountsApi`)

Manage organization-specific product discounts.

```typescript
import { organizationProductDiscountsApi } from '@/services/api';

// Get all discounts
const discounts = await organizationProductDiscountsApi.getAll();

// Get discount by ID
const discount = await organizationProductDiscountsApi.getById(1);

// Create discount
const newDiscount = await organizationProductDiscountsApi.create({
  organizationId: 'org-uuid',
  productId: 1,
  discountPercent: 15
});

// Update discount
const updated = await organizationProductDiscountsApi.update(1, {
  discountPercent: 20
});

// Delete discount
await organizationProductDiscountsApi.delete(1);
```

### Weather Service (`weatherApi`)

Get weather forecast data.

```typescript
import { weatherApi } from '@/services/api';

// Get weather forecast
const forecast = await weatherApi.getWeatherForecast();
console.log(forecast); // Array of WeatherForecast objects
```

## Error Handling

All API calls may throw errors. It's recommended to wrap them in try-catch blocks:

```typescript
try {
  const addon = await addonsApi.getById(1);
  console.log(addon);
} catch (error) {
  console.error('Failed to fetch addon:', error);
  // Handle error appropriately
}
```

## Authentication

The API client automatically includes the authentication token in the Authorization header. The token is managed through:

```typescript
import { setAuthToken, getAuthToken, restoreAuthToken, apiClient } from '@/services/api';

// Set token after login
setAuthToken('your_jwt_token_here');

// Get current token
const token = getAuthToken();

// Restore token from localStorage (usually done on app initialization)
restoreAuthToken();
```

## Type Definitions

All request and response types are properly typed. Import them from the types module:

```typescript
import type {
  CreateAddonDto,
  UpdateAddonDto,
  AddonDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryDto,
  CreateProductDto,
  UpdateProductDto,
  ProductDto,
  // ... and many more
} from '@/types/api';
```

## Configuration

The API base URL is configured in the environment variables:

```
VITE_API_BASE_URL=http://localhost:5213
```

If not specified, it defaults to `http://localhost:5213`.

## Request/Response Interception

The API client includes automatic request and response interceptors:

- **Request Interceptor**: Adds the Authorization header with the JWT token
- **Response Interceptor**: Handles 401 errors by clearing the token and redirecting to login

## Tips and Best Practices

1. **Always use TypeScript types** for better type safety
2. **Wrap API calls in try-catch** blocks for proper error handling
3. **Use the service index** (`import * from '@/services/api'`) for convenient importing
4. **Authentication token** is automatically managed - just use `setAuthToken()` after login
5. **Consistent naming patterns** - all services follow the same CRUD pattern

## Service Organization

```
src/services/api/
├── index.ts                    # Main export file
├── apiClient.ts               # Axios client configuration
├── authApi.ts                 # Authentication service
├── addonsApi.ts               # Addons service
├── categoriesApi.ts           # Categories service
├── subcategoriesApi.ts        # Subcategories service
├── productsApi.ts             # Products service
├── vendorsApi.ts              # Vendors service
├── usersApi.ts                # Users service
├── organizationsApi.ts        # Organizations service
├── weatherApi.ts              # Weather service
└── ... (other services)
```

## Support

For issues or questions about the API, please refer to the OpenAPI specification or contact the development team.

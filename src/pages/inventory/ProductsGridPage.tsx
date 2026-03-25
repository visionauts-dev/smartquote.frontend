/**
 * Products Grid Page
 * Display all products in a table with filtering, sorting, and CRUD operations
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Grid, type GridRowData, type GridProps } from '../../components/grid/Grid';
import type { ProductDto } from '../../types/api.types';
import { productsApi } from '../../services/api/productsApi';
import { AttributesDisplay } from '../../components/products/AttributesDisplay';

const ProductsGridPage: React.FC = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.getAll();
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Client-side search + sort
  const products = useMemo(() => {
    let result = [...allProducts];

    // Search: filter across key text fields
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.vendor?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.subcategory?.toLowerCase().includes(term) ||
          p.vendorCatNo?.toLowerCase().includes(term) ||
          p.model?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        let aVal: any = (a as any)[sortColumn] ?? '';
        let bVal: any = (b as any)[sortColumn] ?? '';

        // Numeric sort for mrp
        if (sortColumn === 'mrp') {
          aVal = Number(aVal);
          bVal = Number(bVal);
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // String sort
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [allProducts, searchTerm, sortColumn, sortDirection]);

  // Handle sort: asc → desc → none
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Handle create - navigate to create page
  const handleCreate = () => {
    navigate('/products/create');
  };

  // Handle edit - navigate to edit page with product data
  const handleEdit = (product: ProductDto) => {
    navigate(`/products/${product.id}/edit`, { state: { product } });
  };

  // Handle double-click on row - same as edit
  const handleRowDoubleClick = (product: ProductDto) => {
    navigate(`/products/${product.id}/edit`, { state: { product } });
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        setAllProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Grid columns configuration
  const columns: GridProps['columns'] = [
    { id: 'vendor', label: 'Vendor Name', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'subcategory', label: 'Subcategory', sortable: true },
    { id: 'vendorCatNo', label: 'Cat No', sortable: true },
    { id: 'model', label: 'Model', sortable: true },
    { id: 'mrp', label: 'MRP', sortable: true },
    { id: 'attributes', label: 'Attributes', sortable: false },
    { id: 'action', label: 'Actions', sortable: false },
  ];

  // Convert products to grid rows
  const gridRows: GridRowData[] = products.map((product) => ({
    id: String(product.id),
    cells: {
      vendor: product.vendor ?? '-',
      category: product.category ?? '-',
      subcategory: product.subcategory ?? '-',
      vendorCatNo: product.vendorCatNo ?? '-',
      model: product.model ?? '-',
      mrp: `₹${Number(product.mrp).toLocaleString()}`,
      attributes: <AttributesDisplay attributes={product.attributes} compact maxBadges={2} />,
    },
    actions: [
      { type: 'edit', onClick: () => handleEdit(product) },
      { type: 'delete', onClick: () => handleDelete(product.id) },
    ],
    onDoubleClick: () => handleRowDoubleClick(product),
  }));

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shrink-0">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Products</span>
            {!isLoading && (
              <span className="text-xs text-gray-400">
                {products.length} of {allProducts.length}
              </span>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-80">
              <Input
                type="text"
                placeholder="Search vendor, category, subcategory, cat no, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Clear
              </button>
            )}
            <Button
              onClick={handleCreate}
              className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
            >
              + Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Grid
          columns={columns}
          rows={gridRows}
          columnOrder={['vendor', 'category', 'subcategory', 'vendorCatNo', 'model', 'mrp', 'attributes', 'action']}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          scrollHeight="100%"
        />
      </div>
    </div>
  );
};

export default ProductsGridPage;

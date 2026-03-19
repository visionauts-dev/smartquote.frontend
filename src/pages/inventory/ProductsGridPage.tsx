/**
 * Products Grid Page
 * Display all products in a table with filtering, sorting, and CRUD operations
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Grid, type GridRowData, type GridProps } from '../../components/grid/Grid';
import { Badge } from '../../components/ui/Badge';
import type { ProductDto } from '../../types/api.types';
import { productsApi } from '../../services/api/productsApi';
import { Modal } from '../../components/ui/Modal';
import ProductForm from '../../components/products/ProductForm';

interface ODataQuery {
  $filter?: string;
  $orderby?: string;
  $skip?: number;
  $top?: number;
}

const ProductsGridPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch products with OData support
  const fetchProducts = useCallback(
    async (query: ODataQuery = {}) => {
      setIsLoading(true);
      try {
        const params: ODataQuery = {
          $skip: query.$skip || skip,
          $top: query.$top || take,
          ...query,
        };

        if (searchTerm) {
          params.$filter = `contains(vendor,'${searchTerm}') or contains(category,'${searchTerm}') or contains(subcategory,'${searchTerm}') or contains(vendorCatNo,'${searchTerm}')`;
        }

        if (sortColumn) {
          const direction = sortDirection === 'desc' ? 'desc' : 'asc';
          params.$orderby = `${sortColumn} ${direction}`;
        }

        const response = await productsApi.getAll();
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [skip, take, searchTerm, sortColumn, sortDirection]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle sort
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : null);
      setSortColumn(null);
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSkip(0);
  };

  // Handle edit
  const handleEdit = (product: ProductDto) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Grid columns configuration
  const columns: GridProps['columns'] = [
    { id: 'vendor', label: 'Vendor Name', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'subcategory', label: 'Subcategory', sortable: true },
    { id: 'vendorCatNo', label: 'Cat No', sortable: true },
    { id: 'mrp', label: 'Price', sortable: true },
    { id: 'addOns', label: 'Add-ons', sortable: false },
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
      mrp: `₹${Number(product.mrp).toLocaleString()}`,
      addOns: (
        <Badge variant={product.addOns ? 'accepted' : 'default'}>
          {product.addOns ? 'Yes' : 'No'}
        </Badge>
      ),
      attributes: <span className="line-clamp-2 text-sm">{product.attributes ?? '-'}</span>,
    },
    actions: [
      {
        type: 'edit',
        onClick: () => handleEdit(product),
      },
      {
        type: 'delete',
        onClick: () => handleDelete(product.id),
      },
    ],
  }));

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shrink-0">
        <div className="flex gap-3 items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Products</span>
          <div className="flex gap-3 items-center">
            <div className="w-72">
              <Input
                type="text"
                placeholder="Search by vendor, category, or cat no..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
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
          columnOrder={['vendor', 'category', 'subcategory', 'vendorCatNo', 'mrp', 'addOns', 'attributes', 'action']}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          scrollHeight="100%"
        />
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
        >
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductsGridPage;

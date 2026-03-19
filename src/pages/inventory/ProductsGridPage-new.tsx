/**
 * Products Grid Page - Using DataGrid with GenericGridHeader and GenericGridRowItem
 * Display all products in a grid with filtering, sorting, and CRUD operations
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DataGrid from '../../components/layout/DataGrid';
import type { ProductDto } from '../../types/api.types';
import { productsApi } from '../../services/api/productsApi';
import { Modal } from '../../components/ui/Modal';
import ProductForm from '../../components/products/ProductForm';
import type { ActionButton, ColumnConfig } from '../../components/GridRowItem';
import type { GenericHeaderConfig, SortDirection } from '../../components/GridHeader';

const PAGE_SIZE = 20;

const ProductsGridPage: React.FC = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
    const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await productsApi.getAll();
            setProducts(response);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Search filter
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.vendor?.toLowerCase().includes(query)) ||
                    (p.category?.toLowerCase().includes(query)) ||
                    (p.subcategory?.toLowerCase().includes(query)) ||
                    (p.vendorCatNo?.toLowerCase().includes(query))
            );
        }

        // Sort products
        if (sortField && sortDirection) {
            filtered = [...filtered].sort((a, b) => {
                const aVal = (a as unknown as Record<string, unknown>)[sortField];
                const bVal = (b as unknown as Record<string, unknown>)[sortField];

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return 0;
            });
        }

        return filtered;
    }, [products, searchTerm, sortField, sortDirection]);

    // Paginate products
    const visibleProducts = useMemo(() => {
        return filteredProducts.slice(0, displayCount);
    }, [filteredProducts, displayCount]);

    // Define grid columns (widths must match headers)
    const columns: ColumnConfig<ProductDto>[] = [
        {
            field: 'vendor',
            width: '18%',
            render: (value: unknown) => <span className="font-medium text-gray-900">{String(value ?? '-')}</span>,
        },
        {
            field: 'category',
            width: '18%',
            render: (value: unknown) => <span className="text-gray-700">{String(value ?? '-')}</span>,
        },
        {
            field: 'subcategory',
            width: '16%',
            render: (value: unknown) => <span className="text-gray-700">{String(value ?? '-')}</span>,
        },
        {
            field: 'vendorCatNo',
            width: '14%',
            render: (value: unknown) => <span className="text-gray-700">{String(value ?? '-')}</span>,
        },
        {
            field: 'mrp',
            width: '12%',
            render: (value: unknown) => <span className="font-semibold text-gray-900">₹{Number(value || 0).toLocaleString()}</span>,
        },
        {
            field: 'attributes',
            width: '12%',
            render: (value: unknown) => <span className="line-clamp-2 text-xs text-gray-600">{String(value ?? '-')}</span>,
        },
    ];

    // Define grid headers (must match column widths)
    const headers: GenericHeaderConfig[] = [
        { field: 'vendor', label: 'Vendor', width: '18%', sortable: true },
        { field: 'category', label: 'Category', width: '18%', sortable: true },
        { field: 'subcategory', label: 'Subcategory', width: '16%', sortable: true },
        { field: 'vendorCatNo', label: 'Vendor Cat No', width: '14%', sortable: true },
        { field: 'mrp', label: 'MRP', width: '12%', sortable: true },
        { field: 'attributes', label: 'Attributes', width: '12%', sortable: false },
        { field: 'actions', label: 'Actions', width: '10%', type: 'actions' },
    ];

    // Define actions
    const actions: ActionButton<ProductDto>[] = [
        {
            icon: <span className="text-blue-600">✏️</span>,
            title: 'Edit',
            className: 'text-blue-600 hover:text-blue-700',
            onClick: (product) => {
                setEditingProduct(product);
                setShowModal(true);
            },
        },
        {
            icon: <span className="text-red-600">🗑️</span>,
            title: 'Delete',
            className: 'text-red-600 hover:text-red-700',
            onClick: (product) => {
                if (window.confirm('Are you sure you want to delete this product?')) {
                    handleDelete(product.id);
                }
            },
        },
    ];

    // Handle delete
    const handleDelete = async (id: number) => {
        try {
            await productsApi.delete(id);
            setProducts(products.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Handle sort
    const handleSort = (field: string, direction: SortDirection) => {
        setSortField(field);
        setSortDirection(direction);
        setDisplayCount(PAGE_SIZE);
    };

    // Handle bulk action
    const handleBulkAction = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProducts(new Set(visibleProducts.map((p) => String(p.id))));
        } else {
            setSelectedProducts(new Set());
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

    // Handle load more
    const handleLoadMore = () => {
        setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="shrink-0 bg-white border-b border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
                </div>

                {/* Action Bar */}
                <div className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gray-50 border-b border-gray-200">
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button size="sm" variant="outline">Filters</Button>
                    <Button size="sm" variant="primary">
                        Add Product
                    </Button>
                </div>

                {/* Summary */}
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 border-t border-gray-200">
                    Total Products: {filteredProducts.length}
                    {selectedProducts.size > 0 && <span className="ml-4">Selected: {selectedProducts.size}</span>}
                </div>
            </div>

            {/* Grid Section - Scrollable */}
            <div className="flex-1 overflow-hidden mx-3 lg:mx-6 mt-0 rounded-b-lg border border-t-0 border-gray-200 shadow-sm bg-white">
                <DataGrid
                    items={visibleProducts}
                    columns={columns}
                    headers={headers}
                    actions={actions}
                    isLoading={isLoading}
                    hasMore={visibleProducts.length < filteredProducts.length}
                    onLoadMore={handleLoadMore}
                    onSort={handleSort}
                    onBulkAction={handleBulkAction}
                    showCheckbox={true}
                    showIndicator={false}
                    selectedItems={selectedProducts}
                    containerHeight="100%"
                    className="bg-white"
                />
            </div>

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
                <ProductForm
                    initialData={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
};

export default ProductsGridPage;

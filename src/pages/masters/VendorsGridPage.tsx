/**
 * Vendors Grid Page
 * Display all vendors in a table with filtering, sorting, and CRUD operations
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/ui/PageHeader';
import { Grid, type GridRowData, type GridProps } from '../../components/grid/Grid';
import { Modal } from '../../components/ui/Modal';
import type { VendorDto } from '../../types/api.types';
import { vendorsApi } from '../../services/api/vendorsApi';
import VendorForm from '../../components/products/VendorForm';

interface ODataQuery {
  $filter?: string;
  $orderby?: string;
  $skip?: number;
  $top?: number;
}

const VendorsGridPage: React.FC = () => {
  const [vendors, setVendors] = useState<VendorDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [editingVendor, setEditingVendor] = useState<VendorDto | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch vendors with OData support
  const fetchVendors = useCallback(
    async (query: ODataQuery = {}) => {
      setIsLoading(true);
      try {
        const params: ODataQuery = {
          $skip: query.$skip || skip,
          $top: query.$top || take,
          ...query,
        };

        if (searchTerm) {
          params.$filter = `contains(vendorName,'${searchTerm}')`;
        }

        if (sortColumn) {
          const direction = sortDirection === 'desc' ? 'desc' : 'asc';
          params.$orderby = `${sortColumn} ${direction}`;
        }

        const response = await vendorsApi.getAll();
        setVendors(response);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [skip, take, searchTerm, sortColumn, sortDirection]
  );

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

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
  const handleEdit = (vendor: VendorDto) => {
    setEditingVendor(vendor);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsApi.delete(id);
        setVendors(vendors.filter((v) => v.id !== id));
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingVendor) {
        await vendorsApi.update(editingVendor.id, formData);
      } else {
        await vendorsApi.create(formData);
      }
      setShowModal(false);
      setEditingVendor(null);
      await fetchVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  // Grid columns configuration
  const columns: GridProps['columns'] = [
    { id: 'vendorName', label: 'Vendor Name', sortable: true },
    { id: 'action', label: 'Actions', sortable: false },
  ];

  // Convert vendors to grid rows
  const gridRows: GridRowData[] = vendors.map((vendor) => ({
    id: String(vendor.id),
    cells: {
      vendorName: vendor.vendorName,
    },
    actions: [
      {
        type: 'edit',
        onClick: () => handleEdit(vendor),
      },
      {
        type: 'delete',
        onClick: () => handleDelete(vendor.id),
      },
    ],
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Vendors"
        description="Manage your vendors"
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by vendor name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            setEditingVendor(null);
            setShowModal(true);
          }}>
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Grid
          columns={columns}
          rows={gridRows}
          columnOrder={['vendorName', 'action']}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>

      {/* Vendor Form Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingVendor(null);
          }}
          title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
        >
          <VendorForm
            initialData={editingVendor}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowModal(false);
              setEditingVendor(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default VendorsGridPage;

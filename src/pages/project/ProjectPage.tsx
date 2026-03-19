/**
 * Project page - Generic GridHeader + GridRowItem, StatusFilterBuckets, InfiniteScroll
 * Columns: Project ID, Project Name, No Of GA's, Created Date, Total Estimation, Status, Action
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { fetchQuotes } from '../../redux/slices/quotesSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Grid } from '../../components/grid/Grid';
import type { GridColumn } from '../../components/grid/GridHeader';
import type { GridRowData } from '../../components/grid/Grid';
import type { StatusBucket } from '../../components/grid';

export type ProjectStatus = 'quoted' | 'pending' | 'inprogress' | 'cancelled' | 'rejected';

interface ProjectRow {
  id: string;
  projectId: string;
  projectName: string;
  noOfGAs: number;
  createdDate: string;
  totalEstimation: number;
  status: ProjectStatus;
}

const statusMap: Record<string, ProjectStatus> = {
  draft: 'pending',
  sent: 'inprogress',
  viewed: 'inprogress',
  accepted: 'quoted',
  declined: 'rejected',
  expired: 'cancelled',
};

const PAGE_SIZE = 15;

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Project grid columns */
const GRID_COLUMNS: GridColumn[] = [
  { id: 'projectId', label: 'Project ID', sortable: true, filterable: true },
  { id: 'projectName', label: 'Project Name', sortable: true, filterable: true },
  { id: 'noOfGAs', label: "No Of GA's", sortable: true },
  { id: 'createdDate', label: 'Created Date', sortable: true },
  { id: 'totalEstimation', label: 'Total Estimation', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'action', label: 'Action' },
];

const COLUMN_ORDER = ['projectId', 'projectName', 'noOfGAs', 'createdDate', 'totalEstimation', 'status', 'action'];

const PROJECT_STATUS_BUCKETS: Omit<StatusBucket, 'count'>[] = [
  { key: 'quoted', label: 'Quoted', outlineClass: 'border-green-500 text-green-600', filledClass: 'bg-green-500' },
  { key: 'pending', label: 'Pending', outlineClass: 'border-amber-500 text-amber-600', filledClass: 'bg-amber-500' },
  { key: 'inprogress', label: 'Inprogress', outlineClass: 'border-blue-500 text-blue-600', filledClass: 'bg-blue-500' },
  { key: 'cancelled', label: 'Cancelled', outlineClass: 'border-gray-400 text-gray-600', filledClass: 'bg-gray-400' },
  { key: 'rejected', label: 'Rejected', outlineClass: 'border-red-500 text-red-600', filledClass: 'bg-red-500' },
];

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.quotes);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  
  // Create Project Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryDate, setEnquiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  const projects = useMemo(() => {
    return items.map((q: { id: string; title: string; lineItems?: unknown[]; status: string; createdAt: string; totalAmount: number }) => ({
      id: q.id,
      projectId: `PRD${q.id.slice(-9).toUpperCase()}`,
      projectName: q.title,
      noOfGAs: q.lineItems?.length ?? 0,
      createdDate: q.createdAt,
      totalEstimation: q.totalAmount,
      status: statusMap[q.status] ?? 'pending',
    })) as ProjectRow[];
  }, [items]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const matchSearch = !search.trim() ||
        p.projectName.toLowerCase().includes(search.toLowerCase()) ||
        p.projectId.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
    if (sortColumn && sortDirection) {
      list = [...list].sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortColumn];
        const bVal = (b as unknown as Record<string, unknown>)[sortColumn];
        if (typeof aVal === 'string' && typeof bVal === 'string') return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        if (typeof aVal === 'number' && typeof bVal === 'number') return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        return 0;
      });
    }
    return list;
  }, [projects, search, sortColumn, sortDirection]);

  const visibleRows = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount]);
  const hasMore = visibleRows.length < filtered.length;
  const loadMore = () => setDisplayCount((c) => Math.min(c + PAGE_SIZE, filtered.length));

  const gridRows: GridRowData[] = useMemo(() => visibleRows.map((p) => ({
    id: p.id,
    rowLink: `/quotes/${p.id}`,
    cells: {
      projectId: p.projectId,
      projectName: p.projectName,
      noOfGAs: p.noOfGAs,
      createdDate: formatDate(p.createdDate),
      totalEstimation: p.totalEstimation.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      status: null,
    },
    status: { label: p.status.charAt(0).toUpperCase() + p.status.slice(1), variant: p.status },
    actions: [
      { type: 'view', href: `/quotes/${p.id}` },
      { type: 'edit', href: `/quotes/${p.id}/edit` },
      { type: 'delete' },
    ],
    onDelete: () => dispatch(openModal({ id: 'deleteQuote', payload: { quoteId: p.id } })),
  })), [visibleRows, dispatch]);

  const handleSort = (columnId: string) => {
    setSortColumn(columnId);
    setSortDirection((d) => (sortColumn === columnId && d === 'asc' ? 'desc' : 'asc'));
  };

  const handleCreateProject = async () => {
    if (!clientName.trim() || !email.trim() || !phone.trim() || !enquiryDate) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, navigate to quotes/new with the form data
      // In a real scenario, you would create a quote with this data first
      navigate('/quotes/new', {
        state: {
          clientName,
          email,
          phone,
          enquiryDate,
        },
      });
      setShowCreateModal(false);
      setClientName('');
      setEmail('');
      setPhone('');
      setEnquiryDate('');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setEmail('');
    setPhone('');
    setEnquiryDate('');
    setShowCreateModal(false);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shrink-0">
        <div className="flex gap-3 items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Projects</span>
          <div className="flex gap-3 items-center">
            <div className="w-72">
              <Input
                type="text"
                placeholder="Search by project name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
            >
              + Create Project
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Grid
          columns={GRID_COLUMNS}
          rows={gridRows}
          columnOrder={COLUMN_ORDER}
          showCheckbox={false}
          hasMore={hasMore}
          loadMore={loadMore}
          scrollHeight="100%"
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onFilter={() => { }}
        />
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={resetForm}
        title="Create New Project"
        size="md"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <Input
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enquiry Date
            </label>
            <Input
              type="date"
              value={enquiryDate}
              onChange={(e) => setEnquiryDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectPage;

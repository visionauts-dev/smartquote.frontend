/**
 * Project page - Generic GridHeader + GridRowItem, StatusFilterBuckets, InfiniteScroll
 * Columns: Project ID, Project Name, No Of GA's, Created Date, Total Estimation, Status, Action
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { fetchQuotes } from '../../redux/slices/quotesSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { Button } from '../../components/ui/Button';
import { StatusFilterBuckets } from '../../components/grid/StatusFilterBuckets';
import { Grid } from '../../components/grid/Grid';
import type { StatusBucket } from '../../components/grid/StatusFilterBuckets';
import type { GridColumn } from '../../components/grid/GridHeader';
import type { GridRowData } from '../../components/grid/Grid';

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

/** Default status buckets for Project page */
const PROJECT_STATUS_BUCKETS: Omit<StatusBucket, 'count'>[] = [
  { key: 'quoted', label: 'Quoted', outlineClass: 'border-green-500 text-green-600', filledClass: 'bg-green-500' },
  { key: 'pending', label: 'Pending', outlineClass: 'border-amber-500 text-amber-600', filledClass: 'bg-amber-500' },
  { key: 'inprogress', label: 'Inprogress', outlineClass: 'border-blue-500 text-blue-600', filledClass: 'bg-blue-500' },
  { key: 'cancelled', label: 'Cancelled', outlineClass: 'border-gray-400 text-gray-600', filledClass: 'bg-gray-400' },
  { key: 'rejected', label: 'Rejected', outlineClass: 'border-red-500 text-red-600', filledClass: 'bg-red-500' },
];

const ProjectPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.quotes);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

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
      const matchStatus = !activeStatus || p.status === activeStatus;
      const matchSearch = !search.trim() ||
        p.projectName.toLowerCase().includes(search.toLowerCase()) ||
        p.projectId.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
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
  }, [projects, activeStatus, search, sortColumn, sortDirection]);

  const visibleRows = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount]);
  const hasMore = visibleRows.length < filtered.length;
  const loadMore = () => setDisplayCount((c) => Math.min(c + PAGE_SIZE, filtered.length));

  const statusBuckets: StatusBucket[] = useMemo(() =>
    PROJECT_STATUS_BUCKETS.map((b) => ({
      ...b,
      count: projects.filter((p) => p.status === b.key).length,
    })),
    [projects]
  );

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

  const handleStatusSelect = (key: string | null) => {
    setActiveStatus(key as ProjectStatus | null);
    setDisplayCount(PAGE_SIZE);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Title */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Project</h1>
          <p className="text-gray-500 mt-1">Project</p>
        </div>

        {/* Action bar */}
        <div className="p-4 flex flex-wrap items-center gap-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button variant="outline" size="sm">Filters</Button>
          <Link to="/quotes/new">
            <Button size="sm">Create</Button>
          </Link>
        </div>

        {/* Status filter buckets - outline by default, filters grid on selection */}
        <div className="p-4 border-b border-gray-200">
          <StatusFilterBuckets
            buckets={statusBuckets}
            activeKey={activeStatus}
            onSelect={handleStatusSelect}
            variant="outline"
          />
        </div>

        {/* Summary */}
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
          Total Sub Projects : {projects.reduce((s: number, p: ProjectRow) => s + p.noOfGAs, 0).toLocaleString()}
          <span className="mx-2">|</span>
          Total Projects : {projects.length}
        </div>

        {/* Grid - Generic GridHeader + GridRowItem wrapped in InfiniteScroll */}
        <Grid
          columns={GRID_COLUMNS}
          rows={gridRows}
          columnOrder={COLUMN_ORDER}
          showCheckbox={false}
          hasMore={hasMore}
          loadMore={loadMore}
          scrollHeight="60vh"
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onFilter={() => {}}
        />
      </div>
    </div>
  );
};

export default ProjectPage;

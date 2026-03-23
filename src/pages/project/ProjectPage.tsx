/**
 * Project page - Generic GridHeader + GridRowItem, StatusFilterBuckets, InfiniteScroll
 * Columns: Project ID, Project Name, No Of GA's, Created Date, Total Estimation, Status, Action
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { openModal } from '../../redux/slices/uiSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Grid } from '../../components/grid/Grid';
import { projectsApi } from '../../services/api/projectsApi';
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

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [projectsData, setProjectsData] = useState<ProjectRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  
  // Create Project Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [enquiryDate, setEnquiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects from API
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsApi.getAll();
      console.log('Projects fetched:', response);
      
      // Map API response to ProjectRow format
      const mappedProjects = response.map((p: any) => ({
        id: p.id.toString(),
        projectId: `PRD${p.id.toString().padStart(9, '0')}`,
        projectName: p.projectName,
        noOfGAs: 0, // Will be updated if backend provides this
        createdDate: p.enquiryDate || new Date().toISOString(),
        totalEstimation: 0, // Will be updated if backend provides this
        status: 'pending' as ProjectStatus,
      })) as ProjectRow[];
      
      setProjectsData(mappedProjects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch projects';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const projects = useMemo(() => projectsData, [projectsData]);

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
      { type: 'view', href: `/project/${p.id}` },
      { type: 'edit', href: `/project/${p.id}` },
      { type: 'delete' },
    ],
    onDelete: () => dispatch(openModal({ id: 'deleteQuote', payload: { quoteId: p.id } })),
  })), [visibleRows, dispatch]);

  const handleSort = (columnId: string) => {
    setSortColumn(columnId);
    setSortDirection((d) => (sortColumn === columnId && d === 'asc' ? 'desc' : 'asc'));
  };

  const handleCreateProject = async () => {
    if (!projectName.trim() || !description.trim() || !clientName.trim() || !email.trim() || !phone.trim() || !address.trim() || !enquiryDate) {
      alert('Please fill in all fields');
      return;
    }

    // Check authentication
    if (!isAuthenticated || !token) {
      console.warn('Auth state:', { isAuthenticated, hasToken: !!token });
      alert('Authentication token not found. Please refresh the page and log in again.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Creating project with data:', {
        projectName,
        description,
        clientName,
        clientEmail: email,
        phoneNumber: phone,
        address,
        enquiryDate,
      });

      // Call the API to create the project
      const result = await projectsApi.create({
        projectName: projectName.trim(),
        description: description.trim(),
        clientName: clientName.trim(),
        clientEmail: email.trim(),
        phoneNumber: phone.trim(),
        address: address.trim(),
        enquiryDate,
      });

      console.log('Project created successfully:', result);
      alert('Project created successfully!');
      
      // Reset form and close modal
      setShowCreateModal(false);
      setProjectName('');
      setDescription('');
      setClientName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setEnquiryDate('');
      
      // Refresh the projects list
      await fetchProjects();
    } catch (error: any) {
      console.error('Full error object:', error);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || error.response?.statusText || error.message || 'Failed to create project';
      const statusCode = error.response?.status;
      
      console.error('Error details:', { statusCode, errorMessage, responseData: error.response?.data });
      
      if (statusCode === 401) {
        alert('Authentication failed (401). Please log in again.');
        navigate('/login');
      } else if (statusCode === 403) {
        alert('You do not have permission to create projects (403).');
      } else {
        alert(`Error: ${errorMessage} (Status: ${statusCode})`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProjectName('');
    setDescription('');
    setClientName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setEnquiryDate('');
    setShowCreateModal(false);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shrink-0">
        <div className="flex gap-3 items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Projects {isLoading && '(Loading...)'}
          </span>
          <div className="flex gap-3 items-center">
            <div className="w-72">
              <Input
                type="text"
                placeholder="Search by project name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={isLoading}
              className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Create Project
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading && !projectsData.length ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading projects...
          </div>
        ) : (
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
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={resetForm}
        title="Create New Project"
        size="xl"
        maxHeight="600px"
      >
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <Input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              type="text"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              onClick={resetForm}
              className="px-4 py-2 text-[gray-700] bg-transparent rounded hover:bg-gray-200"
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

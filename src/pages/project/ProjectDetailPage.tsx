/**
 * Project Detail Page
 * Displays project information and allows managing General Arrangements (GAs)
 * Layout: Project details at top, GA grid below with "Add GA" button
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../../services/api/projectsApi';
import { gasApi } from '../../services/api/gasApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Grid } from '../../components/grid/Grid';
import type { GridColumn } from '../../components/grid/GridHeader';
import type { GridRowData } from '../../components/grid/Grid';
import type { ProjectDto, GADto } from '../../types/api.types';

export interface GARow {
  id: string;
  gaName: string;
  description: string;
  estimatedCost: number;
  quantity: number;
  totalCost: number;
  status: 'draft' | 'estimated' | 'approved';
}

const PAGE_SIZE = 15;

function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** GA grid columns */
const GA_COLUMNS: GridColumn[] = [
  { id: 'gaName', label: 'GA Name', sortable: true, filterable: true },
  { id: 'description', label: 'Description', sortable: true, filterable: true },
  { id: 'quantity', label: 'Quantity', sortable: true },
  { id: 'estimatedCost', label: 'Estimated Cost', sortable: true },
  { id: 'totalCost', label: 'Total Cost', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'action', label: 'Action' },
];

const GA_COLUMN_ORDER = ['gaName', 'description', 'quantity', 'estimatedCost', 'totalCost', 'status', 'action'];

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  
  // Project state
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  // GA state
  const [gasData, setGAsData] = useState<GARow[]>([]);
  const [isLoadingGAs, setIsLoadingGAs] = useState(false);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // Add GA Modal state
  const [showAddGAModal, setShowAddGAModal] = useState(false);
  const [gaName, setGAName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [isSubmittingGA, setIsSubmittingGA] = useState(false);

  // Fetch project details
  const fetchProject = async () => {
    if (!projectId) return;
    setIsLoadingProject(true);
    setProjectError(null);
    try {
      const response = await projectsApi.getById(parseInt(projectId));
      console.log('Project fetched:', response);
      setProject(response);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch project';
      setProjectError(errorMessage);
    } finally {
      setIsLoadingProject(false);
    }
  };

  // Fetch GAs
  const fetchGAs = async () => {
    if (!projectId) return;
    setIsLoadingGAs(true);
    try {
      const response = await gasApi.getByProjectId(parseInt(projectId));
      console.log('GAs fetched for project:', response);
      
      // Map API response to GARow format
      const mappedGAs = response.map((ga: GADto) => ({
        id: ga.id.toString(),
        gaName: ga.gaName,
        description: ga.description,
        quantity: ga.quantity,
        estimatedCost: ga.estimatedCost,
        totalCost: ga.totalCost,
        status: ga.status,
      })) as GARow[];
      
      setGAsData(mappedGAs);
    } catch (err: any) {
      console.error('Error fetching GAs:', err);
      // If API not ready yet, just use empty array
      setGAsData([]);
    } finally {
      setIsLoadingGAs(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchGAs();
  }, [projectId]);

  const gasList = useMemo(() => gasData, [gasData]);

  const filtered = useMemo(() => {
    let list = gasList.filter((ga) => {
      const matchSearch = !search.trim() ||
        ga.gaName.toLowerCase().includes(search.toLowerCase()) ||
        ga.description.toLowerCase().includes(search.toLowerCase());
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
  }, [gasList, search, sortColumn, sortDirection]);

  const visibleRows = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount]);
  const hasMore = visibleRows.length < filtered.length;
  const loadMore = () => setDisplayCount((c) => Math.min(c + PAGE_SIZE, filtered.length));

  const gridRows: GridRowData[] = useMemo(() => visibleRows.map((ga) => {
    // Map GA status to grid status variants
    const statusVariantMap: Record<string, 'quoted' | 'pending' | 'inprogress' | 'cancelled' | 'rejected'> = {
      draft: 'pending',
      estimated: 'inprogress',
      approved: 'quoted',
    };

    return {
      id: ga.id,
      cells: {
        gaName: ga.gaName,
        description: ga.description,
        quantity: ga.quantity.toString(),
        estimatedCost: formatCurrency(ga.estimatedCost),
        totalCost: formatCurrency(ga.totalCost),
        status: null,
      },
      status: { 
        label: ga.status.charAt(0).toUpperCase() + ga.status.slice(1), 
        variant: statusVariantMap[ga.status] || 'pending'
      },
      actions: [
        { type: 'view' },
        { type: 'edit' },
        { type: 'delete' },
      ],
      onDelete: () => {
        // Handle delete GA
        console.log('Delete GA:', ga.id);
      },
    };
  }), [visibleRows]);

  const handleSort = (columnId: string) => {
    setSortColumn(columnId);
    setSortDirection((d) => (sortColumn === columnId && d === 'asc' ? 'desc' : 'asc'));
  };

  const handleAddGA = async () => {
    if (!gaName.trim() || !description.trim() || !estimatedCost.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmittingGA(true);
    try {
      const qty = parseInt(quantity) || 1;
      const cost = parseFloat(estimatedCost);
      
      console.log('Adding GA for project:', projectId);
      
      // Call API to save GA
      const result = await gasApi.create(parseInt(projectId!), {
        gaName: gaName.trim(),
        description: description.trim(),
        quantity: qty,
        estimatedCost: cost,
      });

      console.log('GA created successfully:', result);
      
      // Add to local state
      const newGA: GARow = {
        id: result.id.toString(),
        gaName: result.gaName,
        description: result.description,
        quantity: result.quantity,
        estimatedCost: result.estimatedCost,
        totalCost: result.totalCost,
        status: result.status,
      };
      
      setGAsData([...gasData, newGA]);
      
      // Reset form and close modal
      setShowAddGAModal(false);
      setGAName('');
      setDescription('');
      setQuantity('1');
      setEstimatedCost('');
      
      alert('GA added successfully!');
    } catch (error: any) {
      console.error('Error adding GA:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add GA';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmittingGA(false);
    }
  };

  const resetGAForm = () => {
    setGAName('');
    setDescription('');
    setQuantity('1');
    setEstimatedCost('');
    setShowAddGAModal(false);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Project Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shrink-0">
        {projectError && (
          <div className="bg-red-50 border border-red-200 rounded p-2 mb-3 text-sm text-red-700">
            {projectError}
          </div>
        )}
        
        {isLoadingProject ? (
          <div className="text-gray-500 text-sm">Loading project details...</div>
        ) : project ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{project.projectName}</h2>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
              <button
                onClick={() => navigate('/project')}
                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-xs text-gray-600 font-medium">Client Name</div>
                <div className="text-sm font-semibold text-gray-900">{project.clientName}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-xs text-gray-600 font-medium">Email</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{project.clientEmail}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-xs text-gray-600 font-medium">Phone</div>
                <div className="text-sm font-semibold text-gray-900">{project.phoneNumber}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-xs text-gray-600 font-medium">Enquiry Date</div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(project.enquiryDate).toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* GA Search and Add Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shrink-0">
        <div className="flex gap-3 items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            General Arrangements {isLoadingGAs && '(Loading...)'}
          </span>
          <div className="flex gap-3 items-center">
            <div className="w-72">
              <Input
                type="text"
                placeholder="Search by GA name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoadingGAs}
              />
            </div>
            <button
              onClick={() => setShowAddGAModal(true)}
              disabled={isLoadingGAs}
              className="whitespace-nowrap px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              + Add GA
            </button>
          </div>
        </div>
      </div>

      {/* GA Grid */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoadingGAs && !gasData.length ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading General Arrangements...
          </div>
        ) : gasData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No General Arrangements added yet. Click "+ Add GA" to create one.
          </div>
        ) : (
          <Grid
            columns={GA_COLUMNS}
            rows={gridRows}
            columnOrder={GA_COLUMN_ORDER}
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

      {/* Add GA Modal */}
      <Modal
        isOpen={showAddGAModal}
        onClose={resetGAForm}
        title="Add General Arrangement (GA)"
        size="lg"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GA Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter GA name (e.g., Standard Package)"
              value={gaName}
              onChange={(e) => setGAName(e.target.value)}
              disabled={isSubmittingGA}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmittingGA}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                disabled={isSubmittingGA}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Cost <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                step="0.01"
                min="0"
                disabled={isSubmittingGA}
              />
            </div>
          </div>

          {estimatedCost && quantity && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <div className="text-gray-700">
                Total Cost: <span className="font-semibold text-blue-700">
                  ${formatCurrency(parseFloat(estimatedCost) * (parseInt(quantity) || 1))}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              onClick={resetGAForm}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              disabled={isSubmittingGA}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGA}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={isSubmittingGA}
            >
              {isSubmittingGA ? 'Adding...' : 'Add GA'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;

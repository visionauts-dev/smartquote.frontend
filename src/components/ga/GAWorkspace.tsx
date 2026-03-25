/**
 * GA Workspace - Main layout with PDF viewer and tabbed workflow
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer } from './PDFViewer';
import { DetectionTable } from './tabs/DetectionTable';
import { ProductSelector } from './tabs/ProductSelector';
import { FabricationPanel } from './tabs/FabricationPanel';
import { QuoteBuilder } from './tabs/QuoteBuilder';
import { ExportPanel } from './tabs/ExportPanel';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { setActiveTab, setCurrentGA, setError, setIsLoading } from '../../redux/slices/gaSlice';
import { gasApi } from '../../services';
import { Button } from '../ui';

interface GAWorkspaceParams extends Record<string, string | undefined> {
  projectId?: string;
  gaId?: string;
}

type TabType = 'detection' | 'product' | 'fabrication' | 'quote' | 'export';

const TAB_LIST: { id: TabType; label: string; icon: string }[] = [
  { id: 'detection', label: 'Detection', icon: '🔍' },
  { id: 'product', label: 'Products', icon: '📦' },
  { id: 'fabrication', label: 'Fabrication', icon: '🔧' },
  { id: 'quote', label: 'Quote', icon: '💰' },
  { id: 'export', label: 'Export', icon: '📤' },
];

export const GAWorkspace: React.FC = () => {
  const { projectId, gaId } = useParams<GAWorkspaceParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentGA, activeTab, isLoading, savedSteps } = useAppSelector((state: any) => state.ga);

  const projectIdNum = parseInt(projectId || '0');
  const gaIdNum = parseInt(gaId || '0');

  useEffect(() => {
    if (gaIdNum && projectIdNum) {
      loadGA();
    }
  }, [gaIdNum, projectIdNum]);

  const loadGA = async () => {
    dispatch(setIsLoading(true));
    try {
      const ga = await gasApi.getById(projectIdNum, gaIdNum);
      dispatch(setCurrentGA(ga));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load GA';
      dispatch(setError(message));
      navigate(`/project/${projectIdNum}`);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleTabChange = (tab: TabType) => {
    dispatch(setActiveTab(tab));
  };

  const canAccessTab = (tab: TabType): boolean => {
    switch (tab) {
      case 'product':
        return savedSteps.detection;
      case 'fabrication':
        return savedSteps.product;
      case 'quote':
        return savedSteps.fabrication;
      case 'export':
        return savedSteps.quote;
      default:
        return true;
    }
  };

  if (!currentGA || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-gray-600">Loading GA Workspace...</p>
        </div>
      </div>
    );
  }

  const pdfUrl = currentGA.pdfUrl || ''; // Assuming the API returns pdfUrl

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{currentGA.gaName}</h1>
            <p className="text-blue-100 text-sm">GA ID: {currentGA.id} | Status: {currentGA.status}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate(`/project/${projectIdNum}`)}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            ← Back to Project
          </Button>
        </div>
      </div>

      {/* Split Layout: PDF + Tabs */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className="w-1/2 border-r border-gray-300 flex flex-col">
          {pdfUrl ? (
            <PDFViewer pdfUrl={pdfUrl} gaName={currentGA.gaName} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <p className="text-2xl mb-2">📄</p>
                <p>PDF not available</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Tab Navigation + Content */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Tab Navigation */}
          <div className="bg-gray-50 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-1 px-4 py-3">
              {TAB_LIST.map((tab) => {
                const isActive = activeTab === tab.id;
                const isSaved = savedSteps[tab.id as keyof typeof savedSteps];
                const isAccessible = canAccessTab(tab.id);

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    disabled={!isAccessible}
                    className={`
                      px-4 py-2 rounded-t-lg font-medium text-sm whitespace-nowrap
                      transition-all duration-200 flex items-center gap-2
                      ${isActive
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : isAccessible
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-white'
                        : 'text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {isSaved && <span className="text-green-500">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'detection' && (
              <DetectionTable gaId={gaIdNum} />
            )}
            {activeTab === 'product' && (
              <ProductSelector
                gaId={gaIdNum}
              />
            )}
            {activeTab === 'fabrication' && (
              <FabricationPanel
                gaId={gaIdNum}
              />
            )}
            {activeTab === 'quote' && (
              <QuoteBuilder
                gaId={gaIdNum}
              />
            )}
            {activeTab === 'export' && (
              <ExportPanel gaId={gaIdNum} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

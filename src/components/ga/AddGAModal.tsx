/**
 * Add GA Modal - for uploading PDF and creating GA
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GADto } from '../../types';
import { gasApi } from '../../services';
import { Button, Input, Modal } from '../ui';

interface AddGAModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onGACreated?: (ga: GADto) => void;
}

export const AddGAModal: React.FC<AddGAModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onGACreated,
}) => {
  const navigate = useNavigate();
  const [gaName, setGAName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setSelectedFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        setError('File size must be less than 50MB');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !gaName.trim()) {
      setError('Please select a file and enter a GA name');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 30;
        });
      }, 200);

      const ga = await gasApi.uploadGA(projectId, selectedFile, gaName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Wait a moment before navigating
      setTimeout(() => {
        onGACreated?.(ga);
        handleClose();
        // Navigate to GA workspace
        navigate(`/project/${projectId}/ga/${ga.id}/workspace`);
      }, 500);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to upload GA';
      setError(message);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setGAName('');
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add General Arrangement (GA)"
      size="md"
      height="auto"
    >
      <div className="space-y-4">
        {/* GA Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GA Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="e.g., GA-001, Front Panel Layout"
            value={gaName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGAName(e.target.value)}
            disabled={isUploading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Give this GA a descriptive name for easy identification
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF File <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="ga-file-input"
              disabled={isUploading}
            />
            <label
              htmlFor="ga-file-input"
              className="cursor-pointer block"
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="text-2xl">📄</div>
                  <div className="font-medium text-gray-900">
                    {selectedFile.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFile(null);
                    }}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl">📁</div>
                  <div className="font-medium text-gray-700">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-sm text-gray-500">
                    PDF files up to 50MB
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Uploading & Processing...
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> The system will automatically detect items in the PDF.
            You can review and adjust detections in the next step.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !gaName.trim() || isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload & Continue'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

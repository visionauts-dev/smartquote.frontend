/**
 * Export Panel Tab - Finalize and download quote
 */

import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppHooks';
import { gasApi } from '../../../services/api';
import { Button } from '../../ui/Button';
import type { GAQuoteLineItem } from '../../../types/api.types';

interface ExportPanelProps {
  gaId: number;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ gaId }) => {
  const { quoteData, quoteMetadata } = useAppSelector((state) => state.ga);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportedFiles, setExportedFiles] = useState<any[]>([]);

  const handleExport = async (format: 'pdf' | 'word' | 'excel') => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await gasApi.exportQuote(gaId, format);
      
      // Download the file
      const blob = await gasApi.downloadExport(response.url);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.fileName || `quote.${format === 'pdf' ? 'pdf' : format === 'word' ? 'docx' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track exported files
      setExportedFiles((prev) => [...prev, { format, fileName: response.fileName, timestamp: new Date() }]);
    } catch (err: any) {
      const message = err.response?.data?.message || `Failed to export as ${format.toUpperCase()}`;
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  };

  const totalTax = quoteMetadata.tax;
  const taxPercentage = quoteMetadata.subtotal > 0 ? ((totalTax / (quoteMetadata.subtotal - quoteMetadata.discount)) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 h-full overflow-auto">
      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quote Summary</h3>

        {/* Items List */}
        <div className="bg-gray-50 rounded p-4 max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-medium text-gray-700">Product</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Qty</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Price</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {quoteData.map((item: GAQuoteLineItem) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-2 text-gray-800">{item.productName}</td>
                  <td className="py-2 px-2 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-2 px-2 text-right text-gray-600">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right font-medium">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t border-gray-300 pt-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-medium">₹{quoteMetadata.subtotal.toFixed(2)}</span>
          </div>
          {quoteMetadata.discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount:</span>
              <span className="font-medium">- ₹{quoteMetadata.discount.toFixed(2)}</span>
            </div>
          )}
          {quoteMetadata.tax > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Tax (GST {taxPercentage}%):</span>
              <span className="font-medium">+ ₹{quoteMetadata.tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-900 bg-blue-50 p-3 rounded border border-blue-200">
            <span>Grand Total:</span>
            <span className="text-blue-600">₹{quoteMetadata.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Download Quote</h3>

        {exportError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{exportError}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isExporting || quoteData.length === 0}
            loading={isExporting}
            className="text-center"
          >
            📄 PDF
          </Button>
          <Button
            onClick={() => handleExport('word')}
            disabled={isExporting || quoteData.length === 0}
            loading={isExporting}
            className="text-center"
          >
            📝 Word
          </Button>
          <Button
            onClick={() => handleExport('excel')}
            disabled={isExporting || quoteData.length === 0}
            loading={isExporting}
            className="text-center"
          >
            📊 Excel
          </Button>
        </div>

        {exportedFiles.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium text-green-800">✓ Exported files:</p>
            <ul className="text-sm text-green-700 space-y-1">
              {exportedFiles.map((file, index) => (
                <li key={index}>
                  • {file.fileName || `Quote.${file.format}`} ({file.timestamp.toLocaleTimeString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Additional Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>

        <div className="space-y-2 text-sm text-gray-700">
          <p>✓ Quote has been successfully created</p>
          <p>✓ All items have been calculated with fabrication costs</p>
          <p>✓ Quote can be exported in multiple formats</p>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full">
            ✉️ Send Quote via Email
          </Button>
          <Button variant="secondary" className="w-full">
            ← Back to Project
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <p>
          <strong>💡 Tip:</strong> You can download the quote in PDF, Word, or Excel format.
          Each format is optimized for different uses.
        </p>
      </div>
    </div>
  );
};

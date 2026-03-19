/**
 * Single grid row item - used inside Grid with InfiniteScroll
 */

import React from 'react';
import { Link } from 'react-router-dom';

export interface GridRowAction {
  type: 'view' | 'edit' | 'delete';
  href?: string;
  onClick?: () => void;
}

export interface GridRowItemProps {
  /** Unique row id */
  id: string;
  /** Cell values keyed by column id */
  cells: Record<string, React.ReactNode>;
  /** Optional: link for first cell or specific cell */
  rowLink?: string;
  /** Status pill: { label, variant for styling } */
  status?: { label: string; variant: 'quoted' | 'pending' | 'inprogress' | 'cancelled' | 'rejected' };
  /** Action buttons */
  actions?: GridRowAction[];
  onDelete?: () => void;
  columnOrder: string[];
  /** Optional checkbox */
  showCheckbox?: boolean;
}

const statusVariantClasses: Record<string, string> = {
  quoted: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  inprogress: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-800',
};

function ViewIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export const GridRowItem: React.FC<GridRowItemProps> = ({
  id,
  cells,
  rowLink,
  status,
  actions,
  onDelete,
  columnOrder,
  showCheckbox = false,
}) => {
  const actionColumnId = 'action';
  const displayColumns = columnOrder.filter((c) => c !== actionColumnId);

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0 text-xs lg:text-sm" data-row-id={id}>
      {showCheckbox && (
        <td className="px-2 lg:px-4 py-2 lg:py-3">
          <input type="checkbox" className="rounded border-gray-300" aria-label={`Select row ${id}`} />
        </td>
      )}
      {displayColumns.map((colId, index) => {
        const isFirst = index === 0;
        const cell = cells[colId];
        const content = colId === 'status' && status ? (
          <span className={`inline-flex px-1.5 lg:px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariantClasses[status.variant] ?? 'bg-gray-100 text-gray-800'}`}>
            {status.label}
          </span>
        ) : (
          cell
        );

        return (
          <td key={colId} className="px-2 lg:px-4 py-2 lg:py-3 text-gray-900 whitespace-nowrap lg:whitespace-normal">
            {isFirst && rowLink ? (
              <Link to={rowLink} className="text-blue-600 hover:underline font-medium">
                {content}
              </Link>
            ) : (
              content
            )}
          </td>
        );
      })}
      {columnOrder.includes(actionColumnId) && (
        <td className="px-2 lg:px-4 py-2 lg:py-3 sticky right-0 bg-gray-50 hover:bg-gray-100">
          <div className="flex items-center gap-0.5 lg:gap-1">
            {actions?.map((action) => {
              if (action.type === 'view' && action.href) {
                return (
                  <Link
                    key="view"
                    to={action.href}
                    className="p-1 lg:p-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition"
                    title="View"
                  >
                    <ViewIcon />
                  </Link>
                );
              }
              if (action.type === 'edit' && action.href) {
                return (
                  <Link
                    key="edit"
                    to={action.href}
                    className="p-1 lg:p-1.5 rounded-full text-green-600 hover:bg-green-50 transition"
                    title="Edit"
                  >
                    <EditIcon />
                  </Link>
                );
              }
              if (action.type === 'delete') {
                return (
                  <button
                    key="delete"
                    type="button"
                    onClick={onDelete ?? action.onClick}
                    className="p-1 lg:p-1.5 rounded-full text-red-600 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
                );
              }
              return null;
            })}
          </div>
        </td>
      )}
    </tr>
  );
};

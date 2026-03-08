import { useState } from "react";
import { RiArrowUpFill, RiArrowDownFill } from "@remixicon/react";

export type SortDirection = "asc" | "desc" | null;

export interface GenericHeaderConfig {
  field: string;
  label: string;
  width: string;
  type?: "checkbox" | "actions" | "default";
  tooltip?: string;
  sortable?: boolean;
}

interface GenericGridHeaderProps {
  headers: GenericHeaderConfig[];
  handleSort?: (field: string, direction: SortDirection) => void;
  handleBulkAction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllSelected?: boolean;
  className?: string;
}

export const GenericGridHeader = (props: GenericGridHeaderProps) => {
  const {
    headers,
    handleSort,
    handleBulkAction,
    isAllSelected = false,
    className = "",
  } = props;

  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: SortDirection;
  } | null>(null);

  const handleHeaderClick = (field: string, sortable: boolean = true) => {
    if (!sortable || !handleSort) return;

    let newDirection: SortDirection = "asc";

    if (sortConfig?.field === field) {
      if (sortConfig.direction === "asc") {
        newDirection = "desc";
      } else if (sortConfig.direction === "desc") {
        newDirection = null;
      }
    }

    setSortConfig(newDirection ? { field, direction: newDirection } : null);
    handleSort(field, newDirection);
  };

  return (
    <div
      className={`bg-[#F0F0F0] flex items-center h-9 py-1.5 pl-2.5 pr-2.5 rounded-lg w-full ${className}`}
    >
      <div className="flex items-center w-full gap-2">
        {headers.map((header) => {
          const isActive = sortConfig && sortConfig.field === header.field;
          const sortIcon = isActive ? (
            sortConfig.direction === "asc" ? (
              <RiArrowDownFill size={14} color="#005FFF" />
            ) : sortConfig.direction === "desc" ? (
              <RiArrowUpFill size={14} color="#005FFF" />
            ) : null
          ) : null;

          const isSortable =
            header.sortable !== false &&
            header.type !== "checkbox" &&
            header.type !== "actions";

          return (
            <div
              key={header.field}
              className={`relative flex overflow-hidden ${header.type === "actions" ? "flex-shrink-0" : ""}`}
              style={{ width: header.width }}
            >
              <div className="flex items-center w-full">
                {header.type === "checkbox" ? (
                  <div>
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      onChange={(e) => handleBulkAction?.(e)}
                      checked={isAllSelected}
                    />
                  </div>
                ) : header.type === "actions" ? (
                  <div className="text-black text-xs font-medium truncate overflow-hidden text-ellipsis whitespace-nowrap">
                    {header.label}
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-1 w-full ${
                      isSortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => handleHeaderClick(header.field, isSortable)}
                    title={header.tooltip || header.label}
                  >
                    <div className="text-black text-xs font-medium truncate flex items-center gap-1">
                      <span>{header.label}</span>
                      {isSortable && (
                        <span className="flex items-center flex-shrink-0">
                          {sortIcon || (
                            <RiArrowDownFill size={14} color="#9CA3AF" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

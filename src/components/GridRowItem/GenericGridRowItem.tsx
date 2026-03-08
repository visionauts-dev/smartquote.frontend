import React from "react";

export interface ColumnConfig<T = Record<string, unknown>> {
  field: string;
  width: string;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface ActionButton<T = Record<string, unknown>> {
  icon: React.ReactNode;
  onClick: (item: T) => void;
  title?: string;
  disabled?: boolean;
  className?: string;
}

interface GenericGridRowItemProps<T = Record<string, unknown>> {
  item: T;
  columns: ColumnConfig<T>[];
  actions?: ActionButton<T>[];
  actionsWidth?: string;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onCheckboxChange?: (item: T, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick?: (item: T) => void;
  onRowDoubleClick?: (item: T) => void;
  className?: string;
  indicatorColor?: string;
  showIndicator?: boolean;
  checkboxDisabled?: boolean;
}

export const GenericGridRowItem = ({
  item,
  columns,
  actions,
  actionsWidth = "15%",
  showCheckbox = false,
  isSelected = false,
  onCheckboxChange,
  onRowClick,
  onRowDoubleClick,
  className = "",
  indicatorColor,
  showIndicator = false,
  checkboxDisabled = false,
}: GenericGridRowItemProps) => {
  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const handleRowDoubleClick = () => {
    if (onRowDoubleClick) {
      onRowDoubleClick(item);
    }
  };

  return (
    <div
      className={`bg-white w-full flex items-center h-12 py-1.5 pr-2.5 pl-2.5 text-xs text-label-foreground hover:bg-gray-50 border-b border-[#ddd] ${
        onRowClick || onRowDoubleClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
    >
      <div className="flex flex-1 items-center gap-2">
        {/* Indicator */}
        {showIndicator && (
          <div className="flex items-center w-[2%] overflow-hidden">
            <div
              className={`w-2 h-2 ${indicatorColor || "bg-gray-300"} rounded-full flex items-center justify-center`}
            >
              <span className="text-white text-xs"></span>
            </div>
          </div>
        )}

        {/* Checkbox */}
        {showCheckbox && (
          <div className="flex items-center w-[2%] overflow-hidden">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(event) => onCheckboxChange?.(item, event)}
              disabled={checkboxDisabled}
            />
          </div>
        )}

        {/* Dynamic Columns */}
        {columns.map((column, index) => (
          <div
            key={column.field || index}
            className="flex items-center overflow-hidden truncate"
            style={{ width: column.width }}
          >
            {column.render
              ? column.render(
                  (item as Record<string, unknown>)[column.field],
                  item,
                )
              : String((item as Record<string, unknown>)[column.field] ?? "")}
          </div>
        ))}

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <div
            className="flex items-center flex-shrink-0"
            style={{ width: actionsWidth }}
          >
            <div className="flex gap-3 items-center">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`text-xs border-[#1852b8] ${action.className || ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(item);
                  }}
                  title={action.title}
                  disabled={action.disabled}
                >
                  <div className="flex items-center gap-1">
                    {action.icon}
                    <span className="text-[#1852b8]">{action.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

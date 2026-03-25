import type { GenericHeaderConfig } from "../grid/GridHeader";

interface GenericGridSkeletonProps {
  headers: GenericHeaderConfig[];
  rowCount?: number;
  showCheckbox?: boolean;
  showIndicator?: boolean;
}

export const GenericGridSkeleton = ({
  headers,
  rowCount = 15,
  showCheckbox = false,
  showIndicator = false,
}: GenericGridSkeletonProps) => {
  return (
    <div className="w-full space-y-2 pt-2 pl-2">
      {Array.from({ length: rowCount }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-2 w-full h-8">
          {/* Indicator skeleton */}
          {showIndicator && (
            <div
              className="bg-gray-200 rounded-full animate-pulse shrink-0"
              style={{ width: "8px", height: "8px" }}
            ></div>
          )}

          {/* Checkbox skeleton */}
          {showCheckbox && (
            <div
              className="bg-gray-200 rounded animate-pulse shrink-0"
              style={{ width: "16px", height: "16px" }}
            ></div>
          )}

          {/* Column skeletons based on headers */
          {headers.map((header, index) => {
            if (header.type === "checkbox") {
              return (
                <div
                  key={index + "-" + header.field}
                  className="bg-gray-200 rounded animate-pulse shrink-0"
                  style={{ width: "16px", height: "16px" }}
                ></div>
              );
            } else if (header.type === "actions") {
              return (
                <div
                  key={index + "-" + header.field}
                  className="flex items-center gap-3"
                  style={{ width: header.width }}
                >
                  <div className="w-16 h-7 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-7 bg-gray-200 rounded animate-pulse"></div>
                </div>
              );
            } else {
              return (
                <div
                  key={index + "-" + header.field}
                  className="bg-gray-200 animate-pulse rounded h-4"
                  style={{ width: header.width }}
                ></div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

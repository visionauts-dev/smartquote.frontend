/**
 * Status filter buckets - clickable filters with outline/filled variants
 */

import React from 'react';

export type StatusBucketVariant = 'outline' | 'filled';

export interface StatusBucket {
  key: string;
  label: string;
  count: number;
  /** Tailwind classes when inactive - outline: border+text, filled: bg+text */
  outlineClass: string;
  /** Tailwind classes when active - filled background */
  filledClass: string;
}

export interface StatusFilterBucketsProps {
  buckets: StatusBucket[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
  /** Default variant when inactive: outline (border) or filled (subtle bg) */
  variant?: StatusBucketVariant;
  className?: string;
}

export const StatusFilterBuckets: React.FC<StatusFilterBucketsProps> = ({
  buckets,
  activeKey,
  onSelect,
  variant = 'outline',
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-1 lg:gap-2 ${className}`}>
      {buckets.map((bucket) => {
        const isActive = activeKey === bucket.key;
        return (
          <button
            key={bucket.key}
            type="button"
            onClick={() => onSelect(isActive ? null : bucket.key)}
            className={`
              px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition whitespace-nowrap
              ${isActive
                ? `${bucket.filledClass} text-white border-transparent`
                : variant === 'outline'
                  ? `bg-white border-2 ${bucket.outlineClass} hover:opacity-90`
                  : `bg-white/80 ${bucket.outlineClass} hover:bg-white`
              }
            `}
          >
            {bucket.label} {bucket.count}
          </button>
        );
      })}
    </div>
  );
};

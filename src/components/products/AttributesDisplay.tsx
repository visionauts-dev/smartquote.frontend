/**
 * Attributes Display Component
 * Shows product attributes in a clean, badge-like format
 */

import React from 'react';
import { getAttributeBadges, formatAttributesAsText } from '../../utils/attributesFormatter';

interface AttributesDisplayProps {
  attributes: string | null | undefined;
  maxBadges?: number;
  compact?: boolean;
}

export const AttributesDisplay: React.FC<AttributesDisplayProps> = ({
  attributes,
  maxBadges = 2,
  compact = false,
}) => {
  const badges = getAttributeBadges(attributes);

  if (badges.length === 0) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  if (compact) {
    // Show as text: "Color: Black, Size: Large"
    return (
      <span className="text-sm text-gray-700 line-clamp-2" title={formatAttributesAsText(attributes)}>
        {formatAttributesAsText(attributes)}
      </span>
    );
  }

  // Show visible badges + count if more
  const visibleBadges = badges.slice(0, maxBadges);
  const hiddenCount = Math.max(0, badges.length - maxBadges);

  return (
    <div className="flex flex-wrap gap-2">
      {visibleBadges.map((badge, idx) => (
        <span
          key={idx}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            background: '#e0e7ff',
            color: '#3730a3',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
          }}
          title={`${badge.label}: ${badge.value}`}
        >
          <span style={{ fontWeight: '600' }}>{badge.label}:</span>
          <span>{badge.value}</span>
        </span>
      ))}
      {hiddenCount > 0 && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            background: '#f3f4f6',
            color: '#6b7280',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
          }}
          title={formatAttributesAsText(attributes)}
        >
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
};

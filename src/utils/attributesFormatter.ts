/**
 * Attributes Formatter Utility
 * Parses and formats product attributes for display
 */

export interface ParsedAttribute {
  key: string;
  value: string;
}

/**
 * Parse JSON attributes string into key-value pairs
 */
export const parseAttributes = (attributesStr: string | null | undefined): ParsedAttribute[] => {
  if (!attributesStr) return [];

  try {
    // Try to parse as JSON object
    const parsed = JSON.parse(attributesStr);
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    }
  } catch {
    // If JSON parse fails, try comma-separated key:value format
    // e.g., "color:black,size:large"
    try {
      const pairs = attributesStr.split(',').map((pair) => pair.trim());
      return pairs
        .filter((pair) => pair.includes(':'))
        .map((pair) => {
          const [key, value] = pair.split(':').map((s) => s.trim());
          return { key, value };
        });
    } catch {
      return [];
    }
  }

  return [];
};

/**
 * Format attributes as a readable string (e.g., "Color: Black, Size: Large")
 */
export const formatAttributesAsText = (attributesStr: string | null | undefined): string => {
  const parsed = parseAttributes(attributesStr);
  if (parsed.length === 0) return '-';

  return parsed
    .map(({ key, value }) => `${capitalize(key)}: ${capitalize(value)}`)
    .join(', ');
};

/**
 * Get formatted attributes with badges
 */
export const getAttributeBadges = (attributesStr: string | null | undefined): Array<{ label: string; value: string }> => {
  return parseAttributes(attributesStr).map(({ key, value }) => ({
    label: capitalize(key),
    value: capitalize(value),
  }));
};

/**
 * Capitalize first letter
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

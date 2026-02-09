/**
 * Convert skill target_level to percentage for radar chart.
 * Basic=33%, Pro=66%, AI-Native=100%
 */
export const levelToPercent = (level: number): number => {
  if (level === 1) return 33;
  if (level === 2) return 66;
  return 100;
};

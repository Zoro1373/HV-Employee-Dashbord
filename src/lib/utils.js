/**
 * Utility helper for merging class names (standard shadcn cn utility)
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

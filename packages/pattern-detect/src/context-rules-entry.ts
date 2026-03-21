/**
 * Focused entry point for context rules.
 * Import from this module if you only need context rule definitions.
 */
export {
  calculateSeverity,
  getSeverityLabel,
  filterBySeverity,
  getSeverityThreshold,
} from './context-rules';
export type { ContextRule } from './context-rules';

import { ToolRegistry } from '@aiready/core';
import { TESTABILITY_PROVIDER } from './provider';

// Register with global registry
ToolRegistry.register(TESTABILITY_PROVIDER);

export * from './types';
export * from './analyzer';
export { TESTABILITY_PROVIDER };
export { calculateTestabilityIndex as calculateTestabilityScore } from '@aiready/core';

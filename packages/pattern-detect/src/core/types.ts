import {
  Severity,
  FileContent,
  CodeBlock as CoreCodeBlock,
} from '@aiready/core';

export type { FileContent };

export type PatternType =
  | 'api-handler'
  | 'validator'
  | 'utility'
  | 'class-method'
  | 'component'
  | 'function'
  | 'unknown';

// Use canonical CodeBlock from core, with PatternType narrowing
export type CodeBlock = CoreCodeBlock & {
  patternType: PatternType | string;
};

export interface DuplicatePattern {
  file1: string;
  line1: number;
  endLine1: number;
  file2: string;
  line2: number;
  endLine2: number;
  code1: string;
  code2: string;
  similarity: number;
  confidence: number; // 0-1, heuristic confidence score
  patternType: PatternType;
  tokenCost: number;
  severity: Severity;
  reason?: string;
  suggestion?: string;
  matchedRule?: string;
}

export interface DetectionOptions {
  minSimilarity: number;
  minLines: number;
  batchSize: number;
  approx: boolean;
  minSharedTokens: number;
  maxCandidatesPerBlock: number;
  streamResults: boolean;
  excludePatterns?: string[];
  confidenceThreshold?: number;
  ignoreWhitelist?: string[];
  onProgress?: (processed: number, total: number, message: string) => void;
}

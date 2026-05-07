import type { DiagramType } from '@/components/LeafDiagram';

export type KeyTerminal = string | string[];

export type KeyChoice = {
  label: string;
  hint?: string;
  diagram?: DiagramType;
  next: KeyTerminal;
};

export type KeyNode = {
  id: string;
  question: string;
  context?: string;
  a: KeyChoice;
  b: KeyChoice;
};

export type KeyPathStep = {
  nodeId: string;
  choice: 'a' | 'b';
};

export type IdentificationResult = {
  plantIds: string[];
  keyPath: KeyPathStep[];
};

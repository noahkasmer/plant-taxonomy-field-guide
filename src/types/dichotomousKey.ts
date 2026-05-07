export type KeyTerminal = string | string[];

export type KeyChoice = {
  label: string;
  next: KeyTerminal;
};

export type KeyNode = {
  id: string;
  question: string;
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

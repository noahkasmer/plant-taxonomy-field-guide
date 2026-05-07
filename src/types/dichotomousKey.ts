export type KeyChoice = {
  label: string;
  // string = next branch node ID; string[] = terminal plant IDs
  next: string | string[];
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

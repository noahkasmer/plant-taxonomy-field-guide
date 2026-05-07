import { keyNodes, ROOT_NODE_ID } from '@/data/dichotomousKey';
import type { KeyChoice, KeyNode } from '@/types/dichotomousKey';

export type GuidedKeySeasonBranch = 'spring' | 'summer-fall';

export type KeyChoiceResolution =
  | {
      kind: 'node';
      nodeId: string;
      node: KeyNode;
    }
  | {
      kind: 'result';
      plantIds: string[];
    };

const springKeyMonthIndexes = new Set([2, 3, 4, 5]);

export function buildKeyNodeMap(nodes: KeyNode[] = keyNodes) {
  const nodeMap = new Map<string, KeyNode>();

  for (const node of nodes) {
    if (nodeMap.has(node.id)) {
      throw new Error(`Duplicate key node id: ${node.id}`);
    }

    nodeMap.set(node.id, node);
  }

  return nodeMap;
}

export function getRootKeyNode(nodeMap = buildKeyNodeMap()) {
  const rootNode = nodeMap.get(ROOT_NODE_ID);

  if (!rootNode) {
    throw new Error(`Root key node is missing: ${ROOT_NODE_ID}`);
  }

  return rootNode;
}

export function getSuggestedSeasonBranch(date = new Date()): GuidedKeySeasonBranch {
  return springKeyMonthIndexes.has(date.getMonth()) ? 'spring' : 'summer-fall';
}

export function getSeasonChoiceForBranch(branch: GuidedKeySeasonBranch) {
  return branch === 'spring' ? 'a' : 'b';
}

export function resolveKeyChoice(
  choice: KeyChoice,
  nodeMap = buildKeyNodeMap()
): KeyChoiceResolution {
  if (Array.isArray(choice.next)) {
    return {
      kind: 'result',
      plantIds: [...choice.next],
    };
  }

  const nextNode = nodeMap.get(choice.next);
  if (nextNode) {
    return {
      kind: 'node',
      nodeId: nextNode.id,
      node: nextNode,
    };
  }

  return {
    kind: 'result',
    plantIds: [choice.next],
  };
}

export function collectReachableNodeIds(
  rootId = ROOT_NODE_ID,
  nodeMap = buildKeyNodeMap()
) {
  const reachableNodeIds = new Set<string>();
  const queue = [rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || reachableNodeIds.has(nodeId)) {
      continue;
    }

    const node = nodeMap.get(nodeId);
    if (!node) {
      throw new Error(`Unknown key node encountered while traversing: ${nodeId}`);
    }

    reachableNodeIds.add(nodeId);

    for (const choice of [node.a, node.b]) {
      const resolution = resolveKeyChoice(choice, nodeMap);
      if (resolution.kind === 'node' && !reachableNodeIds.has(resolution.nodeId)) {
        queue.push(resolution.nodeId);
      }
    }
  }

  return reachableNodeIds;
}

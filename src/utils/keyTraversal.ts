import { keyNodes, ROOT_NODE_ID } from '@/data/dichotomousKey';
import type { KeyNode } from '@/types/dichotomousKey';

function getReachablePlants(next: string | string[], nodes: KeyNode[]): Set<string> {
  if (Array.isArray(next)) return new Set(next);
  const node = nodes.find((n) => n.id === next);
  if (!node) return new Set();
  return new Set([
    ...getReachablePlants(node.a.next, nodes),
    ...getReachablePlants(node.b.next, nodes),
  ]);
}

/**
 * Returns the ID of the first key node that actually differentiates between
 * the given plant IDs. Skips ancestor nodes where all target plants fall on
 * the same side (no disambiguation needed at that split).
 */
export function findSubKeyEntry(targetIds: string[]): string {
  function walk(nodeId: string): string {
    const node = keyNodes.find((n) => n.id === nodeId);
    if (!node) return nodeId;

    const aReachable = getReachablePlants(node.a.next, keyNodes);
    const bReachable = getReachablePlants(node.b.next, keyNodes);

    const aMatches = targetIds.filter((id) => aReachable.has(id));
    const bMatches = targetIds.filter((id) => bReachable.has(id));

    if (aMatches.length > 0 && bMatches.length > 0) {
      return nodeId;
    }
    if (aMatches.length > 0 && !Array.isArray(node.a.next)) {
      return walk(node.a.next);
    }
    if (bMatches.length > 0 && !Array.isArray(node.b.next)) {
      return walk(node.b.next);
    }
    return nodeId;
  }

  return walk(ROOT_NODE_ID);
}

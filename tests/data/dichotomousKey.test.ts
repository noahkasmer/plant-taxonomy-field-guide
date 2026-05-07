import test from 'node:test';
import assert from 'node:assert/strict';

import { keyNodes, ROOT_NODE_ID } from '@/data/dichotomousKey';
import { plants } from '@/data/plants';
import {
  buildKeyNodeMap,
  collectReachableNodeIds,
  getSeasonChoiceForBranch,
  getSuggestedSeasonBranch,
  resolveKeyChoice,
} from '@/services/fieldKeyService';

test('dichotomous key references only seeded plant ids and reachable node ids', () => {
  const nodeIds = new Set(keyNodes.map((node) => node.id));
  const plantIds = new Set(plants.map((plant) => plant.id));

  assert.ok(nodeIds.has(ROOT_NODE_ID), 'root node must exist');
  const nodeMap = buildKeyNodeMap(keyNodes);

  for (const node of keyNodes) {
    for (const choice of [node.a, node.b]) {
      const resolution = resolveKeyChoice(choice, nodeMap);
      if (resolution.kind === 'result') {
        assert.ok(
          resolution.plantIds.length > 0,
          `terminal choice on ${node.id} must list at least one plant`
        );
        for (const plantId of resolution.plantIds) {
          assert.ok(plantIds.has(plantId), `unknown plant id in key: ${plantId}`);
        }
      } else {
        assert.ok(nodeIds.has(resolution.nodeId), `unknown next node in key: ${resolution.nodeId}`);
      }
    }
  }
});

test('every key node is reachable from the root node', () => {
  const nodeMap = buildKeyNodeMap(keyNodes);
  const reachableNodeIds = collectReachableNodeIds(ROOT_NODE_ID, nodeMap);

  assert.equal(reachableNodeIds.size, nodeMap.size);
  for (const nodeId of nodeMap.keys()) {
    assert.ok(reachableNodeIds.has(nodeId), `unreachable key node: ${nodeId}`);
  }
});

test('field key season helper maps months to the current key branches', () => {
  assert.equal(getSuggestedSeasonBranch(new Date('2026-05-10T12:00:00-05:00')), 'spring');
  assert.equal(getSeasonChoiceForBranch('spring'), 'a');

  assert.equal(
    getSuggestedSeasonBranch(new Date('2026-08-10T12:00:00-05:00')),
    'summer-fall'
  );
  assert.equal(getSeasonChoiceForBranch('summer-fall'), 'b');
});

test('key choice resolution distinguishes node transitions from result terminals', () => {
  const nodeMap = buildKeyNodeMap(keyNodes);
  const rootNode = nodeMap.get(ROOT_NODE_ID);
  assert.ok(rootNode, 'root node should be present');

  const bloomingResolution = resolveKeyChoice(rootNode.a, nodeMap);
  assert.equal(bloomingResolution.kind, 'node');
  if (bloomingResolution.kind === 'node') {
    assert.equal(bloomingResolution.nodeId, 'q-bloom-season');
  }

  const mayappleNode = nodeMap.get('q-spring-white-structure');
  assert.ok(mayappleNode, 'terminal-result node should be present');

  const terminalResolution = resolveKeyChoice(mayappleNode.a, nodeMap);
  assert.equal(terminalResolution.kind, 'result');
  if (terminalResolution.kind === 'result') {
    assert.deepEqual(terminalResolution.plantIds, ['mayapple']);
  }
});

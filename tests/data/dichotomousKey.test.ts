import test from 'node:test';
import assert from 'node:assert/strict';

import { keyNodes, ROOT_NODE_ID } from '@/data/dichotomousKey';
import { plants } from '@/data/plants';

test('dichotomous key references only seeded plant ids and reachable node ids', () => {
  const nodeIds = new Set(keyNodes.map((node) => node.id));
  const plantIds = new Set(plants.map((plant) => plant.id));

  assert.ok(nodeIds.has(ROOT_NODE_ID), 'root node must exist');

  for (const node of keyNodes) {
    for (const choice of [node.a, node.b]) {
      if (Array.isArray(choice.next)) {
        assert.ok(choice.next.length > 0, `terminal choice on ${node.id} must list at least one plant`);
        for (const plantId of choice.next) {
          assert.ok(plantIds.has(plantId), `unknown plant id in key: ${plantId}`);
        }
      } else {
        assert.ok(nodeIds.has(choice.next), `unknown next node in key: ${choice.next}`);
      }
    }
  }
});

# 111. 二叉树的最小深度

## 题目

> [中文站](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/) [国际站](https://leetcode.com/problems/minimum-depth-of-binary-tree/)

给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

**说明:**  叶子节点是指没有子节点的节点。

**示例：**

给定二叉树 `[3,9,20,null,null,15,7]`

```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最小深度  2 。

## 解法

**节点数据结构：**

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
```

### 深度优先遍历

> time: O(n), space: O(height)

一个结点到叶子节点的最小深度为其左右子节点到各自叶子节点的最小深度中小的那个 +1，不过这里有一个注意点，若一个节点只有左或右子节点，则往有子节点的方向统计，不会将不存在的节点统计为 0。

```typescript
function minDepth(root: TreeNode | null): number {
  if (!root) return 0;
  if (!root.left && !root.right) return 1;
  let min = Infinity;
  if (root.left) min = Math.min(min, minDepth(root.left));
  if (root.right) min = Math.min(min, minDepth(root.right));
  return min + 1;
}
```

当然，也可用一个变量维护最大深度，再通过深度优先遍历，对整棵树遍历的同时，修改最大深度，最终得出结果。

### 广度优先遍历

> time: O(n), space: O(n)

由于广度优先遍历是从上往下一层层遍历，那么在遇到第一个叶子节点时即可提前退出，无需遍历整棵树。

```typescript
function minDepth(root: TreeNode | null): number {
  if (!root) return 0;
  let queue: TreeNode[] = [root];
  let level = 0;
  while (queue.length) {
    level++;
    const nodes = [];
    for (const n of queue) {
      if (!n.left && !n.right) return level;
      if (n.left) nodes.push(n.left);
      if (n.right) nodes.push(n.right);
    }
    queue = nodes;
  }
  return level;
}
```
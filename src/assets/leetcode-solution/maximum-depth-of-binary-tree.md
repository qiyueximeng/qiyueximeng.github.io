---
title: "二叉树的最大深度"
date: "2022-03-08"
desc: "二叉树的最大深度"
---

# 104. 二叉树的最大深度

## 题目

> [中文站](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/) [国际站](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

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

返回它的最大深度  3 。

## 解法

**节点数据结构：**

```ts
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

一个结点到叶子节点的最大深度为其左右子节点到各自叶子节点的最大深度中大的那个 +1。

对于已经找到最进子问题的题目，都可通过递归快速解决。

```ts
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```

当然，也可用一个变量维护最大深度，再通过深度优先遍历，对整棵树遍历的同时，修改最大深度，最终得出结果。

### 广度优先遍历

> time: O(n), space: O(n)

可通过层序遍历对整棵树进行遍历，遍历到最底层时即为最大深度。

```ts
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  let queue: TreeNode[] = [root];
  let level = 0;
  while (queue.length) {
    level++;
    const nodes: TreeNode[] = [];
    for (const n of queue) {
      if (n.left) nodes.push(n.left);
      if (n.right) nodes.push(n.right);
    }
    queue = nodes;
  }
  return level;
}
```
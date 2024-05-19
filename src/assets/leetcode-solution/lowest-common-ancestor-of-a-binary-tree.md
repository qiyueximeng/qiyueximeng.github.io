---
title: "二叉树的最近公共祖先"
date: "2022-03-13"
desc: "二叉树的最近公共祖先"
---

# 236. 二叉树的最近公共祖先

## 题目

> [中文站](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/) [国际站](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_236_image_1.png)

```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出：3
解释：节点 5 和节点 1 的最近公共祖先是节点 3 。
```

**示例 2：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_236_image_1.png)

```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出：5
解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。
```

**示例 3：**

```
输入：root = [1,2], p = 1, q = 2
输出：1
```

**提示：**

- 所有 `Node.val` 互不相同
- 树中节点数目在范围 `[2, 10^5]` 内
- `-10^9 <= Node.val <= 10^9`
- `p != q`
- `p` 和 `q` 均存在于给定的二叉树中

## 解法

```
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

根据题意先理清楚几个定义：

- 若节点 `p` 在 `root` 的子树中，或 `p === root`，则 `root` 为 `p` 的祖先节点
- 若节点 `root` 同时对 `p` 和 `q` 都满足祖先节点的定义，则 `root` 为 `p` 和 `q` 的公共祖先节点
- 若节点 `root` 是 `p` 和 `q` 的公共祖先节点，但其左右子节点都不是，则 `roor` 为 `p` 和 `q` 的最近公共祖先节点

根据定义，`root` 为 `p` 和 `q` 的最近公共祖先节点，则为以下情况之一：

- `p` 和 `q` 分别在 `root` 的左右子树中
- `root === p`，`q` 在 `root` 任一子树中
- `root === q`，`p` 在 `root` 任一子树中

### 深度优先遍历

> time: O(n), space: O(n)

通过深度优先前序遍历寻找 `p` 和 `q` 的最近公共祖先节点，解析如下：

终止条件：

- 当前节点为 null 时，返回 null
- 当前节点为 `p` 或 `q` 时，返回当前节点

递推：

- 向左子节点递推，将结果存入 `left`
- 向右子节点递推，将结果存入 `right`

返回：

- 当 `left` 和 `right` 同时为 `null`，则当前节点的左右子节点都不包含 `p` 或 `q`，说明当前节点也不包含，返回 `null`。
- 当 `left` 和 `right` 都不为 `null`，则 `p` 和 `q` 分别在当前节点的左右子树中，当前节点即为最近公共祖先节点，返回当前节点。
- 当 `left` 为空，`right` 不为空时，说明 `p` 和 `q` 都不在左子树中，返回 `right`，`right` 可能为：
  - 若 `p` 或 `q` 任一在右子树中，`right` 为 `p` 或 `q`（详见终止条件）
  - 若 `p` 或 `q` 都在右子树中，`right` 为最近公共祖先节点
- 当 `left` 不为空，`right` 为空时，返回 `left`（详见上一条）

```typescript
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null
): TreeNode | null {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (!left) return right;
  if (!right) return left;
  return root;
}
```

### 存储父节点

> time: O(n), space: O(n)

`p` 和 `q` 的最近公共祖先节点，可以简单的从 `p` 和 `q` 往上走，第一次相遇的节点即为最近公共祖先节点。

由于二叉树只有从父节点向左右子节点的索引，没有从子向父的索引，所以我们需要进行一次遍历来存储每个结点的父节点来实现关联，具体步骤为：

- 进行树遍历，通过哈希表存储每个节点及其父节点的关联关系
- 从 `p` 不断的往上找，直到根节点，通过集合存储走过的路径
- 从 `q` 不断的往上找，第一个出现在 `p` 的路径集合中的节点即为最近公共祖先节点

```typescript
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null
): TreeNode | null {
  const map = new Map<TreeNode, TreeNode | null>();
  const set = new Set<TreeNode>();
  dfs(root);
  while (p) {
    set.add(p);
    p = map.get(p);
  }
  while (q) {
    if (set.has(q)) return q;
    q = map.get(q);
  }
  return null;
  function dfs(node: TreeNode | null) {
    if (node.left) {
      map.set(node.left, node);
      dfs(node.left);
    }
    if (node.right) {
      map.set(node.right, node);
      dfs(node.right);
    }
  }
}
```

### 记录遍历路径

`p` 和 `q` 节点的公共最近祖先节点是离两个结点最近的公共祖先节点，而我们可以通过记录从 `root` 到 `p` 和 `q` 节点的路径，路径上相同的节点即为 `p` 和 `q` 的公共祖先节点，而公共最近祖先节点为最后一个相同的路径节点。

- 对树做深度优先前序遍历，并实时记录根节点到遍历到的节点的路径
- 在遍历到 `p` 和 `q` 节点时，将节点路径进行存储，并在两个结点都遍历到后终止遍历，无需遍历完整棵树
- 对比 `p` 和 `q` 的路径，找到最后一个相同节点

```typescript
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null
): TreeNode | null {
  const addr: TreeNode[] = [];
  let pAddr: TreeNode[] = [];
  let qAddr: TreeNode[] = [];
  helper(root);
  const n = Math.min(pAddr.length, qAddr.length);
  let node: TreeNode;
  for (let i = 0; i < n; i++) {
    if (pAddr[i] !== qAddr[i]) break;
    node = pAddr[i];
  }
  return node;
  function helper(node: TreeNode | null) {
    if (!node || (pAddr.length && qAddr.length)) return;

    addr.push(node);
    if (node === p) {
      pAddr.push(...addr);
    }
    if (node === q) {
      qAddr.push(...addr);
    }
    helper(node.left);
    helper(node.right);
    addr.pop();
  }
}
```
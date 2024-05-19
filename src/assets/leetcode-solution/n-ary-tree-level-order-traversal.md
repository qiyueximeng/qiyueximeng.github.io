---
title: "N叉树的层序遍历"
date: "2022-03-05"
desc: "N叉树的层序遍历"
---

# 429. N叉树的层序遍历

## 题目

> [中文站](https://leetcode-cn.com/problems/n-ary-tree-level-order-traversal/) [国际站](https://leetcode.com/problems/n-ary-tree-level-order-traversal/)

给定一个 N 叉树，返回其节点值的  **层序**  遍历（即从左到右，逐层遍历）。

树的序列化输出是用层序遍历，每组子节点都由 null 值分隔（参见示例）。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_429_image_1.png)

```
输入：root = [1,null,3,2,4,null,5,6]
输出：[[1],[3,2,4],[5,6]]
```

**示例 2：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_429_image_2.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[[1],[2,3,4,5],[6,7,8,9,10],[11,12,13],[14]]
```

**提示：**

- 树的高度不会超过 `1000`
- 树的节点总数在 `[0, 10^4]` 之间

## 解法

```
/**
 * Definition for node.
 * class Node {
 *     val: number
 *     children: Node[]
 *     constructor(val?: number) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.children = []
 *     }
 * }
 */
```

### 递归 O(n)

层序遍历是按照每层归集节点，普通的递归方式不太适合将遍历的节点安层归类，此时如果要使用递归，需要在递归时多维护一个层级变量。

```typescript
function levelOrder(root: Node | null): number[][] {
  // 递归
  const result: number[][] = [];
  helper(root, 0);
  return result;

  function helper(node: Node | null, level: number) {
    if (!node) return;
    if (!result[level]) result[level] = [];
    result[level].push(node.val);
    for (const n of node.children) {
      helper(n, result, level + 1);
    }
  }
}
```

### 广度优先遍历 O(n)

由于层序遍历的要求是根据树的每一层进行遍历，所以此时用栈的方式维护节点将不再适合，可以考虑使用队列维护每一层待遍历节点，通过遍历和更新队列将每层节点值推入结果集。

- 创建一个队列用于维护每一层待遍历节点，初始队列中只有 root 节点。
- 在队列非空时不停循环，每次循环时队列中包含的都是待加入结果集的同一层节点，此时操作为：
  - 遍历队列中节点，加入当层子结果集，并将每个结点的子节点全部推入新的待遍历队列。
  - 若子结果集有数据，推入总结果集。
  - 将队列替换为新的待遍历队列。
- 循环完成后，返回总结果集。

```typescript
function levelOrder(root: Node | null): number[][] {
  const result: number[][] = [];
  if (!root) return result;

  let queue: Node[] = [root];
  while (queue.length) {
    const nodes: Node[] = [];
    const res: number[] = [];
    for (const n of queue) {
      res.push(n.val);
      nodes.push(...n.children);
    }
    if (res.length) result.push(res);
    queue = nodes;
  }
  return result;
}
```

### 队列 O(n)

层序遍历树在结构上是符合队列存储模式的，只要将遍历到的节点按照顺序插入队列末尾，就能根据层级从左到右的顺序遍历完一棵树，不过该题目要求将每层的节点规整到各自层级的数组中，则需要对遍历加以改造，每次从队列中推出节点时，只推出当层节点。

- 创建队列维护每层待遍历节点列表，初始只有 root。
- 队列不为空时不停循环：
  - 创建一个存储当前层节点的数组。
  - 此时队列中的节点都是同一层的节点，我们只需遍历当前队列元素节点个数的次数，就能完整的将当前层节点遍历完。
  - 在遍历当前层节点过程中，将每个遍历到的节点从队列中取出，填入当前层结果集，并将其子节点（下一层节点）推入队列末尾（不会被遍历到）。
  - 当前层节点遍历完成后，将当前层结果数组推入总结果集。
- 返回总结果集。

```typescript
function levelOrder(root: Node | null): number[][] {
  // 队列
  const result: number[][] = [];
  if (!root) return result;

  const queue: Node[] = [root];
  while (queue.length) {
    const res: number[] = [];
    const n = queue.length;
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      res.push(node.val);
      queue.push(...node.children);
    }
    result.push(res);
  }

  return result;
}
```
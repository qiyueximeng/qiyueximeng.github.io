---
title: "N 叉树的前序遍历"
date: "2022-03-05"
desc: "N 叉树的前序遍历"
---

# 589. N 叉树的前序遍历

## 题目

> [中文站](https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/) [国际站](https://leetcode.com/problems/n-ary-tree-preorder-traversal/)

给定一个 N 叉树的根节点 `root` ，返回其节点值的  **前序**  遍历。

n 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 `null` 分隔（请参见示例）。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_589_image_1.png)

```
输入：root = [1,null,3,2,4,null,5,6]
输出：[1,3,5,6,2,4]
```

**示例 2：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_589_image_2.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[1,2,3,6,7,11,14,4,8,12,5,9,13,10]
```

**提示：**

- 树中节点数目在范围 `[0, 10^4]` 内
- `-100 <= Node.val <= 10^4`
- n 叉树的高度小于或等于 `1000`

**进阶：** 递归算法很简单，你可以通过迭代算法完成吗？

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

N 叉树的前序遍历顺序为先将父节点入结果集，再依次将所有的子节点入结果集，对子树也遵循这种规律，递归的方式天然满足这种树的遍历过程。

```typescript
function preorder(root: Node | null): number[] {
  const result: number[] = [];
  helper(root, result);
  return result;

  function helper(node: Node | null, res: number[]) {
    if (!node) return;
    res.push(node.val);
    for (const n of node.children) {
      helper(n, res);
    }
  }
}
```

### 栈迭代 + 类型区分 O(n)

相较于递归，该方式通过栈手动维护节点写入结果的顺序，由于前中后序遍历节点在栈中存储的顺序不一样，所以常规的节点存储方式无法区分节点是否访问过，故考虑通过不同的类型进行区分。

- 访问过的节点会将其值存入栈中，未访问过的节点则将节点本身存入栈中；
- 从栈内取出节点时，判断其类型，若为值则插入结果集，若为节点，则继续走遍历逻辑；
- 通过这种方式，可以达到前中后序遍历的代码逻辑基本一致。

```typescript
function preorder(root: Node | null): number[] {
  const result: number[] = [];
  if (!root) return result;
  const stack: (Node | number)[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (typeof node === "number") {
      result.push(node);
    } else {
      stack.push(...node.children.reverse(), node.val);
    }
  }
  return result;
}
```

### 栈迭代 + 指针 O(n)

- 通过栈维护待遍历的节点，通过不断移动 root 指针对树进行遍历。
- 在每次迭代中，若节点指针有值，则将值入结果集，再将其子节点倒序推入栈中。
- 若节点指针为空，则从栈顶取节点

```typescript
function preorder(root: Node | null): number[] {
  const result: number[] = [];
  const stack: Node[] = [];
  while (root || stack.length) {
    if (root) {
      result.push(root.val);
      stack.push(...root.children.reverse());
    }
    root = stack.pop();
  }
  return result;
}
```

### 栈迭代 O(n)

该方法仅通过栈维护遍历顺序，不适用于中序遍历。

```typescript
function preorder(root: Node | null): number[] {
  // 栈迭代
  const result: number[] = [];
  const stack: Node[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    result.push(node.val);
    stack.push(...node.children.reverse());
  }
  return result;
}
```
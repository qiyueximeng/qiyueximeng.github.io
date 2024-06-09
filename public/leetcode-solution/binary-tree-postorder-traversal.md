# 145. 二叉树后序遍历

## 题目

> [中文站](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/) [国际站](https://leetcode.com/problems/binary-tree-postorder-traversal/)

给定一个二叉树的根节点 `root` ，返回它的  **后序**  遍历。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_145_image_1.jpg)

```
输入：root = [1,null,2,3]
输出：[3,2,1]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

**提示：**

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

**进阶：** 递归算法很简单，你可以通过迭代算法完成吗？

## 解法

### 递归 O(n)

后序遍历的访问顺序为：左子节点-右子节点-父节点；而对左右子树的访问亦遵循上面的原则，而递归的方式天然满足这种树的遍历过程。

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;
  result.push(...postorderTraversal(root.left));
  result.push(...postorderTraversal(root.right));
  result.push(root.val);
  return result;
}
```

### 栈迭代 + 类型区分 O(n)

通过栈维护将值写入结果的顺序，由于前中后序遍历节点在栈中存储的顺序不一样，所以常规的节点存储方式无法区分节点是否访问过，故考虑通过不同的类型进行区分。

- 访问过的节点会将其值存入栈中，未访问过的节点则将节点本身存入栈中；
- 从栈内取出节点时，判断其类型，若为值则插入结果集，若为节点，则继续走遍历逻辑；
- 通过这种方式，可以达到前中后序遍历的代码逻辑基本一致。

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: (TreeNode | number | null)[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node === null) continue;
    if (typeof node === "number") {
      result.push(node);
    } else {
      stack.push(node.val, node.right, node.left);
    }
  }
  return result;
}
```

### 栈迭代 + 指针 O(n)

通过栈维护待遍历的节点，通过不断移动 root 指针对树进行遍历。
由于后续遍历的父节点需要留到最后访问，此时的栈不太好维护，可转换思维，以父节点-右子节点-左子节点这种类前序遍历的方式完成遍历，再将结果数组翻转即可。

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  while (root || stack.length) {
    while (root) {
      result.push(root.val);
      if (root.left) stack.push(root.left);
      root = root.right;
    }
    root = stack.pop();
  }
  return result.reverse();
}
```

### 栈迭代 O(n)

同样是根据前序遍历再翻转的思想，使用另一种前序遍历栈维护方法。

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: (TreeNode | null)[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    result.push(node.val);
    stack.push(node.left, node.right);
  }
  return result.reverse();
}
```

### Morris 遍历 O(n), space O(1)

后续遍历比较复杂，需要建立一个临时节点 dump，令其左子节点为 root，并且需要一个子过程，倒序输出某两个节点间路径上的各个节点。

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_145_image_2.jpeg)

**通用逻辑：**

1. 若当前节点左子节点为空，将当前节点切到右子节点。
2. 若当前节点左子节点不为空，找到其左子树的最右子节点：
   1. 若最右子节点的右子节点为空，将其右子节点与当前节点连接，将当前节点切到左子节点。
   2. 若最右子节点的右子节点为当前节点，将连接断开，倒序输出当前节点左子节点到其最右子节点路径上的所有节点，并将当前节点切到其右子节点。
3. 重复 1、2 直至遍历结束

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const dump = new TreeNode(-1, root);
  let p2: TreeNode | null;
  while (dump) {
    p2 = dump.left;
    if (!p2) {
      dump = dump.right;
      continue;
    }
    while (p2.right && p2.right !== dump) {
      p2 = p2.right;
    }
    if (p2.right) {
      p2.right = null;
      reverseNodes(dump.left, result);
      dump = dump.right;
    } else {
      p2.right = dump;
      dump = dump.left;
    }
  }
  return result;
}

function reverseNodes(root: TreeNode, result: number[]) {
  let count = 0;
  while (root) {
    count++;
    result.push(root.val);
    root = root.right;
  }
  let l = result.length - count;
  let r = result.length - 1;
  while (l < r) {
    [result[l++], result[r--]] = [result[r], result[l]];
  }
}
```

以下为无需哨兵结点的方案，需要在最后将 root 到其最右子节点的路径节点输入到结果集。

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  let p1 = root;
  let p2: TreeNode | null;
  while (p1) {
    p2 = p1.left;
    if (!p2) {
      p1 = p1.right;
      continue;
    }
    while (p2.right && p2.right !== p1) {
      p2 = p2.right;
    }
    if (p2.right) {
      p2.right = null;
      reverseNodes(p1.left, result);
      p1 = p1.right;
    } else {
      p2.right = p1;
      p1 = p1.left;
    }
  }
  reverseNodes(root, result);
  return result;
}

function reverseNodes(root: TreeNode, result: number[]) {
  let count = 0;
  while (root) {
    count++;
    result.push(root.val);
    root = root.right;
  }
  let l = result.length - count;
  let r = result.length - 1;
  while (l < r) {
    [result[l++], result[r--]] = [result[r], result[l]];
  }
}
```
# 144. 二叉树前序遍历

## 题目

> [中文站](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/) [国际站](https://leetcode.com/problems/binary-tree-preorder-traversal/)

给你二叉树的根节点 `root` ，返回它节点值的  **前序**  遍历。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_144_image_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,2,3]
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

**示例 4：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_144_image_2.jpg)

```
输入：root = [1,2]
输出：[1,2]
```

**示例 5：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_144_image_3.jpg)

```
输入：root = [1,null,2]
输出：[1,2]
```

**提示：**

- 树中节点数目在范围 [0, 100] 内
- -100 <= Node.val <= 100

**进阶：** 递归算法很简单，你可以通过迭代算法完成吗？

## 解法

### 递归 O(n)

前序遍历的访问顺序为：父节点-左子树-右子树；而对左右子树的访问亦遵循上面的原则，而递归的方式天然满足这种树的遍历过程。

```typescript
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;

  result.push(root.val);
  result.push(...preorderTraversal(root.left));
  result.push(...preorderTraversal(root.right));
  return result;
}
```

### 栈迭代 + 类型区分 O(n)

通过栈维护将值写入结果的顺序，由于前中后序遍历节点在栈中存储的顺序不一样，所以常规的节点存储方式无法区分节点是否访问过，故考虑通过不同的类型进行区分。

- 访问过的节点会将其值存入栈中，未访问过的节点则将节点本身存入栈中；
- 从栈内取出节点时，判断其类型，若为值则插入结果集，若为节点，则继续走遍历逻辑；
- 通过这种方式，可以达到前中后序遍历的代码逻辑基本一致。

```typescript
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: (TreeNode | number | null)[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node == null) continue;
    if (typeof node === "number") {
      result.push(node);
    } else {
      stack.push(node.right, node.left, node.val);
    }
  }
  return result;
}
```

### 栈迭代 + 指针 O(n)

通过栈维护待遍历的节点，并通过不断移动 root 指针对树进行遍历。

- 前序遍历的顺序为 父-左-又，则遍历到当前节点时，先将值入结果集，再往左遍历，而其右节点则等待左子树遍历完成后才回来遍历
- 指针和栈任一不为空时，持续遍历
- 若指针不为空，进入二次迭代：
  - 将其值如结果集
  - 若存在右子节点，则将右子节点入栈
  - 将指针切到左子节点
- 出了二次迭代时，说明此时指针为空，已遍历完左子树，

```typescript
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  while (root || stack.length) {
    while (root) {
      result.push(root.val);
      if (root.right) stack.push(root.right);
      root = root.left;
    }
    root = stack.pop();
  }
  return result;
}
```

```typescript
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  while (root) {
    result.push(root.val);
    if (root.right) stack.push(root.right);
    root = root.left;
    if (!root && stack.length) {
      root = stack.pop();
    }
  }
  return result;
}
```

### 栈迭代 O(n)

由于前序遍历父节点会先入结果集，所以在遍历到节点时，先将其入结果集，然后按先右后左的顺序将子节点入结果集，以完成整棵树的遍历。

```typescript
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: (TreeNode | null)[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node == null) continue;
    result.push(node.val);
    stack.push(node.right, node.left);
  }
  return result;
}
```

### Morris 遍历 O(n), space O(1)

无需额外维护栈空间，只占用常量空间。其核心思想是利用大量空闲指针，实现空间开销的极限缩减。整体思路是以某个根节点开始，找到其左子树的最右侧节点，将最右侧节点的右指针与根节点连接，以达到指针可以完整的遍历完整棵树的目的。

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_144_image_4.png)

**通用逻辑：**

1. 维护当前节点及其左子树的最右子节点的指针。
2. 若当前节点左子节点为空，则表示无需往左侧遍历了，将当前节点切到其右子节点进行遍历。
3. 若当前节点的左子节点不为空，则找到其左子树的最右侧节点：
   1. 若最右侧节点的右子节点为空，则将其右子节点与当前节点连接，再将当前节点切换到左子节点进行遍历。
   2. 若最右侧节点的右子节点为当前节点，说明左子树已经处理完成，把连接断开，并将当前节点切到其右子节点进行遍历。
4. 重复 2、3 步骤直至遍历结束。

```typescript
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;

  let p1 = root;
  let p2: TreeNode | null;
  while (p1) {
    p2 = p1.left;
    if (!p2) {
      result.push(p1.val);
      p1 = p1.right;
      continue;
    }
    while (p2.right && p2.right !== p1) {
      p2 = p2.right;
    }
    if (p2.right) {
      p2.right = null;
      p1 = p1.right;
    } else {
      p2.right = p1;
      result.push(p1.val);
      p1 = p1.left;
    }
  }
  return result;
}
```
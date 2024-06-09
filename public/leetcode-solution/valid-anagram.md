# 242. 有效的字母异位词

## 题目

> [中文站](https://leetcode-cn.com/problems/valid-anagram/) [国际站](https://leetcode.com/problems/valid-anagram/)

给定两个字符串 `s` 和 `t` ，编写一个函数来判断 `t` 是否是 `s` 的字母异位词。

**注意：** 若  `s` 和 `t`  中每个字符出现的次数都相同，则称  `s` 和 `t`  互为字母异位词。

**示例  1:**

```
输入: s = "anagram", t = "nagaram"
输出: true
```

**示例 2:**

```
输入: s = "rat", t = "car"
输出: false
```

**提示:**

- `1 <= s.length, t.length <= 5 * 104`
- `s` 和 `t`  仅包含小写字母

**进阶:**  如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？

## 解法

### 排序对比 O(nlogn)

字母异位词等价于两个词对字母排序后是相等的，所以可以通过对两个字符串进行排序，在做相等判断即可。

```typescript
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return [...s].sort().join("") === [...t].sort().join("");
}
```

### 数组 O(n)

字母异位词中相同字母出现的次数是相等的，且由于词中仅包含小写字母，因此仅需要一个长度为 26 的数组存储每个字母出现的次数；
遍历字符串 `s`，将其中每个字符出现次数存储起来，再遍历字符串 `t`，对每个字符出现的次数做相应的减少，若出现某个字符出现的次数小于 0 时，表示两个字符串非字母异位词。

```typescript
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const arr = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    arr[s.codePointAt(i) - "a".codePointAt(0)]++;
  }
  for (let i = 0; i < t.length; i++) {
    const index = t.codePointAt(i) - "a".codePointAt(0);
    arr[index]--;
    if (arr[index] < 0) return false;
  }

  return true;
}
```

### 哈希表 O(n)

字母异位词中相同字母出现的次数是相等的，故可通过哈希表对词中的每个字符的数量进行统计；
遍历 `s`，将每个字符出现的次数在哈希表中存起来，再遍历 `t`，对哈希表中字符的数量做相应减少，若某个字符数量小于 0 ，表示两个字符串非字母异位词。

```typescript
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const map: Map<string, number> = new Map();
  for (const v of s) {
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  for (const v of t) {
    map.set(v, (map.get(v) ?? 0) - 1);
    if (map.get(v) < 0) return false;
  }
  return true;
}

// 同理将 map 换成 object 也可以
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const obj = {};
  for (const v of s) {
    obj[v] = (obj[v] ?? 0) + 1;
  }
  for (const v of t) {
    if (!obj[v]) return false;
    obj[v]--;
  }
  return true;
}
```
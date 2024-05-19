---
title: "JavaScript Array 对象是如何工作的"
date: "2021-11-30"
desc: "从 V8 源码简单了解 JavaScript Array 对象的实现"
---

由于入门语言就是 `JavaScript`，所以也早就习惯了 `JavaScript Array` 的各种特性，学了数据结构和算法后，发现其跟原始 `Array` 数据结构的差别还是非常大的，因此对 `JavaScript Array` 对象底层的实现就有了探究的兴趣。

在这篇文章中，会简单介绍数组数据结构的特点，并介绍 `JavaScript Array` 对象的一些实现以及其区别于原始数组数据结构的地方。

## Array 数据结构有什么特点

首先让我们先来回看一下数组的特点：数组是固定大小的同类元素的集合 ，作为最简单的、最常用的数据结构之一，有如下特点：

- 数组是以固定大小的连续物理内存存储的
- 数组中所有元素的数据类型是一致的
- 数组通过偏移量实现随机索引访问，时间复杂度为 O(1)
- 遍历数组寻找元素的时间复杂度为O(n)

## JavaScript 的 Array 对象有什么特点

`Array` 是一个类列表(like-list)的全局对象，区别于原始的数组数据结构，其底层是基于哈希表(Hash Table)进行封装的，并在其原型对象上封装了各种操作的 `API`。并且 `JavaScript Array` 对象包含以下特性：

- `Array` 对象是动态大小的。
- `Array` 对象可以同时存储任意类型的元素。
- 由于 `Array` 长度可以随时改变，且数据可以存储在任意不连续的位置，所以 `Array` 不能保证其是密集型的。

所以在 `JavaScript` 中这样的代码是完全能运行的：

![how_javascript_array_work_1](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_1.png)

从这里就可以看出 `JavaScript Array` 对象跟传统的 `Array` 数据结构有着比较大的区别。

简单的罗列了两者的特点之后，让我们再往下探一层，看看 `JavaScript Array` 在 `V8` 的实现，以便有更好的了解吧。

## `JavaScript Array` 对象在 `V8` 的内部实现

知道了 `JavaScript Array` 的特点后，是否很好奇这种类数组对象，其底层的物理内存是如何分配和管理的呢？

这里可以先给出一个结论：`V8` 为了更好的利用内存并提高性能，既支持固定长度存储的存储，也支持哈希表的存储，通过权衡性能和空间的情况进行动态转换。

有了结论，接下来就通过实践来验证上面的结论，以下相关 [v8 源码](https://github.com/v8/v8/blob/master/src/objects/js-array.h) 有兴趣的也可以自行查看。

首先看一下 `JSArray` 在 `V8` 中的定义：

![how_javascript_array_work_2](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_2.png)

可以得出，`V8` 中的 `JSArray` 继承自 `JSObject`，是一个对象，并且确实实现了两种存储结构：

- `fast`: 以 `FixedArray` 类存储，其表示一段固定长度且连续的内存
- `slow`: 以 `HashTable` 类存储，以数字为键

然后让我们先通过一段代码查看下 `Array` 对象在 `v8` 中的存储：

- 前置准备：安装 `JavaScript` 引擎版本管理工具 [jsvu](https://github.com/GoogleChromeLabs/jsvu)，该文章对 `jsvu` 添加了别名 `d8`
- 在指定的目录下创建一个测试的 `js` 文件，如：`~/Downloads/test.js`
- 在文件内添加一段代码，然后保存：

![how_javascript_array_work_3](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_3.png)

- 运行命令查看上面定义数组的结果：`d8 --allow-natives-syntax test.js`

![how_javascript_array_work_4](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_4.png)

从命令的输出结果可以得出几个结论：

1. `JSArray` 是一个 `Map` 对象，也印证了上面 `V8` 的定义。
2. 数组中的元素都存储在对象的 `elements` 属性中。
3. `elements` 属性目前是 `FixedArray` 存储结构。
4. `length` 属性保存在 `properties` 中

这里先做一个简单的科普，在 `v8` 的 `JSObject` 中，会将属性区分为 `elements` 和 `properties`：

- `elements` (排序属性) ：存储数字属性的地方，`ECMAScript` 规范定义了数字属性应该按照索引值大小升序排列。
- `properties` (常规属性)：存储字符串属性的地方，`ECMAScript` 规范定义了字符串属性根据创建时的顺序排列。

由于我们这篇文章主要讲 `Array` 对象，一般都是定义数字属性，所以接下来只需要关注 `elements` 即可。

### FixedArray

在 `V8` 内部，为了有效提升存储和访问属性的性能，会默认使用线性数据结构（即 `FixedArray`）来保存数字属性，并且可以根据元素的增删动态的扩缩容。

**扩容：**

在数组初始化成功后，我们通常会为数组添加元素：

![how_javascript_array_work_5](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_5.png)

可以发现，在我们往数组中添加元素的时候，会触发 `PossiblyGrowElementsCapacity` 检测是否需要扩容，扩容相关代码见：

![how_javascript_array_work_6](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_6.png)

会通过 `CalculateNewElementsCapacity` 计算扩容后大小，新容量计算公式为：

![how_javascript_array_work_7](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_7.png)

之后通过 `GrowElementsCapacity` 函数进行扩容操作：

![how_javascript_array_work_8](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_8.png)

扩容操作中会通过 `CopyFixedArrayElements` 将数据拷贝到新的内存空间。

然后让我们一起验证一下扩容的情况：

![how_javascript_array_work_9](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_9.png)

在测试文件中填入上面的代码，然后运行命令查看结果：

![how_javascript_array_work_10](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_10.png)

可以发现，在第二次 `print` 时，`FixedArray` 的容量扩充到了 `19(2 + 1 + 16)`，符合上面的预期。

**缩容：**

那么什么情况下会触发缩容操作呢，让我们一起看看：

不论是将元素从数组中移出还是手动设置 `length` 属性的值，都会触发 `length` 改变，当判断到 `length` 值小于容量时，会再次判断是否需要缩容：

![how_javascript_array_work_11](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_11.png)

若`容量 >= 2 * length + 16` 时，会进行缩容操作，否则使用 `Holes` 填充空的位置，即数组中分配了空间，但没有放置元素的位置。

看完了缩容的逻辑，咱们来验证一下吧，先创建一个容量为 `37` 的数组，然后将其 `length` 属性设置为 `10`，看是否触发了缩容操作：

![how_javascript_array_work_12](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_12.png)

运行一下代码：

![how_javascript_array_work_13](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_13.png)

可以发现，容量缩减到了 `10`，多出来的容量全被缩减掉了。

### FixedArray -> HashTable

上面讲了 `FixedArray` 结构存储时的扩缩容操作，而前面提到 `Array` 对象底层还存在一种 `HashTable` 存储结构，那么什么情况下底层存储会转变成 `HashTable` 结构呢？

让我们来看一段代码：

![how_javascript_array_work_14](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_14.png)

然后看一下相关数值的定义：

![how_javascript_array_work_15](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_15.png)

![how_javascript_array_work_16](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_16.png)

可以发现，存储结构从 `FixedArray` 转变为 `HashTable` 有两种情况：

- 新容量 >= 临界值(3*原容量*3) 
- 插入数据的 index - 原容量 >= 1024

让我们通过简单的代码验证一下上面的逻辑，由于随机索引设置值更加简单，我们就通过这种方式验证：

![how_javascript_array_work_17](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_17.png)

运行代码查看结果:

![how_javascript_array_work_18](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_18.png)

可以很明显的发现，`elements` 的实现变成 `Dictionary` 了。

由于数组在一定情况下会转变为 HashTable，那么其底下又是怎么实现的呢，让我们接着看。

### HashTable

`HashTable` 的优势是无需维护大块连续的内存空间，在数组的空洞比较多时，相比 `FixedArray` 更节省内存，但是由于需要维护一个 `HashTable`，其效率会比 `FixedArray` 的随机索引访问要低。

首先找到 `NumberDictionary` 的实现：

![how_javascript_array_work_19](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_19.png)

可以发现其是继承自 `Dictionary` 的，让我们再找找 `Dictionary` 的定义：

![how_javascript_array_work_20](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_20.png)

发现其内部就是基于 `HashTable` 的，然后再上定义了一些支持数组访问和操作数据的方法。

### HashTable -> FixedArray

上面提到，当xxx时，`Array` 的底层存储结构会从 `FixedArray` 转变为 `HashTable`，以降低大块连续内存的需求或内存的闲置，打到对内存的使用更加灵活的结果，但是，这无疑是以时间换空间的一种实现。那么，肯定也有从 `HashTable` 转变回 `FixedArray` 的情况：

![how_javascript_array_work_21](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_21.png)

当 `HashTable` 节省的空间 `<= 50%` 时，就会将底层存储结构转变回 `FixedArray`，以获取更好的性能。

照例做一个简单的验证：

![how_javascript_array_work_22](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_22.png)

运行代码看结果：

![how_javascript_array_work_23](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/blogs/how_javascript_array_work_23.png)

在填充足够的元素之后，`HashTable` 能节省的空间越来越少，然后转换回 `FixedArray` 了。

总的来说，`JavaScript Array` 是一个对象，`V8` 在底层做了一层封装，通过对时间和空间的取舍，已达到更好的性能和内存使用效率。

以上对 `JavaScript Array` 对象是如何工作的做了简单的说明，更深层次的...再看看吧。

---
title: "nestjs tdd —— e2e"
date: "2021-07-04"
desc: "nestjs 项目端到端测试"
---

端到端测试跟单元测试的区别在于：

- 单元测试重点关注单独的模块、类的逻辑
- 端对端测试则和终端用户类似，关注一个请求、整个流程的逻辑正确，覆盖了类和模块的交互。

通过模拟 `http` 请求，有以下两种方式来完成 `e2e` 测试。

## mock 数据操作

该方案主要测请求的逻辑正确性，`mock` 对数据库的操作以防止测试对数据造成影响。

![nestjs_tdd_27](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_27.png)

通过以上代码可见，我们仅对数据库操作进行了 mock，其他的逻辑完全按照项目的本身逻辑运行，包括controller、service的调用及其内部逻辑。

**优点：**

- 避免数据操作污染正式数据库

**缺点：**

- 需要对所有数据操作进行 mock，对复杂的操作有 mock 成本

## 测试库

该方案通过连接一个和正式数据库相同的测试数据库，将测试操作的数据隔离开，以避免对正式数据库的影响。

![nestjs_tdd_28](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_28.png)

以上代码为测试库连接的配置，其中添加 `dropSchema` ，在每次启动测试时，将测试库清空，保持测试库的干净。

![nestjs_tdd_29](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_29.png)

**优点：**

- 无需 `mock` 数据库操作，降低了测试代码的复杂性
- 对数据库操作都为真实操作，测试结果更真实

**缺点：**

- 需要注意测试编写的顺序，创建用户前用户数据是空的，创建用户后才能通过 id 获取用户数据。

## 结论
虽然上面根据是否 `mock` 数据库操作区分了两种方案，事实上，对于一些外部服务调用，若是会对数据产生影响的，也需要进行 `mock`：

- 对外的 `http` 请求：主要是通过 `nestjs` 内置的 `HttpModule`、`HttpService` 进行 `mock`。
- 对外的 `rpc` 请求：对封装 `rpc` 调用的 `service` 进行 `mock`。
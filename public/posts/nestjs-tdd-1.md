## 背景

这段时间从前端转后端做 nodejs 项目，借此机会对一些好的实践做一下记录。

## 前置须知

### [测试金字塔](https://martinfowler.com/articles/practical-test-pyramid.html)

> 主要思想：多写简单测试，少写复杂测试，不要遗漏任何一个测试。

- 单元测试：小而简洁，一次测试一个内部方法，且不与外部有关联。
- 集成测试：包含更大的方法和对外部服务的调用（应被 mock）。
- 端到端测试：可用于对路由的全面检查，以查看在真实情况下是否一切正常。

### kiss 原则

> 测试可能非常耗时，所以更应该避免过度设计。

并非所有的逻辑都要测试，应专注于最有价值的核心逻辑，质量优于数量。

### 编写高可维护性代码

> 最佳实践是测试方法的结果而非实现细节。

在编写完测试代码后，若在不改变方法结果的情况下重构实现，此时测试代码应不需要修改。

### TDD

> 测试驱动开发，倡导先写测试程序，再编码实现功能，具体概念详见 wiki

- 红：使用运行失败的测试代码启动每块功能的开发。
- 绿：编写可通过测试的最小代码实现。
- 重构：重构实现代码，完善业务逻辑，优化代码可读性、可扩展性、可维护性。

以最小实现+优化的方式，可尽量避免过度设计。

### Jest

> 一个 JavaScript 测试框架，用于测试中的 mock 和断言。

> 概念和使用详见 [入门 · Jest](https://jestjs.io/zh-Hans/docs/getting-started)

Nestjs 中已经内置了 Jest

## 需求

> 在启动开发流程前，先明确需求，才能将需求拆解为一个个测试用例，进而完成开发。

- 创建一个用户系统，支持用户增删改查。（一句话需求可够？）

其中用户数据格式为：
![nestjs_tdd_1](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_1.png)

需求定义完成，接下来开始创建项目

## 项目初始化

**在命令行构建项目：**

![nestjs_tdd_2](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_2.png)

**启动项目：**

![nestjs_tdd_3](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_3.png)

不出意外的话，一个 web 服务就启动完成了。

由于 nestjs 框架已经集成了 jest 测试框架，所以在初始化的项目中已经可以看到初始化的测试文件了，至此，开始正式的开发流程吧。

## 创建数据库表

数据库应用程序的编写往往从数据库表的建立开始，所以在开始编写项目之前，我们先进行库表的创建，此处以本地 mysql 库为例说明（本地 mysql 大家自行安装）。

**连库+创建项目数据库：**

![nestjs_tdd_4](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_4.png)

**项目接入数据库：**

![nestjs_tdd_5](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_5.png)

![nestjs_tdd_6](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_6.png)

至此，项目初始化及连接数据库操作完成，将在下一篇介绍 TDD 的编码流程。
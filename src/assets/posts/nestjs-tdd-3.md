---
title: "nestjs tdd —— controller"
date: "2021-06-29"
desc: "nestjs 项目 controller 单测和开发"
---

上一篇主要完成了 `service` 测试的编写以及 `service` 方法的实现，还有对数据库操作的 `mock`。

这篇开始编写 `controller` 的测试和方法实现。

## findById

照常，先从 `controller` 测试编写开始：

![nestjs_tdd_17](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_17.png)

再根据提示以最小代码解决编译报错：
![nestjs_tdd_18](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_18.png)

编译报错解决后，尝试运行 `yarn test`，当然不可能通过测试。
接下来就是以最少代码让测试跑通，走上了「红-绿」的路。

![nestjs_tdd_19](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_19.png)

再然后就是对代码重构优化，增加更全面的业务逻辑。

![nestjs_tdd_20](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_20.png)

## register

依葫芦画瓢，将 `register` 相关测试和逻辑编写完成：

![nestjs_tdd_21](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_21.png)

![nestjs_tdd_22](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_22.png)

重构：为请求参数加上数据类型校验

安装类型校验依赖：

![nestjs_tdd_23](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_23.png)

添加自动验证 `pipe`：

![nestjs_tdd_24](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_24.png)

添加校验类型文件：

![nestjs_tdd_25](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_25.png)

引入类型限制：

![nestjs_tdd_26](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_26.png)

自此，对 controller 这块的测试和逻辑已经讲完了，接着进入下一篇章。

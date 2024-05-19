---
title: "nestjs tdd —— service"
date: "2021-06-27"
desc: "nestjs 项目 service 单测和开发"
---

在上一篇中我们已经完成了数据库的连接，现在就先编写数据库调用的 `mock` 测试，在数据库方法调用被 `mock` 后，测 `service` 的逻辑。

## User 模块创建

当然，在编写测试之前，需要先将 `user` 模块定义好。

![nestjs_tdd_7](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_7.png)

上面的命令运行完后，项目的 `src` 目录中会多出 `modules` 目录，底下有 `user` 模块。

并且已经将依赖注入完成，所以项目是能正常运行的。

## 表实体定义

在开发之前，先对数据库的表实体进行定义。

在 `user` 模块目录内创建 `user.entity.ts` 文件，并进行实体定义。

![nestjs_tdd_8](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_8.png)

实体定义完成后，需要在 user module 中进行导入。

![nestjs_tdd_9](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_9.png)

启动服务，已经连上该数据库了，并且数据库中也创建了一张 users 表了，接下来开始编写测试。

## 注册用户

在三层架构中，在 service 层调用数据操作，故在 service 中新增注册用户方法。

先行的测试代码如下：

![nestjs_tdd_10](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_10.png)

此时的代码是无法运行的，因为 `user.service.ts` 模块内并没有 `register` 方法，所以会编译报错。

先以最小的代码支持编译：

![nestjs_tdd_11](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_11.png)

此时编辑器上已经没有编译错误提醒了，接下来先运行 `yarn test` 跑一下测试，当然，此时是毫不意外的报错了，这就是 TDD 三步中的「红」。

原因是在 `service` 中并没有调用 `repository` 的方法，我们再用最简单的代码使测试通过，将 `user.service.ts` 文件内容做一下修改：

![nestjs_tdd_12](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_12.png)

![nestjs_tdd_13](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_13.png)

此时再运行测试命令，就可以看到所有测试都通过了。

后面还可以对项目代码做更多的重构和优化，以及增加其他的功能（如权限校验等），当然如果要加一些新的功能逻辑，还是先修改测试代码，重复「红-绿-重构」的步骤。

## 获取用户信息

以上注册用户的功能，只实现了对数据库简单函数调用（一层）的 mock，可是在 typeorm 的操作中，往往需要进行一些较复杂的调用，比如通过 QueryBuilder 方式的调用，这部分应该怎么 mock 呢？接下来通过一个用户查询需求来讲解：

照常先编写测试，增加 findById 测试用例，由于用户密码数据敏感字段，不会返回给前端：

![nestjs_tdd_14](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_14.png)

然后解决编译问题，在 `user.service.ts` 中加入 `findById` 方法：

![nestjs_tdd_15](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_15.png)

运行测试，观察报错，解决报错，为 `service` 增加 `orm` 调用：

![nestjs_tdd_16](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/nestjs_tdd_16.png)

此时再运行测试命令，可以预见测试已经通过。

至此，我们 service 上的测试和方法已经编写完成，接下来编写 controller 上的测试和方法。
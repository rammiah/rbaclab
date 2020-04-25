# admin使用说明

本文件简要描述了如何使用`sdk`将系统初始化需要的数据写入到区块链中，以及使用删除，查询等接口对系统状态进行修改。

运行命令前先下载依赖库：

```shell
npm install
```

## 系统初始化

系统初始化前请保证证书文件已生成并且网络已启动，且链码安装成功。

初始化部分需要将我们的管理员注册到ca中，然后注册我们的用户。

- 注册管理员

  注册管理员使用的是fabric-ca的nodejs的api：

  ```shell
  node enroll.js
  ```

  运行过后`wallet`目录中会存储我们的admin的身份凭证。

- 注册用户

  使用register和enroll完成用户的注册：

  ```shell
  ndoe register.js
  ```

  命令会将用户的身份凭证存储在用户目录下的`wallet`中。

- RBAC系统初始化

  需要保证rbac系统的配置文件存在，我这里使用了json文件进行配置`rbac.json`，

  运行命令：

  ```shell
  node init.js
  ```

  将实验数据写入到rbac系统中。

## 数据的查询删除

查询数据，以查询用户数据为例：


```shell
➜ node get.js getUser user1
getUser respose: {"name":"user1","roles":["role-a"]}
done
```

删除数据，以删除文件数据为例：

```shell
➜  node del delFile file-a
done
```


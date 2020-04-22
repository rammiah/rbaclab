# admin使用说明

本文件简要描述了如何使用`sdk`将系统初始化需要的数据写入到区块链中，以及使用删除，查询等接口对系统状态进行修改。

运行命令前先下载依赖库：

```shell
npm install
```

## 系统初始化

系统初始化前请保证证书文件已生成并且网络已启动，且链码安装成功。

初始化分为两部分，第一个是用户身份的初始化，使用`fabric-network`提供的`wallet`将用户的凭据存储在本地，简化使用方式。第二个就是系统数据的初始化，包括文件，用户，权限，角色等数据的写入。

- 用户身份初始化

  运行命令：

  ```shell
  node addWallet.js
  ```

  创建`wallet`文件夹存储认证数据。

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
➜ node get.js getUser User1@org1.rammiah.org
getUser respose: {"name":"User1@org1.rammiah.org","roles":["role-a"]}
done
```

删除数据，以删除文件数据为例：

```shell
➜  node del delFile file-a
done
```


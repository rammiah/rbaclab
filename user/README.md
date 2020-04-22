# user使用说明


user内的文件完成的功能包括数据查询和文件权限请求。

运行命令前先下载依赖库：

```shell
npm install
```

## 系统初始化

系统初始化前请保证证书文件已生成并且网络已启动，且链码安装成功。初始化部分只有用户身份初始化，使用`fabric-network`提供的`wallet`将用户的凭据存储在本地。

- 用户身份初始化

  运行命令：

  ```shell
  node addWallet.js
  ```

  创建`wallet`文件夹存储认证数据。

## 数据的查询于权限请求

查询数据，以查询用户数据为例：


```shell
➜ node get.js getUser User1 User1@org1.rammiah.org
getUser respose: {"name":"User1@org1.rammiah.org","roles":["role-a"]}
done
```

请求读文件：

```shell
➜  node readFile.js User1 file-a
request file resp: true
done
```
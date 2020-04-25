# user使用说明


user内的文件完成的功能包括数据查询和文件权限请求。

运行命令前先下载依赖库：

```shell
npm install
```

运行前需要管理员现在ca处注册用户。

## 数据的查询与权限请求

查询数据，以查询用户数据为例：


```shell
➜ node get.js getUser User1 user1
getUser respose: {"name":"user1","roles":["role-a"]}
done
```

请求读文件：

```shell
➜  node readFile.js user1 file-a
request file resp: true
done
```
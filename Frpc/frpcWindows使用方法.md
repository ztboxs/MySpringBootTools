## frpc 内网穿透远程电脑使用教程

#### 1.服务器端配置









### 2.windows客户端配置教程

##### 1.开启windows自带远程登入（Windows家庭版无该功能）



##### 2.git clone文件



##### 3.配置frpc.ini文件，用文本打开

```shell
[common]
server_addr = xxx.xx.xx.xxx ##服务器公网ip
server_port = 7000  ##服务器端frps端口

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 7389

```



##### 3.双击start.bat运行
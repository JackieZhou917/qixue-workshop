# 客户端
- 技术栈
  1. react19
  2. tailwindcss
  3. axios
  4. UI (antd-mobile)
  5. vite

- 移动端适配
  js 获取屏幕宽度，动态设置页面跟字体大小，导致 1rem 的相对值发生改变

- 浏览器存储
  1. localStorage       5-8MB     永久存储
  2. sessionStorage     5-8MB     关闭页面即清空
  3. IndexDB            无限大     永久存储
  4. cookies            4KB       后端控制有效时长    浏览器会在每次请求时自动携带cookies中的内容在请求头中

# 服务端
- Koa: 中间件的设计理念 (所有额外的功能都以函数表示，并被koa所use)

- 路由层：定义接口

- 控制层：处理前端请求

- 模版层：处理跟数据库交互的逻辑


1. 启动一个http服务   src/index.js
2. 定义路由接口       src/routes/xxx
3. 当前端真的请求某个接口，将响应逻辑定义在 控制层

# mysql
1. 连接数据库
2. 创建kid_edu数据库
3. 在kid_edu 这个库创建表

# 登录鉴权
前端输入账号密码进行登录  -->  后端校验账号密码是否合法  -->  后端生成一个身份令牌  -->  向前端返回登录成功并将这个令牌给到前端  -->  前端本地保存token  -->  前端后续发其他请求时需要携带token给到后端

- token 应该具有时效性: 为了安全考虑，有效时间过长，丢失token后的危害越大

- 双token 实现用户无感刷新:
  1. 前端登录成功后，后端返回两个token，一个是access_token 和 refresh_token, 并本地保存
  2. 前端后续的请求都携带access_token
  3. 当access_token失效后，一旦前端再次发请求，后端会返回 416 状态码
  4. 前端读取本地 refresh_token, 并向后端发送请求，后端返回新的 access_token 和 refresh_token
  5. 重塑用户刚刚失败的请求

- JSON WEB TOKEN (JWT)
  一套标准的生成 TOKEN 的手段，其生成的token包含三部分:
    1. Header (头部)  存放诸如：加密类型、加密方法等
    2. Payload (负载)  存放诸如：签发时间、过期时间、账号相关信息等
    3. Signature (签名)  存放诸如：只有服务器才知道的信息(加盐)
# Niuniu

### node环境
```
nodejs---v18.16.0
npm------9.5.1
vuecli---@vue/cli 5.0.8
```
### 引入依赖
```
yarn install
```

### 运行
```
yarn serve
```

#### 前端技术

|     技术      | 说明                                       | 官网文档                                                           |
| :----------: | ----------------------------------------- | -------------------------------------------------------------- |
|     Vue3     | 前端流行开发框架                          | [https://cn.vuejs.org](https://cn.vuejs.org)                   |
|  vue-router  | Vue 的官方路由                            | [https://router.vuejs.org](https://router.vuejs.org)           |
|  TypeScript  | 让 JS 具备类型声明                        | https://www.typescriptlang.org/                                |
| Element Plus | 缓基于 vue3 的组件库                      | [https://element-plus.gitee.io](https://element-plus.gitee.io) |
| Arco Design  | 字节跳动组件库                            | https://arco.design/react/docs/start                           |
|     vite     | 极速的前端打包构建工具                     | [https://cn.vitejs.dev](https://cn.vitejs.dev)                 |
|     OpenAPI    | 根据接口文档自动生成前端请求接口            | [https://github.com/ferdikoomen/openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)                 |

#### router 优化
```
优化官方默认路由,抽象出一个routes的动态路由集合,目录由routes提供动态生成
```

####  vuex配置
```
全局状态管理
├── store
│   ├──index.ts
│   ├──user.ts
user.ts -> index.ts -> vueView(const store = useStore(); -> store.state.user.loginUser)
```
####  前端权限校验模块
```
├── access
│   ├──accessEnum.ts
│   ├──checkAuth.ts
│   │ 
├── routes
│   ├──routes.ts --->    meta: {
                           access: ACCESS_ENUM.ADMIN,--->校验权限
                         },
```
## 根据后台接口文档生成代码

```
openapi --input <后台接口文档地址> --output ./generated --client axios
```

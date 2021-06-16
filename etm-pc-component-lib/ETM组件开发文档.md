<h1 style="background-color: red; color: white; font-size: 24px; padding: 10px;text-align:center">ETM组件开发文档</h1>



## 目录说明

```shell

|-- README.md
|-- babel.config.js           
|-- lib                                组件库打包编译后的文件                     
|        
|       
|-- packages                           组件库源文件
|   |-- EtmButton                      EtmButton组件文件夹
|   |   |-- index.js                   EtmButton入口文件导入导出
|   |    `-- src           
|   |        `-- EtmButton.vue         EtmButton组件源码
|   |       
|   `-- index.js                       组件库整体导入导出
|
|
|-- styles                             组件库样式表
|   |-- element.scss                   外部组件样式
|   |-- global.scss                    全局样式 统一入口文件
|   |-- icon.scss                       通用icon
|   |-- layout.scss                     布局相关
|   |-- mixin.scss                      sass混合函数定义
|   |-- popover.scss                    弹窗样式
|   |-- rev-theme.scss                  主题样式定义
|   |-- rev-var.scss                    主题样式
|   |-- sidebar.scss                    侧边栏样式
|   |-- theme.scss                      旧主题
|   |-- transition.scss                 动画样式
|   `-- variables.scss                  变量
|
|-- src                                组件库游乐场
|   |-- App.vue                        游乐场首页
|   |-- main.js                        游乐场入口
|-- package.json    
|-- vue.config.js
`-- yarn.lock


```





## 开发说明



> 内部组件统一以EtmXXX命名
>
> 强制开启eslint代码规范, 业务描述/文档注释务必清晰



> 下面以EtmButton组件作为示例

1. 在`packages`里新建`EtmButton`文件夹, 用来开发EtmButton组件
2. 在`EtmButton`文件夹里新建`src`文件夹,用于存放源码, 在`src`里建立`EtmButton.vue`源代码文件, 代码如下:

```vue

<template>
  <button v-bind="$attrs" v-on="$listeners">
    <slot>default-text</slot>
  </button>
</template>

<script>
export default {
  name: 'EtmButton', // 重要! 必填 && 唯一
}
</script>

```





3. 在`EtmButton`文件夹里新建index.js, 用于导出`EtmButton`组件, 代码如下:

```js
import EtmButton from './src/EtmButton'

EtmButton.install = function(Vue) {
  Vue.component(EtmButton.name, EtmButton)
}

export default EtmButton
```



4. 在packages里新建index.js, 用于导出整个组件库, 代码如下:


> *如果文件已存在只需要在里面添加对应的组件即可!*
```js
import EtmButton from './EtmButton'

// 导入你的组件

const components = [
  EtmButton, 
 //...注册你的组件
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install, EtmButton,
  //...导出你的组件
}

```



## 预览
- 配置packages组件库进行编译(已配置)
- main.js中引入组件库并use(已配置)
- npm run serve启动游乐场(已配置)
- 在App.vue中使用你的组件(已配置示例)




## 打包
- 使用`npm run lib`进行组件库编译打包
- 代码提交到仓库 `git add . && git commit`
- 发布组件
    - 切换npm源为内网服务器 `npx cgr use etm`
    - 登录到服务器 `npm login`, 输入用户名/密码/邮箱后进行下一步操作
    - 小版本更新 `0.0.x` 直接执行`npm run pub`进行发布 
    - 大版本更新 `x.x.0` 手动更改`package.json`中的版本号(*大版本更新前务必通知组内成员*)




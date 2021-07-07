### 使用步骤
#### 新增接口
- 新增模块(/api/xxx.js)
- 新增方法(/api/xxx.js/function)


#### 新增mock接口 (/mockapi/user/getUser)
- 新增模块(/api/xxx.js)
- 新增方法(/api/xxx.js/function)


#### 按照以下格式编写getUser的返回值
```javascript
/mockapi/test.js

export default [
    {
        url: '/test',
        method: 'get',
        data: {
      name: Random.cname(), // 随机中文名
      'start|1-10': '★',
      'number1|1-200': 100, // 范围
      'number2|+1': 202, // 累加
      'number3|123.1-5': 1, // 小数位
      'boolean|1': true, // 布尔
      'object|2-4': {
        '110000': '北京市',
        '120000': '天津市',
        '130000': '河北省',
        '140000': '山西省'
      },
      // 简单数组
      'array1|1': [
        'AMD',
        'CMD',
        'UMD'
      ],
      // 数组对象
      'array2|1-10': [
        {
          'name|+1': [
            'Hello',
            'Mock.js',
            '!'
          ]
        }
      ]
    }
    },
    {
        url: '/test2',
        method: 'post',
        data: {
        // 参照上面mockjs语法
        }
    }
]

```
#### 导出和导入自动化
- 在/mockapi/index.js中按以下格式导入导出
```javascript
export { default as test } from './test'
```


- 然后在/utils/mock.js中导入
```javascript
import { test, 你的模块名 } from '../mockapi'

const apis = [...test, ...你的模块名]
```

### 备注
- 仅限开发环境(development)中使用
- 可在main.js中修改
```javascript
if (process.env.NODE_ENV === 'development') {
  require('./utils/mock')
}
```

### 资料
更多mockjs语法/示例参考 http://mockjs.com/examples.html

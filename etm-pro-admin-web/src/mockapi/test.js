const Mock = require('mockjs')
const Random = Mock.Random

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
  }
]

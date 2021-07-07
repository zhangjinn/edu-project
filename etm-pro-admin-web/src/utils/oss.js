// node.js 对象存储 OSS
import OSS from 'ali-oss'
const client = new OSS({
  secure: true,
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI4Fpyi94sn5Y5XwXKGaWa',
  accessKeySecret: 'umTXpqWR3yYlVIq4unlwBJNr73UmDk',
  bucket: 'etm-pro-test'
})

export default client

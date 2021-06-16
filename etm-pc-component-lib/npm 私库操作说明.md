# npm 私库操作说明


## 资料
- [verdaccio仓库](https://github.com/verdaccio/verdaccio)

## 安装(不需要root)

```npm i verdaccio -g```

## 推荐工具
- 应用守护工具 ```npm i pm2 -g```
- npm源切换工具 ```npm i cgr -g```


## 添加私库源
- 格式: ```cgr add 源名称 域名[:端口]```
- 例如: ```cgr add etm http://localhost:4873/```


## 运行

- 按默认配置运行 ```pm2 start verdaccio```

<div style="background-color: red; color: white; font-size: 24px; padding: 10px;text-align:center">以下操作需要注意环境源</div>

## 源管理

- 查看当前源 ```cgr ls``` 带*号的为当前源
- 切换源 ```cgr use xxx``` 例如 ```cgr use npm```

## 发布

- npm publish




## 更新

- 非第一次发布则属于更新
    - 注意升级版本
    
- npm pub



## 下载

- 下载公库包
    - 先切换到公库 ```cgr use npm```
    - 然后安装包 ```npm i xxx```
    
- 下载私库包
    - 先切换到私库 ```cgr use etm```
    - 然后安装包 ```npm install  etm-xxx```

 > 例如:```npm install etm-upload-image```

module.exports = {
  title: 'etm-pc-component-lib',
  description: 'etm组件库文档 etm-pc-component-doc',
  extraWatchFiles: [
    '.vuepress/**.*'
  ],
  themeConfig: {
    // nav: [
    //   //格式一：直接跳转，'/'为不添加路由，跳转至首页
    //   {text: '首页', link: '/'},
    //
    //   //格式二：添加下拉菜单，link指向的文件路径
    //   {
    //     text: '分类',  //默认显示
    //     ariaLabel: '分类',   //用于识别的label
    //     items: []
    //   }
    // ],
    displayAllHeaders: true,
    sidebar: [
      '/introduce/',
      {
        title: '布局组件',
        children: [
          ['components/etm-main-body.md', 'etm-main-body主体内容区'],
          ['components/etm-layout-split.md', 'etm-layout-split布局']
        ]
      },
      {
        title: '导航组件',
        children: [
          ['components/etm-tabs.md', 'etm-tabs标签页']
        ]
      },
      {
        title: '基础组件',
        children: [
          ['components/etm-empty.md', 'etm-empty空内容展示'],
          ['components/etm-title.md', 'etm-title标题'],
          ['components/etm-status.md', 'etm-status状态'],
          ['components/etm-text.md', 'etm-text表格状态按钮'],
          ['components/etm-field-label.md', 'etm-fidle-label字段文本显示'],
        ]
      },
      {
        title: '表单组件',
        children: [
          ['components/etm-form.md', 'etm-form表单'],
          ['components/etm-form-foot.md', 'etm-form-foot表单底部操作'],
          ['components/etm-font-icon.md', 'etm-font-icon加减号'],
          ['components/etm-screen-tab.md', 'etm-screen-tab展开筛选条件'],
          ['components/etm-upload-img.md', 'etm-upload-img上传图片']
        ]
      },
      {
        title: '数据组件',
        children: [
          ['components/etm-table.md', 'etm-table简单表格'],
          ['components/etm-table-page.md', 'etm-table-page分页表格'],
        ]
      },
      {
        title: '弹窗组件',
        children: [
          ['components/etm-pop.md', 'etm-pop小弹窗'],
          ['components/etm-side.md', 'etm-side侧边弹窗'],
          ['components/etm-tip.md', 'etm-tip提示弹窗'],
          ['components/etm-drawer.md', 'etm-drawer抽屉弹窗'],
          ['components/etm-static-dialog.md', 'etm-static-dialog无蒙版弹窗']
        ]
      },
      {
        title: '非标准组件',
        children: [
          // ['components/etm-analysis-new.md', 'etm-analysis-new付费测评富文本列表'],
          // ['components/etm-bar.md', 'etm-bar付费测评柱状图'],
          // ['components/etm-folder.md', 'etm-folder应用设置编辑客户来源'],
          // ['components/etm-label.md', 'etm-label文本列表有冒号的label'],
          ['components/etm-upload-avatar.md', 'etm-upload-avatar上传头像'],
          ['components/el-button.md', 'el-button虚线按钮']
        ]
      },
      {
        title: '模版',
        children: [
          ['components/etm-drag-setting.md', 'etm-drag-setting应用设置拖拽'],
          ['components/etm-weekly-calendar.md', 'etm-weekly-calendar周日历'],
        ]
      }
    ]
  }
}

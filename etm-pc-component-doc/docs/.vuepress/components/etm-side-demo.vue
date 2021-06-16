<template>
  <div class="etm-side-demo-warp">
    <high-code :code="code" :description="description">
      <el-button @click.stop="showSide = true">打开侧边弹窗</el-button>
      <etm-side
        :visible="showSide"
        title="侧边弹窗的标题"
        @open="showSide = true"
        @close="showSide = false"
      >
        侧边弹窗内部主体内容
      </etm-side>
    </high-code>
    <params-table :table-data="attrTableData"/>
    <params-table title="事件列表" :table-data="eventTableData"/>
  </div>
</template>
<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
export default {
  name: 'etm-side-demo',
  components: {HighCode, ParamsTable},
  data() {
    return {
      attrTableData: [
        {
          param: 'visible',
          description: '控制弹窗弹出关闭的布尔变量，为true时弹出，为false时关闭',
          type: 'Boolean',
          option: 'true, false',
          default: 'false'
        },
        {
          param: 'title',
          description: '弹窗的主标题',
          type: 'String',
          option: '非空字符串',
          default: '请加上标题'
        },
        {
          param: 'content',
          description: '作为弹窗主体内容的vue组件',
          type: 'Object',
          option: '-',
          default: '-'
        },
        {
          param: 'appendToBody',
          description: '弹窗自身是否插入至 body 元素上，默认为false',
          type: 'Boolean',
          option: 'true, false',
          default: 'false'
        }
      ],
      eventTableData: [
        {
          param: 'open',
          description: '窗口打开的回调函数(函数中必须有设置visible对应变量为true的语句弹窗才会顺利打开)',
          type: 'Function',
          option: '函数',
          default: '-'
        },
        {
          param: 'close',
          description: '窗口关闭的回调函数(函数中必须有设置visible对应变量为false的语句弹窗才会顺利打开)',
          type: 'Function',
          option: '函数',
          default: '-'
        }
      ],
      code: `
      <template>
        <div>
          <el-button @click.stop="showSide = true">打开侧边弹窗</el-button>
          <etm-side
            :visible="showSide"
            title="侧边弹窗的标题"
            @open="showSide = true"
            @close="showSide = false"
          >
            侧边弹窗内部主体内容
          </etm-side>
        </div>
      </template>
      <script>
        export default {
          data() {
            return {
              showSide: false
            }
          }
        }
      `,
      description: '构造一个侧边弹窗',
      showSide: false
    }
  },
  computed:{
  },
  methods:{
  }
}
</script>

<style scoped>
</style>

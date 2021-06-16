<template>
  <div class="etm-pop-demo-wrap">
    <high-code :code="code" :description="description">
      <el-button @click.stop="popType = 'simple'; showPop = true;">simple类型</el-button>
      <el-button @click.stop="popType = 'complex'; showPop = true;">complex类型</el-button>
      <el-button @click.stop="popType = 'big'; showPop = true;">big类型</el-button>
      <etm-pop
        :visible="showPop"
        :pop="popType"
        title="弹窗的标题"
        confirm-btn="确定"
        cancel-btn="取消"
        @open="showPop = true"
        @close="showPop = false"
        @confirm="showPop = false"
        @cancel="showPop = false"
      >
        这里面插入弹窗的主体内容，或者通过组件的content属性来插入导入的VUE组件
      </etm-pop>
    </high-code>
    <params-table :table-data="attrTableData"/>
    <params-table title="事件列表" :table-data="eventTableData"/>
  </div>
</template>
<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
export default {
  name: 'etm-pop-demo',
  components: {HighCode, ParamsTable},
  data() {
    return {
      value: '',
      showPop: false,
      popType: 'simple',
      attrTableData: [
        {
          param: 'visible',
          description: '控制弹窗弹出关闭的布尔变量，为true时弹出，为false时关闭',
          type: 'Boolean',
          option: 'true, false',
          default: 'false'
        },
        {
          param: 'pop',
          description: '弹窗的三种类型，对应三种不同的尺寸（simple: 480px*254px~365px; complex: 686px*420px~70vh; big: 1000px*560px~70vh;）',
          type: 'String',
          option: 'simple, complex, big',
          default: 'simple'
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
          param: 'btnThrottle',
          description: '控制按钮的节流功能，默认设置为1200ms',
          type: 'Number',
          option: '非负整数',
          default: '1200'
        },
        {
          param: 'appendToBody',
          description: '弹窗自身是否插入至 body 元素上，默认为true',
          type: 'Boolean',
          option: 'true, false',
          default: 'true'
        },
        {
          param: 'confirmBtn',
          description: '确定按钮上的字符（主题色底）',
          type: 'String',
          option: '非空字符串',
          default: '确定'
        },
        {
          param: 'cancelBtn',
          description: '取消按钮上的字符（白色底）',
          type: 'String',
          option: '非空字符串',
          default: '取消'
        },
        {
          param: 'showConfirmBtn',
          description: '是否显示确定按钮',
          type: 'Boolean',
          option: 'true, false',
          default: 'true'
        },
        {
          param: 'showCancelBtn',
          description: '是否显示取消按钮',
          type: 'Boolean',
          option: 'true, false',
          default: 'true'
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
        },
        {
          param: 'confirm',
          description: '确定按钮点击时的回调函数',
          type: 'Function',
          option: '函数',
          default: '-'
        },
        {
          param: 'cancel',
          description: '取消按钮点击时的回调函数',
          type: 'Function',
          option: '函数',
          default: '-'
        }
      ],
      code:
      `
      <template>
        <div>
          <el-button @click.stop="popType = 'simple'; showPop = true;">simple类型</el-button>
          <el-button @click.stop="popType = 'complex'; showPop = true;">complex类型</el-button>
          <el-button @click.stop="popType = 'big'; showPop = true;">big类型</el-button>
          <etm-pop
            :visible="showPop"
            :pop="popType"
            title="弹窗的标题"
            confirm-btn="确定"
            cancel-btn="取消"
            @open="showPop = true"
            @close="showPop = false"
            @confirm="showPop = false"
            @cancel="showPop = false"
          >
            这里面插入弹窗的主体内容，或者通过组件的content属性来插入导入的VUE组件
          </etm-pop>
        </div>
      </template>
      <script>
        export default {
          data() {
            return {
              showPop: false,
              popType: 'simple',
            }
          }
        }
      `,
      description: '根据传入的弹窗类型构造出相应尺寸的弹窗'
    }
  },
  computed:{
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
.etm-pop-demo-wrap {

}
</style>

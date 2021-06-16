<template>
  <div class="etm-tip-demo-wrap">
    <high-code :code="code" :description="description">
      <el-button @click.stop="createTip('success')">success类型</el-button>
      <el-button @click.stop="createTip('warn')">warn类型</el-button>
      <el-button @click.stop="createTip('error')">error类型</el-button>
    </high-code>
    <params-table :table-data="attrTableData"/>
  </div>
</template>
<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
export default {
  name: 'etm-tip-demo',
  components: {HighCode, ParamsTable},
  data() {
    return {
      attrTableData: [
        {
          param: 'type',
          description: '指定弹窗的类型(success: 成功; warn: 警告; error: 错误;)',
          type: 'String',
          option: 'success, warn, error',
          default: 'warn'
        },
        {
          param: 'title',
          description: '弹窗的标题',
          type: 'String',
          option: '非空字符串',
          default: '请传入标题'
        },
        {
          param: 'content',
          description: '弹窗主体的内容',
          type: 'String',
          option: '非空字符串',
          default: '请传入提示内容'
        },
        {
          param: 'confirmBtn',
          description: '带有颜色背景的按钮上的字符',
          type: 'String',
          option: '非空字符串',
          default: '确定'
        },
        {
          param: 'cancelBtn',
          description: '白色背景的按钮上的字符。可不传，为空时不显示按钮',
          type: 'String',
          option: '非空字符串',
          default: '-'
        },
        {
          param: 'confirm',
          description: '点击有颜色背景按钮时执行的回调函数',
          type: 'Function',
          option: '函数',
          default: '-'
        },
        {
          param: 'cancel',
          description: '点击白色背景按钮时执行的回调函数',
          type: 'Function',
          option: '函数',
          default: '-'
        }
      ],
      code: `
      <template>
        <div>
          <el-button @click.stop="createTip('success')">success类型</el-button>
          <el-button @click.stop="createTip('warn')">warn类型</el-button>
          <el-button @click.stop="createTip('error')">error类型</el-button>
        </div>
      </template>
      <script>
        export default {
          methods:{
            createTip(type) {
              this.$etmTip.init({
                type,
                title: \${type}类型的提示弹窗标题,
                content: \${type}类型的弹窗主体内容区,
                confirmBtn: '好的',
                cancelBtn: '不了',
                confirm: () => {
                  this.$etmTip.close()
                },
                cancel: () => {
                  this.$etmTip.close()
                }
              })
              this.$etmTip.open()
            }
          }
        }
      `,
      description: '根据传入的弹窗类型构造出相应类型的提示弹窗'
    }
  },
  computed:{
  },
  methods:{
    createTip(type) {
      this.$etmTip.init({
        type,
        title: `${type}类型的提示弹窗标题`,
        content: `${type}类型的弹窗主体内容区`,
        confirmBtn: '好的',
        cancelBtn: '不了',
        confirm: () => {
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style scoped lang="scss">

</style>

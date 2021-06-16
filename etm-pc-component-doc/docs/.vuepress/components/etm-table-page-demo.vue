<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <el-image
                    style="width: 100%;"
                    :src="url" :preview-src-list="srcList">
            </el-image>
        </high-code>

        <params-table :table-data="tableData"/>
    </div>

</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
import EtmHr from "./base/etm-hr";

/**
 * etm-form-demo create by haijinsha
 * createTime 2020/6/29 13:01
 */
export default {
  name: 'etm-form-demo',
  components: {EtmHr, HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      url: require('../../public/images/table-page.png'),
      srcList: [require('../../public/images/table-page.png')],
      tableData: [
        {
          param: 'index',
          description: '是否开启序号',
          type: 'Boolean',
          option: `boolean`,
          default: `false`
        },
        {
          param: 'indexLabel',
          description: '序号',
          type: 'String',
          option: ``,
          default: `序号`
        },
        {
          param: 'selection',
          description: '多选',
          type: 'Boolean',
          option: `boolean`,
          default: `false`
        },
        {
          param: 'columns',
          description: '表头数据',
          type: 'Array',
          option: `[label: '班级名称', prop: 'clazzName'}]`,
          default: `[]`
        },
        {
          param: 'tableData',
          description: '表格数据',
          type: 'Array',
          option: `[{clazzName: '火山班', headerTeacher: '龙眼', age: '1-4', remark: ''}]`,
          default: '[]'
        },
        {
          param: 'currentChange',
          description: '页码组件改变时调用, size或page的改变都会触发此事件, 用于获取当前的页码信息便于分页',
          type: 'Function(pageNum, pageSize)',
          option: ``,
          default: '-'
        }
      ],
      code: `
        <etm-table :columns="columns" :data="tableData" @currentChange="currentChange">
            <template v-slot="{row}">
                <etm-text type="primary">修改</etm-text>
            </template>
        </etm-table>
        columns: [
            {label: '班级名称', prop: 'clazzName'},
            {label: '班主任', prop: 'headTeacher'},
            {label: '适用月龄', prop: 'age'},
            {label: '备注', prop: 'remark'}
        ]

       tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: [
          {
            clazzName: '火山班',
            headerTeacher: '龙眼',
            age: '1-4',
            remark: ''
          },
          {
            clazzName: '大地班',
            headerTeacher: '乌龙茶',
            age: '1-12',
            remark: ''
          },
          {
            clazzName: '海洋班',
            headerTeacher: '甘草',
            age: '1-8',
            remark: ''
          },
          {
            clazzName: '森林班',
            headerTeacher: '海金沙',
            age: '1-72',
            remark: ''
          }
        ]
      }

      ...
      mixins: [baseMixin], // -> pageInfo
      methods: {
           currentChange(pageNum,pageSize) {
                console.log(pageNum,pageSize)
                this.pageInfo.pageNum = pageNum
                this.pageInfo.pageSize = pageSize
                this.init()

           }
      }
      `,
      description: '<div style="display:block;text-decoration: blink;color: red">由于文档bug此实例使用图片代替</div>用于模块首页表格, 数据量大需要分页的场景, </br> 注意: 分页表格时依赖后台的接口数据格式, 务必区分分页和不分页的表格的使用接口的场景'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
    .etm-form-demo-wrap {

    }
</style>

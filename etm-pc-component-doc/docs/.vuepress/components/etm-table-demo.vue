<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <img src="../../public/images/simple-table.png" alt="">
        </high-code>

        <high-code :code="code1" :description="description">
            <img src="../../public/images/simple-table.png" alt="">
        </high-code>
        <params-table :table-data="tableData"/>
    </div>

</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";

/**
 * etm-form-demo create by haijinsha
 * createTime 2020/6/29 13:01
 */
export default {
  name: 'etm-form-demo',
  components: {HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value: '',
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
          description: '选多',
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
        }
      ],
      code: `
        <etm-table :columns="columns" :data="tableData">
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

       tableData: [
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
      `,
      data: [
        ,
      ],
      code1: `
        <etm-table :data="tableData">
            <el-form-item label="班级名称" prop="clazzName"/> // 通过slot来手动操作顺序
            <el-form-item label="班主任" prop="headTeacher"/>
            <el-form-item label="适用月龄" prop="age"/>
            <el-form-item label="备注" prop="remark"/>
            <el-form-item label="操作">
                <etm-text type="primary">修改</etm-text>
            </el-form-item>
        </etm-table>
      `,
      description: '<div style="display:block;text-decoration: blink;color: red">由于文档bug此实例使用图片代替</div>用于一般简单表格, 不使用分页的场景'
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

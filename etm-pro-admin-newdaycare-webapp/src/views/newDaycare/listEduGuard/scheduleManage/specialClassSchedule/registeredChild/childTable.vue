<template>
  <etm-table
    :columns="columns"
    :data="tableData"
  >
    <el-table-column
      slot="right"
      label="操作"
    >
      <template v-slot="scoped">
        <etm-text
          type="danger"
          @click="handleDelete(scoped.row,scoped.$index)"
        >
          删除
        </etm-text>
      </template>
    </el-table-column>
  </etm-table>
</template>

<script>

export default {
  name: 'ChildTable',
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 表格数据
      columns: [ // 表格的列表头传值
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '班级',
          prop: 'clazz'
        }

      ]

    }
  },
  methods: {
    handleDelete (row, index) {
      this.$emit('handleDelete', row, index)
    }
  }

}
</script>

<style scoped lang="scss">

</style>

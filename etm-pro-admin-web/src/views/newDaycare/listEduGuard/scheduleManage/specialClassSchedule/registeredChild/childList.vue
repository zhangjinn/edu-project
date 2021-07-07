<template>
  <etm-table
    :columns="columns"
    :data="tableData"
  />

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
  data() {
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
  }

}
</script>

<style scoped lang="scss">

</style>

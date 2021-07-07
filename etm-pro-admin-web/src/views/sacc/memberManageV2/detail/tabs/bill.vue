<template>
  <div class="bill">
    <Etm-table
      :element-table-attributes="tableAttributes"
      :column="columnSettings"
    />
  </div>
</template>
<script>
import EtmTable from '@/layout/main/EtmTable'
export default {
  components: {
    EtmTable
  },
  data() {
    return {
      tableAttributes: {
        data: [
          {
            number: 202001012301,
            generateTime: '2020-01-29',
            total: 20000,
            state: '有效',
            effectTime: '2020-01-29',
            endTime: '2020-02-29'
          }
        ]
      },
      columnSettings: [
        {
          label: '单据号',
          prop: 'number'
        },
        {
          label: '单据生成时间',
          prop: 'generateTime'
        },
        {
          label: '总金额',
          prop: 'total'
        },
        {
          label: '单据状态',
          prop: 'state'
        },
        {
          label: '单据生效日',
          prop: 'effectTime'
        },
        {
          label: '单据结束日',
          prop: 'endTime'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.bill {
  height: calc(100vh - 225px);
  overflow-y: auto;
  padding: 0 24px;
}
</style>

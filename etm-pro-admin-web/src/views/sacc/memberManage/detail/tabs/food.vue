<template>
  <div class="food">
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
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Array
    }
  },
  data() {
    const _this = this
    return {
      tableAttributes: {
        data: []
      },
      columnSettings: [
        {
          label: _this.$t('memberManage.detailFoodLabelFoodName'),
          prop: 'foodName'
        },
        {
          label: _this.$t('memberManage.detailFoodLabelDescription'),
          prop: 'description'
        }
      ]
    }
  },
  watch: {
    content(v) {
      this.tableAttributes.data = v
    }
  }
}
</script>

<style scoped lang="scss">
.food {
  /*height: calc(100vh - 206px);*/
  /*transform: translateY(9px);*/
  /*overflow-y: auto;*/
  /*padding: 0 24px;*/
}
</style>

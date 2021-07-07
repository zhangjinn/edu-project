<template>
  <div class="item">
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
          label: _this.$t('memberManage.detailItemTableTitleName'),
          prop: 'name'
        },
        {
          label: _this.$t('memberManage.detailItemTableTitleType'),
          prop: 'type'
        },
        {
          label: _this.$t('memberManage.detailItemTableTitleNumber'),
          prop: 'num'
        }
      ]
    }
  },
  watch: {
    content(v) {
      v.forEach(v => {
        if (v.type === 'NON_CONSUMABLE') {
          v.type = this.$t('memberManage.detailItemLabelNonConsumable')
        }
        if (v.type === 'CONSUMABLE') {
          v.type = this.$t('memberManage.detailItemLabelConsumable')
        }
      })
      this.tableAttributes.data = v
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  /*height: calc(100vh - 206px);*/
  /*transform: translateY(9px);*/
  /*overflow-y: auto;*/
  /*padding: 0 24px;*/
}
</style>

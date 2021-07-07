<template>
  <div class="item">
    <etm-table
      :columns="columnSettings"
      :data="tableData"
    />
  </div>
</template>
<script>

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Array
    }
  },
  data() {
    const _this = this
    return {
      tableData: [],
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
      this.tableData = v
    }
  }
}
</script>

<style scoped lang="scss">

</style>

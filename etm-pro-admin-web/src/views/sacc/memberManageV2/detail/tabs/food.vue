<template>
  <div class="food">
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
      this.tableData = v
    }
  }
}
</script>

<style scoped lang="scss">

</style>

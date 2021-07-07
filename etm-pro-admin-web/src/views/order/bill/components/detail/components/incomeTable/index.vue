<template>
  <div class="billInfo">
    <div class="titleText">收费项目</div>
    <div class="incomeInfo">
      <el-form label-position="left">
        <el-table
          ref="multipleTable"
          :data="billDetail.feesDetail.items"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="收费项目"
          />
          <el-table-column
            prop="price"
            label="单价"
          />
          <el-table-column
            prop="num"
            label="数量"
          />
          <el-table-column
            label="金额"
          >
            <template slot-scope="{row}">
              <div class="columnDiv">{{ getTotal(row) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  props: ['billDetail'],
  methods: {
    getTotal(row) {
      return (row.price * row.num)
    }
  }
}

</script>

<style scoped lang="scss">

</style>

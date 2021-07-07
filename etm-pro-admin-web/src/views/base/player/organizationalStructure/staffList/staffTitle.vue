<template>
  <div class="filter-flex">
    <div class="titleCenter" style="width: fit-content; text-align:center;" />
    <div style="width: fit-content;">
      <el-input v-model="input" style="width: 200px;" placeholder="员工姓名/账号" />
      <el-button style="width: fit-content;margin-left: 20px" type="primary" @click="handleSearch">
        搜索
      </el-button>
      <el-button style="width: fit-content;" type="primary" @click="handleUse">
        启用
      </el-button>
      <el-button style="width: fit-content;" type="primary" @click="handleUnUse">
        禁用
      </el-button>
      <el-button style="width: fit-content;" type="primary" @click="handleDel">
        删除账号
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StaffTitle',
  data() {
    return {
      input: ''
    }
  },
  methods: {
    handleUse() {
      this.$emit('handleUse')
    },

    handleUnUse() {
      this.$emit('handleUnUse')
    },

    handleDel() {
      this.$emit('handleDel')
    },

    handleSearch() {
      this.$emit('handleSearch', this.input)
    }

  }
}
</script>
<style lang="scss" scoped>
  @import "src/styles/variables";
  @import "src/styles/mixin";

  .filter-flex {
    padding-right: 20px;
  }

</style>

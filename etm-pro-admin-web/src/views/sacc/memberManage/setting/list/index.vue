<template>
  <div class="list-content">
    <div class="title">
      <span class="settingTitle">{{ titleText[settingState] }}</span>
      <el-button v-show="settingState !== 'time'" type="primary" @click.stop="handlePopOpen">{{ addBtnText[settingState] || '' }}</el-button>
    </div>
    <div class="table">
      <memberTable />
      <contactTable />
    </div>
  </div>
</template>
<script>
import memberTable from './memberTable'
import contactTable from './contactTable'
export default {
  components: {
    memberTable,
    contactTable
  }
}
</script>

<style scoped lang="scss">

</style>

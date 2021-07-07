<template>
  <etm-layout-split>
    <div class="sign">
      <etm-title>续签</etm-title>
      <el-steps :active="active" finish-status="success">
        <el-step title="课程信息" />
        <el-step title="更多信息" />
      </el-steps>
      <div class="tableArea">
        <course v-show="active === 0" />
        <more v-show="active === 1" />
      </div>
      <!-- <div class="bottomBtns">
        <el-button v-if="active !== 4" type="primary" :disabled="disabled" @click.stop="next">{{ $t('memberManage.nextBtnText') }}</el-button>
        <el-button v-else type="primary" :disabled="disabled" @click.stop="handleSubmit">{{ $t('memberManage.submitBtnText') }}</el-button>
        <el-button v-show="active !== 0" plain @click.stop="last">{{ $t('memberManage.lastBtnText') }}</el-button>
      </div> -->
    </div>
  </etm-layout-split>

</template>
<script>
import course from './course'
import more from './more'
export default {
  components: {
    course,
    more
  },
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang="scss">
.sign {
  @include bgc_white();
}
</style>

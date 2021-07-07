<template>
  <div class="add">
    <etm-title>新增会员</etm-title>
    <div class="tableArea">
      <basic ref="basic" :content="basicData" />
    </div>
    <div class="bottomBtns">
      <!-- <el-button v-if="active !== 1" type="primary" @click.stop="next">下一步</el-button> -->
      <el-button type="primary" @click.stop="handleSubmit">保存</el-button>
      <el-button plain @click.stop="handleCancel">取消</el-button>
      <!-- <el-button v-show="active !== 0" plain @click.stop="last">上一步</el-button> -->
    </div>
  </div>
</template>
<script>
import basic from './basic'
export default {
  components: {
    basic
  },
  data() {
    return {
      basicData: []
    }
  },
  computed: {

  },
  methods: {
    handleSubmit() {
      // TODO: 提交修改
    },
    handleCancel() {
      this.$emit('jump', 'manage')
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  position: relative;
  @include bgc_white();
  height: calc(100vh - 150px);
  padding-bottom: 68px;
  .tableArea {
    height: calc(100vh - 392px);
    overflow-y: auto;
    .basic, .status {
      height: 100%!important;
    }
  }
  .bottomBtns {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 68px;
    padding-left: 300px;
    box-shadow:0px -4px 6px 0px rgba(34,34,34,0.04);
    .el-button+.el-button {
      margin-left: 16px!important;
    }
  }
}
</style>

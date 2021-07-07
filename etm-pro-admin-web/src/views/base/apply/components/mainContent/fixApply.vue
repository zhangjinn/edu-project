<template>
  <div class="fixApply">
    <el-form>
      <el-form-item label="应用名称:">
        <span>赛事管理</span>
      </el-form-item>
      <el-form-item label="安装时间:">
        <span>2020-02-01 14：35</span>
      </el-form-item>
      <el-form-item label="安装目录:">
        <el-select v-model="catalogue" placeholder="请选择">
          <el-option
            v-for="pt in assignWayList"
            :key="pt.value"
            :label="pt.label"
            :value="pt.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FixApply',
  data() {
    return {
      catalogue: '',
      assignWayList: [
        { value: '1', label: '平均' },
        { value: '2', label: '追加' },
        { value: '3', label: '重新' },
        { value: '4', label: '取消' }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .fixApply{
    & /deep/ .el-form-item{
       margin-bottom: 0;
    }
  }
</style>

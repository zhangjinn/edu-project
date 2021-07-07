<template>
  <div>
    <el-form label-width="200px">

      <el-form-item label="当前岗位：">
        <span>{{ currentPost }}</span>
      </el-form-item>
      <el-form-item label="选择迁移的岗位：">
        <el-select v-model="post" placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in postList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: right;padding-top: 30px">
      已选择 11 位员工，调整到{{ post }}
      <el-button type="success">确定</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChangePost',
  // eslint-disable-next-line vue/require-prop-types
  props: ['currentPost', 'memberList'],
  data() {
    return {
      post: undefined,
      postList: [{
        id: 1,
        name: '岗位1'
      }, {
        id: 2,
        name: '岗位2'
      }, {
        id: 3,
        name: '岗位3'
      }, {
        id: 4,
        name: '岗位4'
      }, {
        id: 5,
        name: '岗位5'
      }, {
        id: 6,
        name: '岗位6'
      }]
    }
  }

}

</script>

<style lang="scss" scoped>

</style>

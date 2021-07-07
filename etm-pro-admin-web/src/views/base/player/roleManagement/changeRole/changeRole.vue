<template>
  <div>
    <el-form label-width="200px">

      <el-form-item label="当前角色：">
        <span>{{ changeRole }}</span>
      </el-form-item>
      <el-form-item label="选择迁移的角色：">
        <el-select v-model="role" placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: right;padding-top: 30px">
      已选择 11 位员工，调整到{{ role }}
      <el-button type="success">确定</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChangeRole',
  props: ['currentRole', 'memberList'],
  data() {
    return {
      role: undefined,
      roleList: [{
        id: 1,
        name: '角色1'
      }, {
        id: 2,
        name: '角色2'
      }, {
        id: 3,
        name: '角色3'
      }, {
        id: 4,
        name: '角色4'
      }, {
        id: 5,
        name: '角色5'
      }, {
        id: 6,
        name: '角色6'
      }]
    }
  }

}

</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-form label-width="200px">

      <el-form-item label="当前部门：">
        <span>{{ currentOrg }}</span>
      </el-form-item>
      <el-form-item label="选择迁移的部门：">
        <el-select v-model="organization" placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in organizationList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: right;padding-top: 30px">
      已选择 11 位员工，调整到{{ organization }}
      <el-button type="success">确定</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChangeOrg',
  // eslint-disable-next-line vue/require-prop-types
  props: ['currentOrg', 'memberList'],
  data() {
    return {
      organization: undefined,
      organizationList: [{
        id: 1,
        name: '部门1'
      }, {
        id: 2,
        name: '部门2'
      }, {
        id: 3,
        name: '部门3'
      }, {
        id: 4,
        name: '部门4'
      }, {
        id: 5,
        name: '部门5'
      }, {
        id: 6,
        name: '部门6'
      }]
    }
  }
}

</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="careTypeSetup">
    <div class="title">
      <span class="settingTitle">托管类型</span>
      <el-button type="primary" icon="el-icon-plus" @click.stop="addInfo">添加</el-button>
    </div>
    <etm-table :columns="columns" border :data="tableData">
      <el-table-column slot="right" label="状态">
        <template v-slot="{row}">
          {{ row.enable ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="{row}">
          <etm-text v-if="row.enable" type="primary" @click="forbid(row)">禁用</etm-text>
          <etm-text v-if="!row.enable" type="primary" @click="enable(row)">启用</etm-text>
          <etm-text v-if="!row.enable" type="primary" @click="update(row)">修改</etm-text>
          <etm-text v-if="!row.enable" type="danger" @click="remove(row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="simple"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div>
        <etm-form ref="form" :model="formItem" :rules="rules" type="dialog">
          <el-form-item label="类型名称:" prop="careTypeName">
            <el-input v-model="formItem.careTypeName" placeholder="可输入15个字" />
          </el-form-item>
          <el-form-item prop="enable" label="是否启用:">
            <el-radio-group v-model="formItem.enable">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import { getCareType, addCareType, updateCareType, deleteCareType } from '@/api/sacc/enrollmentManage'

export default {
  components: {
    EtmPop
  },
  data() {
    return {
      columns: [
        {
          label: '类型名称',
          prop: 'careTypeName'
        }
      ],
      tableData: [],
      showPop: false,
      popTitle: '添加类型',
      showPopType: '',
      careTypeId: null,
      formItem: {
        careTypeName: '',
        enable: true
      },
      rules: {
        careTypeName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
        enable: [{ required: true, message: '', trigger: 'change' }]
      }
    }
  },
  watch: {
    'formItem.careTypeName': function() {
      if (!this.formItem.careTypeName) return
      if (this.formItem.careTypeName.length > 15) {
        this.formItem.careTypeName = this.formItem.careTypeName.substring(0, 15)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getCareType().then(res => {
        this.tableData = res.data
      })
    },
    addInfo() { // 新增
      this.showPopType = 'add'
      this.formItem = {
        careTypeName: '',
        enable: true
      }
      this.showPop = true
    },
    forbid(row) { // 禁用
      const param = {
        careTypeName: row.careTypeName,
        enable: false
      }
      updateCareType(row.careTypeId, param).then(() => {
        this.$message.success('禁用成功')
        this.getList()
      })
    },
    enable(row) { // 启用
      const param = {
        careTypeName: row.careTypeName,
        enable: true
      }
      updateCareType(row.careTypeId, param).then(() => {
        this.$message.success('启用成功')
        this.getList()
      })
    },
    update(row) { // 修改信息
      this.formItem = row
      this.careTypeId = row.careTypeId
      this.showPopType = 'update'
      this.showPop = true
    },
    remove(row) { // 删除
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          deleteCareType(row.careTypeId).then(() => {
            this.$message.success('删除成功')
            this.$etmTip.close()
            this.getList()
          })
        }
      })
      this.$etmTip.open()
    },
    handlePopClose() { // 关闭弹窗并重置弹窗内容
      this.showPop = false
    },
    handlePopConfirm() { // 表单验证
      this.$refs['form'].$children[0].validate((valid) => {
        if (valid) {
          this.submitData()
        }
      })
    },
    submitData() { // 保存信息并重置弹窗内容
      const param = {
        careTypeName: this.formItem.careTypeName,
        enable: this.formItem.enable
      }
      if (this.showPopType === 'add') {
        addCareType(param).then(() => {
          this.$message.success('添加成功')
          this.showPop = false
          this.getList()
        })
      } else {
        updateCareType(this.careTypeId, param).then(() => {
          this.$message.success('修改成功')
          this.showPop = false
          this.getList()
        })
      }
    },
    handlePopCancel() { // 关闭弹窗并重置弹窗内容
      this.showPop = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .careTypeSetup {
    .title {
      display: flex;
      margin-bottom: 16px;
      justify-content: space-between;
      align-items: center;

      .el-button {
        span {
          font-weight: 400;
        }
      }

      span.settingTitle {
        display: inline-block;
        font-size: 14px;
        @include c_title_color();
      }
    }
  }
</style>

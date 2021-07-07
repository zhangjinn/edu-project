<template>
  <div class="careTypeSetup">
    <div class="title">
      <span class="settingTitle">托管套餐</span>
      <el-button type="primary" icon="el-icon-plus" @click.stop="addInfo">添加</el-button>
    </div>
    <etm-table :columns="columns" :data="tableData">
      <el-table-column slot="right" label="状态">
        <template v-slot="{row}">
          {{ row.enable ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作" width="180">
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
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="carePlanForm">
        <etm-form ref="form" :model="formItem" :rules="rules" type="dialog">
          <el-form-item label="套餐名称:" prop="carePackageName">
            <el-input v-model="formItem.carePackageName" placeholder="请输入套餐名称" />
          </el-form-item>
          <el-form-item label="托管类型:" prop="careTypeId">
            <el-select v-model="formItem.careTypeId">
              <el-option v-for="(item, index) in careTypeList" :key="index" :value="item.careTypeId" :label="item.careTypeName" />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐时长（月）:" prop="duration">
            <el-input v-model="formItem.duration" placeholder="请输入套餐时长" />
          </el-form-item>
          <el-form-item label="赠送时长（天）:" prop="freeDuration">
            <el-input v-model="formItem.freeDuration" placeholder="请输入赠送时长" />
          </el-form-item>
          <el-form-item label="套餐价格:" prop="price">
            <el-input v-model="formItem.price" placeholder="请输入套餐价格" />
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
import {
  getCareTypeEnable,
  getCarePackage,
  addCarePackage,
  updateCarePackage,
  deleteCarePackage
} from '@/api/sacc/enrollmentManage'

export default {
  components: {
    EtmPop
  },
  data() {
    return {
      columns: [
        {
          label: '课程名称',
          prop: 'carePackageName'
        },
        {
          label: '时长（月）',
          prop: 'duration'
        },
        {
          label: '托管类型',
          prop: 'careType'
        },
        {
          label: '价格（元）',
          prop: 'price'
        }
      ],
      tableData: [],
      showPop: false,
      popTitle: '添加套餐',
      showPopType: '',
      carePackageId: '',
      formItem: {
        carePackageName: '',
        careTypeId: '',
        duration: '',
        freeDuration: '',
        price: '',
        enable: true
      },
      careTypeList: [],
      rules: {
        carePackageName: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }],
        careTypeId: [{ required: true, message: '课程类型不能为空', trigger: 'change' }],
        duration: [{ required: true, message: '套餐时长不能为空', trigger: 'blur' }],
        freeDuration: [{ required: true, message: '赠送时长不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '套餐价格不能为空', trigger: 'blur' }],
        enable: [{ required: true, message: '', trigger: 'change' }]
      }
    }
  },
  watch: {
    'formItem.duration': function() {
      if (!this.formItem.duration) return
      const reg = /\D/g
      if (!reg.test(this.formItem.duration)) return
      this.formItem.duration = this.formItem.duration.replace(reg, '')
    },
    'formItem.freeDuration': function() {
      if (!this.formItem.freeDuration) return
      const reg = /\D/g
      if (!reg.test(this.formItem.freeDuration)) return
      this.formItem.freeDuration = this.formItem.freeDuration.replace(reg, '')
    },
    'formItem.price': function() {
      if (!this.formItem.price) return
      const reg = /^\d+$|^\d*\.\d{0,2}$/g
      if (!reg.test(this.formItem.price)) {
        if (this.formItem.price.indexOf('.') && this.formItem.price.indexOf('.') === (this.formItem.price.length - 1)) {
          if (this.formItem.price.indexOf('.') !== this.formItem.price.lastIndexOf('.')) {
            this.formItem.price = this.formItem.price.substring(0, (this.formItem.price.length - 1))
          }
        } else {
          this.formItem.price = this.formItem.price.substring(0, (this.formItem.price.length - 1))
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getCarePackage().then(res => {
        this.tableData = res.data
      })
    },
    getCareTypeList() {
      getCareTypeEnable().then(res => {
        this.careTypeList = res.data
      })
    },
    addInfo() { // 新增
      this.getCareTypeList()
      this.showPopType = 'add'
      this.formItem = {
        carePackageName: '',
        careTypeId: '',
        duration: '',
        freeDuration: '',
        price: '',
        enable: true
      }
      this.showPop = true
    },
    forbid(row) { // 禁用
      const param = {
        carePackageName: row.carePackageName,
        duration: row.duration,
        freeDuration: row.freeDuration,
        careTypeId: row.careTypeId,
        price: row.price,
        enable: false
      }
      updateCarePackage(row.carePackageId, param).then(() => {
        this.$message.success('禁用成功')
        this.getList()
      })
    },
    enable(row) { // 启用
      const param = {
        carePackageName: row.carePackageName,
        duration: row.duration,
        freeDuration: row.freeDuration,
        careTypeId: row.careTypeId,
        price: row.price,
        enable: true
      }
      updateCarePackage(row.carePackageId, param).then(() => {
        this.$message.success('启用成功')
        this.getList()
      })
    },
    update(row) { // 修改信息
      this.getCareTypeList()
      this.showPopType = 'update'
      this.formItem = row
      this.carePackageId = row.carePackageId
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
          deleteCarePackage(row.carePackageId).then(() => {
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
        carePackageName: this.formItem.carePackageName,
        duration: Number(this.formItem.duration),
        freeDuration: Number(this.formItem.freeDuration),
        careTypeId: this.formItem.careTypeId,
        price: Number(this.formItem.price),
        enable: this.formItem.enable
      }
      if (this.showPopType === 'add') {
        addCarePackage(param).then(() => {
          this.$message.success('添加成功')
          this.showPop = false
          this.getList()
        })
      } else {
        updateCarePackage(this.carePackageId, param).then(() => {
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

  .carePlanForm {
    .el-select {
      width: 100%;
    }
  }
</style>

<template>
  <div class="careTypeSetup">
    <div class="title">
      <span class="settingTitle">材料物品</span>
      <el-button type="primary" icon="el-icon-plus" @click.stop="addInfo">添加</el-button>
    </div>
    <etm-table :columns="columns" :data="tableData">
      <el-table-column slot="left" label="物品编号" prop="serial" width="150px" />
      <el-table-column slot="left" label="物品" prop="materialName" />
      <el-table-column slot="left" label="单位" prop="unit" />
      <el-table-column slot="left" label="物品类型">
        <template v-slot="{row}">
          {{ getType(row.materialType) }}
        </template>
      </el-table-column>
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
      <div class="materialForm">
        <etm-form ref="form" :model="formItem" :rules="rules" type="dialog">
          <el-form-item label="物品名称:" prop="materialName">
            <el-input v-model="formItem.materialName" placeholder="可输入10个文字" />
          </el-form-item>
          <el-form-item label="物品类型:" prop="materialType">
            <el-select v-model="formItem.materialType">
              <el-option value="LIVE" label="生活用品" />
              <el-option value="LEARN" label="学习用品" />
            </el-select>
          </el-form-item>
          <el-form-item label="进货价格（元）:" prop="purchasePrice">
            <el-input v-model="formItem.purchasePrice" placeholder="请输入进货价格" />
          </el-form-item>
          <el-form-item label="销售价格（元）:" prop="sellPrice">
            <el-input v-model="formItem.sellPrice" placeholder="请输入销售价格" />
          </el-form-item>
          <el-form-item label="规格型号:" prop="rugular">
            <el-input v-model="formItem.rugular" placeholder="请输入规格型号" />
          </el-form-item>
          <el-form-item label="单位:" prop="unit">
            <el-select v-model="formItem.unit">
              <el-option value="个" label="个" />
              <el-option value="件" label="件" />
              <el-option value="只" label="只" />
              <el-option value="套" label="套" />
            </el-select>
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
import { getMaterial, addMaterial, updateMaterial, deleteMaterial } from '@/api/sacc/enrollmentManage'

export default {
  components: {
    EtmPop
  },
  data() {
    return {
      columns: [
        {
          label: '进货价格',
          prop: 'purchasePrice'
        },
        {
          label: '销售价格',
          prop: 'sellPrice'
        }
      ],
      tableData: [],
      materialId: null,
      showPop: false,
      showPopType: '',
      popTitle: '添加物品',
      formItem: {
        materialName: '',
        materialType: '',
        purchasePrice: '',
        sellPrice: '',
        rugular: '',
        unit: '',
        enable: true
      },
      rules: {
        materialName: [{ required: true, message: '物品名称不能为空', trigger: 'blur' }],
        materialType: [{ required: true, message: '物品类型不能为空', trigger: 'change' }],
        purchasePrice: [{
          required: true,
          message: '进货价格不能为空',
          trigger: 'blur'
        }],
        sellPrice: [{
          required: true,
          message: '销售价格不能为空',
          trigger: 'blur'
        }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'change' }],
        enable: [{ required: true, message: '', trigger: 'change' }]
      }
    }
  },
  watch: {
    'formItem.purchasePrice': function() {
      if (!this.formItem.purchasePrice) return
      const reg = /^\d+$|^\d*\.\d{0,2}$/g
      if (!reg.test(this.formItem.purchasePrice)) {
        if (this.formItem.purchasePrice.indexOf('.') && this.formItem.purchasePrice.indexOf('.') === (this.formItem.purchasePrice.length - 1)) {
          if (this.formItem.purchasePrice.indexOf('.') !== this.formItem.purchasePrice.lastIndexOf('.')) {
            this.formItem.purchasePrice = this.formItem.purchasePrice.substring(0, (this.formItem.purchasePrice.length - 1))
          }
        } else {
          this.formItem.purchasePrice = this.formItem.purchasePrice.substring(0, (this.formItem.purchasePrice.length - 1))
        }
      }
    },
    'formItem.sellPrice': function() {
      if (!this.formItem.sellPrice) return
      const reg = /^\d+$|^\d*\.\d{0,2}$/g
      if (!reg.test(this.formItem.sellPrice)) {
        if (this.formItem.sellPrice.indexOf('.') && this.formItem.sellPrice.indexOf('.') === (this.formItem.sellPrice.length - 1)) {
          if (this.formItem.sellPrice.indexOf('.') !== this.formItem.sellPrice.lastIndexOf('.')) {
            this.formItem.sellPrice = this.formItem.sellPrice.substring(0, (this.formItem.sellPrice.length - 1))
          }
        } else {
          this.formItem.sellPrice = this.formItem.sellPrice.substring(0, (this.formItem.sellPrice.length - 1))
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMaterial().then(res => {
        this.tableData = res.data
      })
    },
    addInfo() { // 新增
      this.showPopType = 'add'
      this.formItem = {
        materialName: '',
        materialType: '',
        purchasePrice: '',
        sellPrice: '',
        rugular: '',
        unit: '',
        enable: true
      }
      this.showPop = true
    },
    getType(type) {
      if (!type) return
      switch (type) {
        case 'LIVE':
          return '生活用品'
        case 'LEARN':
          return '学习用品'
      }
    },
    forbid(row) { // 禁用
      const param = {
        serial: row.serial,
        materialName: row.materialName,
        unit: row.unit,
        materialType: row.materialType,
        rugular: row.rugular,
        purchasePrice: row.purchasePrice,
        sellPrice: row.sellPrice,
        enable: false
      }
      updateMaterial(row.materialId, param).then(() => {
        this.$message.success('禁用成功')
        this.getList()
      })
    },
    enable(row) { // 启用
      const param = {
        serial: row.serial,
        materialName: row.materialName,
        unit: row.unit,
        materialType: row.materialType,
        rugular: row.rugular,
        purchasePrice: row.purchasePrice,
        sellPrice: row.sellPrice,
        enable: true
      }
      updateMaterial(row.materialId, param).then(() => {
        this.$message.success('启用成功')
        this.getList()
      })
    },
    update(row) { // 修改信息
      this.showPopType = 'update'
      this.formItem = row
      this.materialId = row.materialId
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
          deleteMaterial(row.materialId).then(() => {
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
        materialName: this.formItem.materialName,
        unit: this.formItem.unit,
        materialType: this.formItem.materialType,
        rugular: this.formItem.rugular,
        purchasePrice: this.formItem.purchasePrice,
        sellPrice: this.formItem.sellPrice,
        enable: this.formItem.enable
      }
      if (this.formItem.serial) {
        param.serial = this.formItem.serial
      } else {
        const len = this.formatZero(this.tableData.length + 1)
        const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
        param.serial = 'WP' + new Date().getFullYear() + month + new Date().getDate() + len
      }
      if (this.showPopType === 'add') {
        addMaterial(param).then(() => {
          this.$message.success('添加成功')
          this.showPop = false
          this.getList()
        })
      } else {
        updateMaterial(this.materialId, param).then(() => {
          this.$message.success('修改成功')
          this.showPop = false
          this.getList()
        })
      }
    },
    formatZero(num) {
      if (String(num).length > 3) return num
      return (Array(3).join(0) + num).slice(-3)
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

  .materialForm {
    .el-select {
      width: 100%;
    }
  }
</style>

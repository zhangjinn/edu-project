<template>
  <div class="course">
    <etm-form :model="formData" :rules="rules">
      <el-form-item>
        <el-form-item label="会员姓名(中文):" prop="chname">
          <el-input v-model="formData.chname" disabled />
        </el-form-item>

        <el-form-item label="会员姓名(英文):">
          <el-input v-model="formData.enname" disabled />
        </el-form-item>

        <el-form-item label="课程套餐" class="fw-b">
          <div>
            <el-button type="dashed">
              <i class="el-icon-plus" />
              添加课程
            </el-button>
            <el-table :data="courseData">
              <el-table-column label="套餐名称" />
              <el-table-column label="课程类型" />
              <el-table-column label="套餐时长(月)" />
              <el-table-column label="赠送时长(天)" />
              <el-table-column label="套餐价格(应收)" />
              <el-table-column label="套餐价格(实收)" />
              <el-table-column label="操作">
                <template>
                  <etm-text>删除</etm-text>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item label="餐费" class="fw-b">
          <div>
            <el-button type="dashed">
              <i class="el-icon-plus" />
              添加餐费
            </el-button>
            <el-table :data="dietData">
              <el-table-column label="餐费名称" />
              <el-table-column label="天数" />
              <el-table-column label="单价" />
              <el-table-column label="实收单价" />
              <el-table-column label="应收小计" />
              <el-table-column label="实收小计" />
              <el-table-column label="操作">
                <template>
                  <etm-text>删除</etm-text>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item label="材料物品" class="fw-b">
          <div>
            <el-button type="dashed">
              <i class="el-icon-plus" />
              添加物品
            </el-button>

            <el-table :data="itemData">
              <el-table-column label="物品编号" />
              <el-table-column label="物品名称" />
              <el-table-column label="单位" />
              <el-table-column label="物品类型" />
              <el-table-column label="销售价格" />
              <el-table-column label="数量" />
              <el-table-column label="操作">
                <template>
                  <etm-text>删除</etm-text>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item label="支付方式:" prop="payMethod">
          <el-select v-model="formData.payMethod" placeholder="请选择支付方式">
            <el-option label="微信" value="wechat" />
            <el-option label="支付宝" value="alipay" />
            <el-option label="现金" value="cash" />
          </el-select>
        </el-form-item>

        <el-form-item label="起止日期:" prop="duration">
          <el-date-picker
            v-model="formData.duration"
            class="duration"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item label="签约日期:">
          <el-date-picker
            v-model="formData.signDate"
            type="date"
            placeholder="请选择日期"
          />
        </el-form-item>

        <el-form-item label="应收总价(元):">
          <el-input v-model="formData.shouldTotal" disabled />
        </el-form-item>

        <el-form-item label="实收总价(元):">
          <el-input v-model="formData.actualTotal" disabled />
        </el-form-item>

      </el-form-item>
    </etm-form>

  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        chname: '薏米',
        enname: 'yimi',
        payMethod: '',
        duration: '',
        signDate: '',
        shouldTotal: '0.00',
        actualTotal: '0.00'
      },
      rules: {
        duration: [
          { required: true, message: '请选择起止日期' }
        ],
        chname: [
          { required: true, message: '请输入会员姓名' }
        ],
        payMethod: [
          { required: true, message: '请选择支付方式' }
        ]
      },
      courseData: [],
      dietData: [],
      itemData: []
    }
  },
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">
.course {
  min-width: 900px;

  ::v-deep .el-form {
    max-width: 100% !important;
    width: 100% !important;
  }

  ::v-deep .el-input__inner {
    height: 34px;
    line-height: 34px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 24px;
  }

  ::v-deep .el-input {
    width: 560px !important;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }

  ::v-deep .el-select {
    width: auto !important;
  }

  ::v-deep .el-form-item__error {
    margin-left: 300px;
  }

  .duration {
    width: 560px !important;
  }

  ::v-deep .el-button {
    margin: 0 0 16px 594px;
  }

  .el-table {
    width: 900px;
    margin-left: 100px;
  }

  ::v-deep .fw-b label {
    font-weight: bold;
  }
}
</style>

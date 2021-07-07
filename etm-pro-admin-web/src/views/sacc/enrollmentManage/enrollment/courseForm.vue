<template>
  <div class="course">
    <etm-form ref="form" :model="formData" :rules="rules">
      <el-form-item v-if="orderType === 'RENEW'" label="会员姓名(中文):" prop="name">
        <el-input v-model="formData.name" disabled />
      </el-form-item>

      <el-form-item v-if="orderType === 'RENEW'" label="会员姓名(英文):">
        <el-input v-model="formData.englishName" disabled />
      </el-form-item>

      <el-form-item label="课程套餐" class="fw-b" prop="coursePrice">
        <div>
          <el-button type="dashed" @click.stop="chooseMenu('carePackage')">
            <i class="el-icon-plus" />
            添加课程
          </el-button>
          <etm-table :data="formData.packages">
            <el-table-column label="套餐名称" prop="carePackageName" />
            <el-table-column label="课程类型" prop="careType" />
            <el-table-column label="套餐时长(月)" prop="duration" />
            <el-table-column label="赠送时长(天)" prop="freeDuration" />
            <el-table-column label="套餐价格(应收)" prop="price" />
            <el-table-column label="套餐价格(实收)" prop="actualPrice" min-width="152" width="152">
              <template slot-scope="scoped">
                <el-input-number
                  v-model="scoped.row.actualPrice"
                  controls-position="right"
                  :min="0"
                  :data-none="scoped"
                  @change="changePackagePrice"
                />
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </el-form-item>

      <el-form-item label="餐费" class="fw-b">
        <div>
          <el-button type="dashed" @click.stop="chooseMenu('meals')">
            <i class="el-icon-plus" />
            添加餐费
          </el-button>
          <etm-table :data="formData.mealses">
            <el-table-column label="餐费名称" prop="mealsPriceName" />
            <el-table-column label="天数" min-width="152" width="152" prop="duration">
              <template slot-scope="scoped">
                <el-input-number
                  v-model="scoped.row.duration"
                  controls-position="right"
                  :min="1"
                  :data-none="scoped"
                  @change="handleDurationChange"
                />
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="price" />
            <el-table-column label="实收单价" prop="actualPrice" />
            <el-table-column label="应收小计" prop="amount" />
            <el-table-column label="实收小计" min-width="152" width="152" prop="actualAmount">
              <template slot-scope="scoped">
                <el-input-number
                  v-model="scoped.row.actualAmount"
                  controls-position="right"
                  :min="0"
                  :data-none="scoped"
                  @change="handleMealPriceChange"
                />
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </el-form-item>

      <el-form-item label="材料物品" class="fw-b">
        <div>
          <span class="sale">
            开启售卖
            <el-switch v-model="formData.sellMaterial" />
          </span>
          <el-button type="dashed" @click.stop="chooseMenu('material')">
            <i class="el-icon-plus" />
            添加物品
          </el-button>

          <etm-table :data="formData.materials">

            <el-table-column label="物品编号" prop="serial" />
            <el-table-column label="物品名称" prop="materialName" />
            <el-table-column label="单位" prop="unit" />
            <el-table-column label="物品类型" prop="materialType">
              <template slot-scope="scoped">
                {{ getMaterialType(scoped.row.materialType) }}
              </template>
            </el-table-column>
            <el-table-column label="销售价格" prop="sellPrice" />
            <el-table-column label="数量" min-width="152" width="152" prop="numbers">
              <template slot-scope="scoped">
                <el-input-number
                  v-model="scoped.row.numbers"
                  controls-position="right"
                  :min="1"
                  :data-none="scoped"
                  @change="changeMaterialNumber($event, scoped.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column slot="right" label="操作">
              <template slot-scope="scoped">
                <etm-text type="primary" @click="removeMeals(scoped.row.materialId)">删除</etm-text>
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </el-form-item>

      <el-form-item label="支付方式:" prop="payType">
        <el-select v-model="formData.payType" placeholder="请选择支付方式">
          <el-option label="微信" value="WECHAT" />
          <el-option label="支付宝" value="ALIPAY" />
          <el-option label="现金" value="CASH" />
          <el-option label="银行转账" value="UNIONPAY" />
          <el-option label="POS机" value="POS" />
        </el-select>
      </el-form-item>

      <el-form-item label="起止日期:" prop="date" class="dateForm">
        <el-row class="rangeBox">
          <el-col :span="11">
            <el-date-picker
              v-model="formData.date[0]"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :placeholder="'开始日期'"
              @change="setDefaultDate"
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="formData.date[1]"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :placeholder="'结束日期'"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="签约日期:">
        <el-date-picker
          v-model="formData.signDate"
          type="date"
          placeholder="请选择日期"
          :clearable="false"
        />
      </el-form-item>

      <el-form-item label="应收总价(元):">
        <el-input v-model="formData.totalAmount" disabled />
      </el-form-item>

      <el-form-item label="实收总价(元):">
        <el-input v-model="formData.actualAmount" disabled />
      </el-form-item>

    </etm-form>

    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-table
        ref="popTable"
        :columns="popTableColumns"
        :data="popTableData"
        :highlight-current-row="popTitle !== '选择物品'"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column v-if="popTitle === '选择物品'" slot="left" type="selection" />
      </etm-table>
    </etm-pop>
  </div>
</template>
<script>
import EtmPop from '@/layout/main/EtmPop/index'
import { getCarePackageEnable, getMealsPriceEnable, getMaterialEnable } from '@/api/sacc/enrollmentManage'

const popOptions = {
  title: {
    carePackage: '选择套餐',
    meals: '选择餐费',
    material: '选择物品'
  },
  columns: {
    carePackage: [
      { label: '套餐名称', prop: 'carePackageName' },
      { label: '套餐时长(月)', prop: 'duration' },
      { label: '赠送课时', prop: 'freeDuration' },
      { label: '课程类型', prop: 'careType' },
      { label: '套餐价格(元)', prop: 'price' }
    ],
    meals: [
      { label: '餐费名称', prop: 'mealsPriceName' },
      { label: '单价(元) / 天', prop: 'price' }
    ],
    material: [
      { label: '物品', prop: 'materialName' },
      { label: '单位', prop: 'unit' },
      { label: '物品类型', prop: 'type' },
      { label: '销售价格', prop: 'sellPrice' }
    ]
  },
  data: {
    carePackage: [],
    meals: [],
    material: []
  }
}
export default {
  components: {
    EtmPop
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    orderType: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    const _this = this
    return {
      rules: {
        coursePrice: [
          {
            required: true, validator(rule, value, cb) {
              if (_this.formData.packages.length) {
                cb()
              } else {
                return cb('请选择课程套餐')
              }
            }
          }
        ],
        date: [
          { required: true, message: '请选择起止日期' }
        ],
        name: [
          { required: true, message: '请输入会员姓名' }
        ],
        payType: [
          { required: true, message: '请选择支付方式' }
        ]
      },
      isSale: false,
      showPop: false,
      popTitle: '',
      popTableColumns: [],
      selection: [],
      popTableData: []
    }
  },
  computed: {},
  watch: {
    formData: {
      handler() {
        this.getTotal()
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() { // 获取套餐、餐费、材料物品
      getCarePackageEnable().then(res => {
        popOptions.data.carePackage = res.data
      })
      getMealsPriceEnable().then(res => {
        popOptions.data.meals = res.data
      })
      getMaterialEnable().then(res => {
        const data = res.data
        data.forEach((item, index) => {
          data[index].type = this.getMaterialType(item.materialType)
        })
        popOptions.data.material = data
      })
    },
    getMaterialType(type) {
      if (!type) return ''
      switch (type) {
        case 'LIVE':
          return '生活用品'
        case 'LEARN':
          return '学习用品'
      }
    },
    chooseMenu(type) { // 打开弹窗
      this.popTitle = popOptions.title[type]
      this.popTableColumns = popOptions.columns[type]
      this.popTableData = popOptions.data[type]
      this.handlePopOpen()
    },
    handlePopOpen() {
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopConfirm() { // 确认选择
      if (!this.selection.length) {
        this.$message.warning('请' + this.popTitle)
        return
      }
      switch (this.popTitle) {
        case '选择套餐':
          this.formData.packages = this.selection
          this.formData.packages[0].actualPrice = this.selection[0].price
          this.setDefaultDate(new Date())
          break
        case '选择餐费':
          this.formData.mealses = this.selection
          this.formData.mealses[0].duration = 1
          this.formData.mealses[0].actualPrice = this.selection[0].price
          this.formData.mealses[0].amount = this.selection[0].price
          this.formData.mealses[0].actualAmount = this.selection[0].price
          break
        case '选择物品':
          this.formData.materials = this.selection
          this.formData.materials.forEach((item, index) => {
            this.formData.materials[index].numbers = 1
          })
      }
      this.showPop = false
    },
    setDefaultDate(date) {
      if (!this.formData.packages.length) return
      this.formData.date = []
      this.formData.date.push(new Date(date))
      const year = new Date(date).getFullYear()
      const month = new Date(date).getMonth() + this.formData.packages[0].duration
      const day = new Date(date).getDate() + this.formData.packages[0].freeDuration - 1
      this.formData.date.push(new Date(year, month, day))
    },
    handlePopCancel() {
      this.showPop = false
    },
    handleSelectionChange(selection) { // 列表选择
      if (this.popTitle === '选择物品') {
        this.selection = selection
      }
    },
    handleCurrentChange(val) { // 列表选择
      if (this.popTitle === '选择套餐' || this.popTitle === '选择餐费') {
        this.selection = [val]
      }
    },
    changePackagePrice() {
      const item = this.formData.packages[0]
      this.formData.packages.splice(0, 1, item)
      this.getTotal()
    },
    handleDurationChange() { // 修改餐费的时长
      this.formData.mealses[0].amount = this.formData.mealses[0].price * this.formData.mealses[0].duration
      this.formData.mealses[0].actualAmount = this.formData.mealses[0].actualPrice * this.formData.mealses[0].duration
      const item = this.formData.mealses[0]
      this.formData.mealses.splice(0, 1, item)
      this.getTotal()
    },
    handleMealPriceChange() { // 修改餐费的实收
      const actualPrice = this.formData.mealses[0].actualAmount / this.formData.mealses[0].duration
      this.formData.mealses[0].actualPrice = actualPrice.toFixed(2)
      const item = this.formData.mealses[0]
      this.formData.mealses.splice(0, 1, item)
      this.getTotal()
    },
    changeMaterialNumber(value, index) { // 修改物品的数量
      const item = this.formData.materials[index]
      this.formData.materials.splice(index, 1, item)
      this.getTotal()
    },
    getTotal() { // 计算总价
      let total = 0
      let actualTotal = 0
      if (this.formData.packages.length) {
        total += this.formData.packages[0].price
        actualTotal += this.formData.packages[0].actualPrice
        this.formData.totalPackageAmount = this.formData.packages[0].price
        this.formData.actualPackageAmount = this.formData.packages[0].actualPrice
      }
      if (this.formData.mealses.length) {
        total += this.formData.mealses[0].amount
        actualTotal += this.formData.mealses[0].actualAmount
        this.formData.totalMealsAmount = this.formData.mealses[0].amount
        this.formData.actualMealsAmount = this.formData.mealses[0].actualAmount
      }
      if (this.formData.sellMaterial && this.formData.materials.length) {
        this.formData.materials.forEach(item => {
          total += (item.sellPrice * item.numbers)
          actualTotal += (item.sellPrice * item.numbers)
        })
      }
      this.formData.totalAmount = Number(total.toFixed(2))
      this.formData.actualAmount = Number(actualTotal.toFixed(2))
    },
    removeMeals(id) { // 删除材料物品
      this.formData.materials.forEach((item, index) => {
        if (id === item.materialId) {
          this.formData.materials.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.course {
  min-width: 900px;

  ::v-deep .el-form {
    max-width: 100% !important;
    width: 100% !important;
  }

  ::v-deep .el-input-number {
    .el-input__inner {
      padding-right: 20px !important;
    }

  }

  ::v-deep .el-input__inner {
    height: 34px;
    line-height: 34px;
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

  ::v-deep .el-table {
    width: 900px;
    margin-left: 100px;

    .el-input {
      width: 100% !important;
      max-width: 100px;
    }

    .el-input__inner {
      height: 32px;
    }
  }

  .sale {
    position: absolute;
    transform: translateX(480px);
  }

  ::v-deep .fw-b label {
    font-weight: bold;
  }

  .dateForm {
    ::v-deep .el-form-item__content {
      margin-left: 300px !important;

      .rangeBox {
        width: 560px !important;

        .el-date-editor.el-input {
          width: 100% !important;
        }

        .line {
          text-align: center;
        }
      }
    }
  }

  ::v-deep .el-input-number {
    .el-input__inner {
      padding-right: 0;
      padding-left: 0;
    }
  }
}
</style>

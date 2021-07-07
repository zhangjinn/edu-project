<template>
  <div class="course">
    <etm-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="会员姓名(中文):" prop="chname">
        <el-input v-model="formData.chname" disabled />
      </el-form-item>

      <el-form-item label="会员姓名(英文):">
        <el-input v-model="formData.enname" disabled />
      </el-form-item>

      <el-form-item label="课程套餐" class="fw-b" prop="coursePrice">
        <div>
          <el-button type="dashed" @click.stop="chooseMenu('course')">
            <i class="el-icon-plus" />
            添加课程
          </el-button>
          <etm-table :data="courseData" :class="{nodata: !courseData.length}">
            <el-table-column label="套餐名称" prop="courseName" />
            <el-table-column label="课程类型" prop="courseType" />
            <el-table-column label="套餐时长(月)" prop="lastTime" />
            <el-table-column label="赠送时长(天)" prop="giveTime" />
            <el-table-column label="套餐价格(应收)" prop="shouldPay" />
            <el-table-column label="套餐价格(实收)" prop="actualPay" min-width="152" width="152">
              <template slot-scope="scoped">
                <el-input-number v-model="formData.coursePrice" controls-position="right" :precision="2" :min="0" :data-none="scoped" />
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </el-form-item>

      <el-form-item label="餐费" class="fw-b">
        <div>
          <el-button type="dashed" @click.stop="chooseMenu('meal')">
            <i class="el-icon-plus" />
            添加餐费
          </el-button>
          <etm-table :data="mealData" :class="{nodata: !mealData.length}">
            <el-table-column label="餐费名称" prop="mealName" />
            <el-table-column label="天数" min-width="152" width="152" prop="days">
              <template slot-scope="scoped">
                <el-input-number v-model="formData.mealDays" controls-position="right" :min="1" :data-none="scoped" @change="handleMealDaysChange" />
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="unitPrice" />
            <el-table-column label="实收单价" prop="actualUnitPrice" />
            <el-table-column label="应收小计" prop="shouldPayCount" />
            <el-table-column label="实收小计" min-width="152" width="152" prop="actualPayCount">
              <template slot-scope="scoped">
                <el-input-number v-model="formData.mealPrice" controls-position="right" :precision="2" :min="0" :data-none="scoped" @change="handleMealPriceChange" />
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </el-form-item>

      <el-form-item label="材料物品" class="fw-b">
        <div>
          <span class="sale">
            开启售卖
            <el-switch v-model="isSale" />
          </span>
          <el-button type="dashed" @click.stop="chooseMenu('item')">
            <i class="el-icon-plus" />
            添加物品
          </el-button>

          <etm-table :data="itemData" :class="{nodata: !itemData.length}">

            <el-table-column label="物品编号" prop="itemNo" />
            <el-table-column label="物品名称" prop="itemName" />
            <el-table-column label="单位" prop="unit" />
            <el-table-column label="物品类型" prop="itemType" />
            <el-table-column label="销售价格" prop="price" />
            <el-table-column label="数量" min-width="152" width="152" prop="quantity">
              <template slot-scope="scoped">
                <el-input-number v-model="formData.itemCounts[scoped.$index]" controls-position="right" :min="1" />
              </template>
            </el-table-column>
          </etm-table>
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
        <el-input v-model="shouldTotal" disabled />
      </el-form-item>

      <el-form-item label="实收总价(元):">
        <el-input v-model="actualTotal" disabled />
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
const popOptions = {
  title: {
    course: '选择套餐',
    meal: '选择餐费',
    item: '选择物品'
  },
  columns: {
    course: [
      { label: '套餐名称', prop: 'courseName' },
      { label: '套餐时长(月)', prop: 'lastTime' },
      { label: '付费课时', prop: 'payTime' },
      { label: '赠送课时', prop: 'giveTime' },
      { label: '课程类型', prop: 'courseType' },
      { label: '套餐价格(元)', prop: 'shouldPay' }
    ],
    meal: [
      { label: '餐费名称', prop: 'mealName' },
      { label: '单价(元) / 天', prop: 'unitPrice' }
    ],
    item: [
      { label: '物品', prop: 'itemName' },
      { label: '单位', prop: 'unit' },
      { label: '物品类型', prop: 'itemType' },
      { label: '销售价格', prop: 'price' }
    ]
  },
  data: {
    course: [
      {
        courseName: '全日托季度套餐',
        lastTime: 3,
        payTime: 66,
        giveTime: 0,
        courseType: '全日托',
        shouldPay: 5000
      },
      {
        courseName: '半日托季度套餐',
        lastTime: 6,
        payTime: 132,
        giveTime: 15,
        courseType: '半日托',
        shouldPay: 3500
      },
      {
        courseName: '晚托月套餐',
        lastTime: 6,
        payTime: 132,
        giveTime: 15,
        courseType: '晚托',
        shouldPay: 1500
      }
    ],
    meal: [
      {
        mealName: '全托班餐费',
        unitPrice: 3
      },
      {
        mealName: '半日托季度餐费',
        unitPrice: 6
      }
    ],
    item: [
      {
        itemName: '物品名称1',
        unit: 3,
        itemType: 'a',
        price: 1
      },
      {
        itemName: '物品名称2',
        unit: 6,
        itemType: 'b',
        price: 15
      },
      {
        itemName: '物品名称3',
        unit: 6,
        itemType: 'c',
        price: 15
      }
    ]
  }
}
export default {
  components: {
    EtmPop
  },
  data() {
    const _this = this
    return {
      formData: {
        chname: '薏米',
        enname: 'yimi',
        payMethod: '',
        duration: [new Date(), new Date()],
        signDate: '',
        coursePrice: 0,
        mealDays: 1,
        mealPrice: 0,
        itemCounts: []
      },
      rules: {
        coursePrice: [
          { required: true, validator(rule, value, cb) {
            if (_this.courseData.length) {
              cb()
            } else {
              return cb('请选择课程套餐')
            }
          } }
        ],
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
      mealData: [],
      itemData: [],
      isSale: false,
      showPop: false,
      popTitle: '',
      popTableColumns: [],
      selection: [],
      popTableData: [],
      itemTotalPrice: 0,
      shouldTotal: '0.00',
      actualTotal: '0.00'
    }
  },
  computed: {
    itemCounts() {
      return this.formData.itemCounts
    },
    coursePrice() {
      return this.formData.coursePrice
    },
    mealPrice() {
      return this.formData.mealPrice
    }
  },
  watch: {
    itemCounts: {
      handler(v) {
        if (v.length) {
          this.itemTotalPrice = 0
          for (let i = 0; i < v.length; i++) {
            this.itemTotalPrice += v[i] * this.itemData[i].price
          }
          if (this.isSale) {
            this.handleShouldTotal()
            this.handleActualTotal()
          }
        }
      },
      deep: true
    },
    coursePrice() {
      this.handleActualTotal()
    },
    mealPrice() {
      this.handleActualTotal()
    },
    courseData: {
      handler(v) {
        this.handleShouldTotal()
      },
      deep: true
    },
    mealData: {
      handler(v) {
        this.handleShouldTotal()
      },
      deep: true
    },
    isSale() {
      this.handleShouldTotal()
      this.handleActualTotal()
    }
  },
  methods: {
    chooseMenu(type) {
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
    handlePopConfirm() {
      switch (this.popTitle) {
        case '选择套餐':
          this.courseData = this.selection
          this.formData.coursePrice = this.courseData[0].shouldPay
          break
        case '选择餐费':
          this.mealData = this.selection
          this.formData.mealDays = 1
          this.mealData[0].shouldPayCount = this.mealData[0].unitPrice
          this.mealData[0].actualUnitPrice = this.mealData[0].unitPrice
          this.formData.mealPrice = this.mealData[0].shouldPayCount
          break
        case '选择物品':
          this.formData.itemCounts = new Array(this.selection.length).fill(1)
          this.itemData = this.selection
      }
      this.showPop = false
    },
    handlePopCancel() {
      this.showPop = false
    },
    handleSelectionChange(selection) {
      if (this.popTitle === '选择物品') {
        this.selection = selection
      }
    },
    handleCurrentChange(val) {
      if (this.popTitle === '选择套餐' || this.popTitle === '选择餐费') {
        this.selection = [val]
      }
    },
    handleMealDaysChange(val) {
      this.mealData[0].shouldPayCount = this.mealData[0].unitPrice * val
      this.formData.mealPrice = this.mealData[0].shouldPayCount
      this.mealData[0].actualUnitPrice = this.formData.mealPrice / val
      this.shouldTotal = (this.courseData[0] ? this.courseData[0].shouldPay : 0) + (this.mealData[0] ? this.mealData[0].shouldPayCount : 0) + (this.isSale ? this.itemTotalPrice : 0)
    },
    handleMealPriceChange(val) {
      this.mealData[0].actualUnitPrice = val / this.formData.mealDays
    },
    handleActualTotal() {
      this.actualTotal = this.coursePrice + this.mealPrice + (this.isSale ? this.itemTotalPrice : 0)
    },
    handleShouldTotal() {
      this.shouldTotal = (this.courseData[0] ? this.courseData[0].shouldPay : 0) + (this.mealData[0] ? this.mealData[0].shouldPayCount : 0) + (this.isSale ? this.itemTotalPrice : 0)
    },
    validateForm() {
      this.$refs.form.$children[0].validate((valid, obj) => {
        // console.log(valid, obj)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.course {
  min-width: 900px;
  ::v-deep .el-form {
    max-width: 100%!important;
    width: 100%!important;
  }
  ::v-deep .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 24px;
  }
  ::v-deep .el-input {
    width: 560px!important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0!important;
  }
  ::v-deep .el-select {
    width: auto!important;
  }
  ::v-deep .el-form-item__error {
    margin-left: 300px;
  }
  .duration {
    width: 560px!important;
  }
  ::v-deep .el-button {
    margin: 0 0 16px 594px;
  }
  ::v-deep .el-table {
    width: 900px;
    margin-left: 100px;
    .el-input {
      width: 100%!important;
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
  ::v-deep .nodata {
    .el-table__body-wrapper {
      display: none;
    }
  }
}
</style>

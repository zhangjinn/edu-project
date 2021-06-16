<template>
  <div class="chargeForm-wrap">
    <etm-form
      :model="formData"
      :rules="rule"
      type="dialog"
    >
      <el-form-item
        label="账单名称"
        prop="orderBunchName"
      >
        <el-input
          ref="first"
          v-model="formData.orderBunchName"
          placeholder="请输入账单名称（不能超过10字）"
        />
      </el-form-item>
      <el-form-item
        label="收费方式"
        prop="chargeType"
      >
        <el-radio-group
          v-model="formData.chargeType"
          @change="changeChargeType"
        >
          <el-radio label="PER_MONTH">
            按月
          </el-radio>
          <el-radio label="PER_TERM">
            按学期
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.chargeType === 'PER_MONTH'"
        label="收费时段"
        prop="chargeRangeTime"
      >
        <el-date-picker
          v-model="formData.chargeRangeTime"
          type="monthrange"
          range-separator="至"
          :clearable="false"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item
        v-else
        label="收费时段"
        prop="termId"
      >
        <el-select
          v-model="formData.termId"
          @change="changeTerm"
        >
          <el-option
            v-for="(item, index) in termList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="发送类型"
        prop="type"
      >
        <el-radio-group v-model="formData.type">
          <el-radio label="PER_CHILD">
            按幼儿
          </el-radio>
          <el-radio label="PER_CLAZZ">
            按班
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.type === 'PER_CHILD'"
        label="接收对象"
        prop="childTargets"
      >
        <div class="childSelect">
          <el-tag
            v-for="(tag, index) in formData.childTargets"
            :key="index"
            closable
            @close="removeTag(index)"
          >
            {{ tag.childName }}
          </el-tag>
          <el-button
            type="dashed"
            @click="selectChild"
          >
            <i class="iconfont iconplus" />选择幼儿
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        v-else
        label="接收对象"
        prop="clazzTargets"
      >
        <div class="clazz">
          <etm-clazz-cascader @change="getClazz($event, 'selectClazz')" />
        </div>
      </el-form-item>
      <el-form-item prop="noticeParent">
        <span slot="label">
          <el-tooltip
            effect="light"
            popper-class="stepTips"
            :visible-arrow="false"
            placement="bottom-start"
          >
            <span>通知家长<i class="iconfont iconquestion-circle" /></span>
            <div slot="content">
              <img src="../../../../../assets/images/guardcare/bg.png">
            </div>
          </el-tooltip>
        </span>
        <el-radio-group v-model="formData.noticeParent">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="使用订金"
        prop="usingDeposit"
      >
        <el-radio-group v-model="formData.usingDeposit">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </etm-form>
    <div class="itemTable">
      <etm-title>收费项目</etm-title>
      <div class="buttonBox">
        <el-button
          type="dashed"
          @click="selectPrice"
        >
          <i class="iconfont iconplus" />选择费用
        </el-button>
        <el-button
          type="dashed"
          @click="selectMaterial"
        >
          <i class="iconfont iconplus" />选择物品
        </el-button>
        <el-button
          type="dashed"
          @click="selectCourse"
        >
          <i class="iconfont iconplus" />选择特色课课程
        </el-button>
      </div>
      <div class="rowBox">
        <div class="row rowTitle">
          <div
            class="col colHeader"
            style="width: 26%;"
          >
            项目名称
          </div>
          <div
            class="col colHeader"
            style="width: 18%;"
          >
            单价
          </div>
          <div
            class="col colHeader"
            style="width: 21%;"
          >
            数量/月份
          </div>
          <div
            class="col colHeader"
            style="width: 28%;"
          >
            小计
          </div>
          <div
            class="col colHeader"
            style="width: 7%;"
          />
        </div>
        <div class="rowBody">
          <div
            v-for="(orderItem, index) in formData.orderBunchItemList"
            :key="index"
            class="itemColumn"
          >
            <div class="row column">
              <div
                class="col colItem"
                style="width: 26%;"
              >
                <div class="itemImg">
                  <img src="../../../../../assets/images/etm-logo.png">
                </div>
                <div class="name">
                  {{ orderItem.orderBunchItemName }}
                </div>
              </div>
              <div
                class="col colItem"
                style="width: 18%;"
              >
                <div v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">
                  <div class="actual">
                    实收：¥ {{ formatMoney(orderItem.orderItemItemList[0].actualUnitAmount) }}
                  </div>
                  <div class="origin">
                    应收：¥ {{ formatMoney(orderItem.orderItemItemList[0].unitAmount) }}
                  </div>
                </div>
                <div v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">
                  <div class="actual">
                    实收：¥ {{ formatMoney(orderItem.actualUnitAmount) }}
                  </div>
                  <div class="origin">
                    应收：¥ {{ formatMoney(orderItem.unitAmount) }}
                  </div>
                </div>
              </div>
              <div
                class="col colItem"
                style="width: 21%;"
              >
                <template v-if="orderItem.itemType === '物品费用' && orderItem.property === 'cycle'">
                  <div v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">
                    {{ transferMonth(orderItem.orderItemItemList[0].month) }}
                  </div>
                  <div v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">
                    <span class="disabledNumber">{{ orderItem.number }}</span>
                  </div>
                </template>
                <el-input-number
                  v-else
                  v-model="orderItem.number"
                  :min="1"
                  class="number"
                  @change="changeNumber($event, index)"
                />
                <span>
                  {{
                    orderItem.itemType === '物品' ? orderItem.company : orderItem.itemType === '物品费用' && orderItem.property === 'once' ? '笔' : ''
                  }}
                </span>
              </div>
              <div
                class="col colItem"
                style="width: 28%;"
              >
                <div class="colSubtotal">
                  <div
                    v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1"
                    class="actualInput"
                  >
                    实收：¥
                    <el-input-number
                      v-model="orderItem.orderItemItemList[0].actualAmount"
                      controls-position="right"
                      :min="0"
                      @change="changChildTotal($event, 0, index)"
                    />
                  </div>
                  <div v-else-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length > 1">
                    实收：¥
                    {{ formatMoney(orderItem.actualAmount) }}
                  </div>
                  <div
                    v-else
                    class="actualInput"
                  >
                    实收：¥
                    <el-input-number
                      v-model="orderItem.actualAmount"
                      controls-position="right"
                      :min="0"
                      @change="changeTotal($event, index)"
                    />
                  </div>
                  <div class="origin">
                    应收：¥ {{ formatMoney(orderItem.totalAmount) }}
                  </div>
                </div>
              </div>
              <div
                class="col colItem"
                style="width: 7%;"
              >
                <etm-text
                  type="danger"
                  @click="removeItem(index)"
                >
                  删除
                </etm-text>
              </div>
            </div>
            <template v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length > 1">
              <div
                v-for="(orderItemItem, ind) in orderItem.orderItemItemList"
                :key="ind"
                class="row childColumn"
              >
                <div
                  class="col colItem"
                  style="width: 26%;"
                />
                <div
                  class="col colItem"
                  style="width: 18%;"
                >
                  <div>
                    <div class="actual">
                      实收：¥ {{ formatMoney(orderItemItem.actualUnitAmount) }}
                    </div>
                    <div class="origin">
                      应收：¥ {{ formatMoney(orderItemItem.unitAmount) }}
                    </div>
                  </div>
                </div>
                <div
                  class="col colItem"
                  style="width: 21%;"
                >
                  <span>{{ transferMonth(orderItemItem.month) }}</span>
                </div>
                <div
                  class="col colItem"
                  style="width: 28%;"
                >
                  <div class="colSubtotal">
                    <div class="actualInput">
                      实收：¥
                      <el-input-number
                        v-model="orderItemItem.actualAmount"
                        controls-position="right"
                        :min="0"
                        @change="changChildTotal($event, ind, index)"
                      />
                    </div>
                    <div class="origin">
                      应收：¥ {{ formatMoney(orderItemItem.totalAmount) }}
                    </div>
                  </div>
                </div>
                <div
                  class="col colItem"
                  style="width: 7%;"
                />
              </div>
            </template>
          </div>
          <etm-empty v-if="!formData.orderBunchItemList.length" />
        </div>
      </div>
    </div>
    <etm-pop
      v-if="showSelPop"
      :visible="showSelPop"
      pop="complex"
      :title="selPopTitle"
      confirm-btn="选好了"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="selPop">
        <div class="search">
          <template v-if="selPopType === 'child'">
            <etm-clazz-cascader @change="getClazz($event, 'searchChild')" />
            <el-input
              v-model="searchInfo.childName"
              prefix-icon="el-icon-search"
              placeholder="请输入幼儿姓名"
            />
            <el-button
              type="primary"
              @click="search"
            >
              搜索
            </el-button>
          </template>
          <el-input
            v-if="selPopType === 'materialPrice'"
            v-model="searchInfo.materialPriceValue"
            prefix-icon="el-icon-search"
            placeholder="请输入收费科目名称"
            @keyup.enter.native="search"
          />
          <el-input
            v-if="selPopType === 'material'"
            v-model="searchInfo.materialValue"
            prefix-icon="el-icon-search"
            placeholder="请输入物品名称"
            @keyup.enter.native="search"
          />
          <el-input
            v-if="selPopType === 'course'"
            v-model="searchInfo.courseValue"
            prefix-icon="el-icon-search"
            placeholder="请输入课程名称"
            @keyup.enter.native="search"
          />
        </div>
        <etm-table
          ref="selTable"
          selection
          :columns="column"
          :data="selTableData"
          :span-method="objectSpanMethod"
          @selection-change="selectItem"
        >
          <template v-if="selPopType === 'child'">
            <el-table-column
              slot="right"
              label="性别"
            >
              <template slot-scope="scoped">
                {{ scoped.row.gender === 'MALE' ? '男' : scoped.row.gender === 'FEMALE' ? '女' : '' }}
              </template>
            </el-table-column>
          </template>
          <template v-if="selPopType === 'materialPrice'">
            <el-table-column
              slot="right"
              label="单价"
            >
              <template slot-scope="scoped">
                {{ scoped.row.price + (scoped.row.property === 'once' ? '元/笔' : '元/月') }}
              </template>
            </el-table-column>
          </template>
        </etm-table>
      </div>
    </etm-pop>
  </div>
</template>

<script>

import {
  querySpecialCourseList,
  queryMaterialList,
  queryClazzById
} from '@/api/newDaycare/orderManage'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader/index'
import { queryGuardChildList } from '@/api/newDaycare/childManageGuard'
import { queryPriceStandardList } from '@/api/newDaycare/priceGuard'
import { getSemesterSetting } from '@/api/newDaycare/listEduGuardScheduleManage'
import { parseTime } from '@/utils'

/**
 * chargeForm create by Administrator
 * createTime 2020/8/20 17:29
 */
export default {
  name: 'ChargeForm',
  components: {
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      termList: [],
      rule: {
        orderBunchName: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('账单名称不能为空'))
            } else if (value.length > 10) {
              callback(new Error('账单名称不能超过10个字'))
            } else {
              callback()
            }
          }
        }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        chargeType: [{ required: true, message: '不能为空', trigger: 'change' }],
        chargeRangeTime: [{ required: true, message: '不能为空', trigger: 'change' }],
        termId: [{ required: true, message: '不能为空', trigger: 'change' }],
        childTargets: [{ required: true, message: '接收对象不能为空', trigger: 'change' }],
        clazzTargets: [{ required: true, message: '接收对象不能为空', trigger: 'change' }],
        noticeParent: [{ required: true, message: '不能为空', trigger: 'change' }],
        usingDeposit: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      showSelPop: false,
      selPopTitle: '',
      selPopType: '',
      column: [],
      selTableData: [],
      rowNum: [],
      childSelection: [], // 幼儿弹窗选中的数据
      materialSelection: [], // 物品弹窗选中的数据
      materialPriceSelection: [], // 费用弹窗选中的数据
      courseSelection: [], // 课程弹窗选中的数据
      searchInfo: {}
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.first.focus()
    })
    this.getTerm()
  },
  methods: {
    getTerm () {
      getSemesterSetting().then(res => {
        this.termList = res.data
      })
    },
    getClazz (value, type) {
      if (type === 'searchChild') {
        this.searchInfo.clazzValue = value
      } else {
        this.formData.clazzTargets = value
        this.formData.sendTargetList = []
        if (value.length) {
          queryClazzById({ id: value[1] }).then(res => {
            this.formData.sendTargetList.push(res.data.name)
          })
        }
      }
    },
    getChild () { // 请求幼儿列表
      const param = {}
      if (this.searchInfo.childName) {
        param.childName = this.searchInfo.childName
      }
      if (this.searchInfo.clazzValue) {
        param.clazzId = this.searchInfo.clazzValue[1]
      }
      queryGuardChildList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    getMaterial () { // 请求物品列表
      const param = {}
      if (this.searchInfo.materialValue) {
        param.name = this.searchInfo.materialValue
      }
      queryMaterialList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    getMaterialPrice () { // 请求费用列表
      const param = {
        paged: false,
        enable: true
      }
      if (this.searchInfo.materialPriceValue) {
        param.name = this.searchInfo.materialPriceValue
      }
      queryPriceStandardList(param).then(res => {
        const tableData = []
        this.rowNum = []
        res.data.forEach(item => {
          this.rowNum.push(item.standardList.length)
          item.standardList.forEach(list => {
            const data = {
              id: item.id,
              name: item.name,
              property: item.property,
              materialPriceStandardId: list.id,
              materialPriceStandardName: list.name,
              materialPriceId: list.materialPriceId,
              price: list.price
            }
            tableData.push(data)
          })
        })
        this.selTableData = tableData
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (this.selPopType === 'materialPrice') { // 费用
        if (column.property === 'name') {
          let num = 0
          let flag = false
          for (let i = 0; i < this.rowNum.length; i++) {
            if (rowIndex === this.addNum(i - 1)) {
              num = i
              flag = true
            }
          }
          if (flag) {
            return {
              rowspan: this.rowNum[num],
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    addNum (index) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      this.rowNum.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    getCourse () {
      const param = {
        paged: false,
        pageNum: 1,
        pageSize: 999,
        enable: true
      }
      if (this.searchInfo.courseValue) {
        param.name = this.searchInfo.courseValue
      }
      querySpecialCourseList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    search () { // 弹窗里搜索
      if (this.selPopType === 'materialPrice') { // 费用
        this.getMaterialPrice()
      } else if (this.selPopType === 'material') { // 物品
        this.getMaterial()
      } else if (this.selPopType === 'child') { // 幼儿
        this.getChild()
      } else if (this.selPopType === 'course') { // 课程
        this.getCourse()
      }
    },
    selectChild () { // 选择幼儿弹窗
      this.selTableData = []
      this.selPopTitle = '选择幼儿'
      this.selPopType = 'child'
      this.column = [
        {
          label: '幼儿姓名',
          prop: 'childName'
        },
        {
          label: '班级',
          prop: 'clazzName'
        }
      ]
      this.getChild()
      this.showSelPop = true
    },
    removeTag (index) {
      const childId = this.formData.childTargets[index].childId
      this.childSelection.forEach((item, i) => {
        if (item.childId === childId) {
          this.childSelection.splice(i, 1)
        }
      })
      this.formData.childTargets.splice(index, 1)
    },
    selectPrice () { // 选择费用弹窗
      this.selTableData = []
      this.selPopTitle = '选择费用'
      this.selPopType = 'materialPrice'
      this.column = [
        {
          label: '收费科目',
          prop: 'name'
        },
        {
          label: '费用标准',
          prop: 'materialPriceStandardName'
        }
      ]
      this.getMaterialPrice()
      this.showSelPop = true
    },
    selectMaterial () { // 选择物品弹窗
      this.selTableData = []
      this.selPopTitle = '选择物品'
      this.selPopType = 'material'
      this.column = [
        {
          label: '物品名称',
          prop: 'materialName'
        },
        {
          label: '单价（元）',
          prop: 'price'
        }
      ]
      this.getMaterial()
      this.showSelPop = true
    },
    selectCourse () {
      this.selTableData = []
      this.selPopTitle = '选择课程'
      this.selPopType = 'course'
      this.column = [
        {
          label: '课程名称',
          prop: 'name'
        },
        {
          label: '单价（元）',
          prop: 'price'
        }
      ]
      this.getCourse()
      this.showSelPop = true
    },
    selectItem (val) { // 各类型弹窗赋值
      if (this.selPopType === 'materialPrice') { // 费用选中数据缓存
        this.materialPriceSelection = val
      } else if (this.selPopType === 'material') { // 物品选中数据缓存
        this.materialSelection = val
      } else if (this.selPopType === 'child') { // 幼儿选中数据缓存
        this.childSelection = val
      } else if (this.selPopType === 'course') { // 课程选中数据缓存
        this.courseSelection = val
      }
    },
    setSelection () { // 打开弹窗选中已选择的数据
      const arr = []
      for (let i = 0; i < this.selTableData.length; i++) {
        if (this.selPopType === 'materialPrice') { // 费用
          for (let v = 0; v < this.materialPriceSelection.length; v++) {
            if (this.selTableData[i].materialPriceStandardId === this.materialPriceSelection[v].materialPriceStandardId) {
              arr.push(this.selTableData[i])
            }
          }
        } else if (this.selPopType === 'material') { // 物品
          for (let v = 0; v < this.materialSelection.length; v++) {
            if (this.selTableData[i].materialId === this.materialSelection[v].materialId) {
              arr.push(this.selTableData[i])
            }
          }
        } else if (this.selPopType === 'child') { // 幼儿
          for (let v = 0; v < this.childSelection.length; v++) {
            if (this.selTableData[i].childId === this.childSelection[v].childId) {
              arr.push(this.selTableData[i])
            }
          }
        } else if (this.selPopType === 'course') { // 课程
          for (let v = 0; v < this.courseSelection.length; v++) {
            if (this.selTableData[i].id === this.courseSelection[v].id) {
              arr.push(this.selTableData[i])
            }
          }
        }
      }
      arr.forEach(row => { // 选中数据
        this.$refs.selTable.$children[0].toggleRowSelection(row)
      })
    },
    handlePopClose () {
      this.searchInfo = {}
      this.showSelPop = false
    },
    changeChargeType (val) {
      this.formData.orderBunchItemList.forEach(bunch => {
        if (bunch.itemType === '物品费用' && bunch.property === 'cycle') {
          bunch.orderItemItemList = []
        }
      })
      if (val === 'PER_MONTH') {
        this.changeDate(this.formData.chargeRangeTime)
      } else {
        this.changeTerm(this.formData.termId)
      }
    },
    changeDate (val) {
      const monthStart = this.transferMonth(val[0])
      const monthEnd = this.transferMonth(val[1])
      const timeArr = this.getYearAndMonth(monthStart, monthEnd)
      this.changeTableData(timeArr)
    },
    changeTerm (val) {
      let monthStart = null
      let monthEnd = null
      this.termList.forEach(list => {
        if (list.id === val) {
          monthStart = this.transferMonth(list.startDate)
          monthEnd = this.transferMonth(list.endDate)
        }
      })
      const timeArr = this.getYearAndMonth(monthStart, monthEnd)
      this.changeTableData(timeArr)
    },
    changeTableData (arr) {
      this.formData.orderBunchItemList.forEach((bunch, index) => {
        if (bunch.itemType === '物品费用' && bunch.property === 'cycle') {
          const orderItemItemList = JSON.parse(JSON.stringify(bunch.orderItemItemList)) // 另存收费项目列表
          bunch.orderItemItemList = []
          for (let i = 0; i < arr.length; i++) {
            let flag = true
            orderItemItemList.forEach(item => {
              if (item.month === arr[i]) {
                bunch.orderItemItemList.push(item)
                flag = false
              }
            })
            if (flag) {
              const itemData = {
                itemType: '物品费用',
                orderItemName: bunch.orderBunchItemName,
                number: 1,
                month: arr[i],
                unitAmount: bunch.unitAmount,
                actualUnitAmount: bunch.actualUnitAmount,
                totalAmount: bunch.unitAmount,
                actualAmount: bunch.actualUnitAmount
              }
              bunch.orderItemItemList.push(itemData)
            }
          }
          if (bunch.orderItemItemList.length) {
            let totalAmount = 0
            let actualAmount = 0
            bunch.orderItemItemList.forEach(item => {
              totalAmount += item.totalAmount
              actualAmount += item.actualAmount
            })
            bunch.totalAmount = totalAmount
            bunch.actualAmount = actualAmount
          } else {
            bunch.totalAmount = bunch.unitAmount
            bunch.actualAmount = bunch.actualUnitAmount
          }
          const itemList = bunch
          this.formData.orderBunchItemList.splice(index, 1, itemList)
        }
      })
    },
    handlePopConfirm () {
      if (this.selPopType === 'materialPrice') { // 选择费用
        // 判断收费项目表格的数据是否再次选中
        this.filterData(this.materialPriceSelection, '物品费用')
        // 循环选中的数据
        this.materialPriceSelection.forEach(item => {
          // 判断选中的数据是否已在收费项目表格
          let flag = false
          for (let v = 0; v < this.formData.orderBunchItemList.length; v++) {
            const selection = this.formData.orderBunchItemList[v]
            if (selection.itemType === '物品费用' && selection.originId === item.materialPriceStandardId) {
              flag = true
            }
          }
          // 不在收费项目表格则插入数据
          if (!flag) {
            const data = {}
            data.itemType = '物品费用'
            data.originId = item.materialPriceStandardId
            data.orderBunchItemName = item.name
            data.number = 1
            data.unitAmount = item.price
            data.actualUnitAmount = item.price
            data.totalAmount = item.price
            data.actualAmount = item.price
            data.property = item.property
            if (item.property === 'cycle') {
              data.orderItemItemList = []
              let monthStart = null
              let monthEnd = null
              if (this.formData.chargeType === 'PER_MONTH') {
                monthStart = this.formData.chargeRangeTime[0]
                monthEnd = this.formData.chargeRangeTime[1]
              } else {
                this.termList.forEach(list => {
                  if (list.id === this.formData.termId) {
                    monthStart = list.startDate
                    monthEnd = list.endDate
                  }
                })
              }
              if (monthStart && monthEnd) {
                monthStart = this.transferMonth(monthStart)
                monthEnd = this.transferMonth(monthEnd)
                const timeArr = this.getYearAndMonth(monthStart, monthEnd)
                data.totalAmount = item.price * timeArr.length
                data.actualAmount = item.price * timeArr.length
                for (let i = 0; i < timeArr.length; i++) {
                  const itemData = {
                    itemType: '物品费用',
                    orderItemName: item.name,
                    number: 1,
                    month: timeArr[i],
                    unitAmount: item.price,
                    actualUnitAmount: item.price,
                    totalAmount: item.price,
                    actualAmount: item.price
                  }
                  data.orderItemItemList.push(itemData)
                }
              }
            }
            this.formData.orderBunchItemList.push(data)
          }
        })
      } else if (this.selPopType === 'material') { // 选择物品
        // 判断收费项目表格的数据是否再次选中
        this.filterData(this.materialSelection, '物品')
        // 循环选中的数据
        this.materialSelection.forEach(item => {
          // 判断选中的数据是否已在收费项目表格
          let flag = false
          for (let v = 0; v < this.formData.orderBunchItemList.length; v++) {
            const selection = this.formData.orderBunchItemList[v]
            if (selection.itemType === '物品' && selection.originId === item.materialId) {
              flag = true
            }
          }
          // 新数据不在收费项目表格
          if (!flag) {
            const data = {}
            data.itemType = '物品'
            data.originId = item.materialId
            data.orderBunchItemName = item.materialName
            data.number = 1
            data.unitAmount = item.price
            data.actualUnitAmount = item.price
            data.totalAmount = item.price
            data.actualAmount = item.price
            if (item.company && item.company !== '--') {
              data.company = item.company
            }
            this.formData.orderBunchItemList.push(data)
          }
        })
      } else if (this.selPopType === 'child') { // 选择幼儿
        this.formData.childTargets = this.childSelection
      } else if (this.selPopType === 'course') { // 选择课程
        this.filterData(this.courseSelection, '课程')
        this.courseSelection.forEach(item => {
          // 判断选中的数据是否已在收费项目表格
          let flag = false
          for (let v = 0; v < this.formData.orderBunchItemList.length; v++) {
            const selection = this.formData.orderBunchItemList[v]
            if (selection.itemType === '课程' && selection.originId === item.id) {
              flag = true
            }
          }
          // 不在收费项目表格则插入数据
          if (!flag) {
            const data = {}
            data.itemType = '课程'
            data.originId = item.id
            data.orderBunchItemName = item.name
            data.number = 1
            data.unitAmount = item.price
            data.actualUnitAmount = item.price
            data.totalAmount = item.price
            data.actualAmount = item.price
            this.formData.orderBunchItemList.push(data)
          }
        })
      }
      this.searchInfo = {}
      this.showSelPop = false
    },
    filterData (data, type) {
      for (let i = 0; i < this.formData.orderBunchItemList.length; i++) {
        if (this.formData.orderBunchItemList[i].itemType === type) {
          let flag = false
          for (let o = 0; o < data.length; o++) {
            if (type === '物品费用') {
              if (this.formData.orderBunchItemList[i].originId === data[o].materialPriceStandardId) {
                flag = true
              }
            } else if (type === '物品') {
              if (this.formData.orderBunchItemList[i].originId === data[o].materialId) {
                flag = true
              }
            } else if (type === '课程') {
              if (this.formData.orderBunchItemList[i].originId === data[o].id) {
                flag = true
              }
            }
          }
          // 未再次选中，删除这一项
          if (!flag) {
            this.formData.orderBunchItemList.splice(i, 1)
            i--
          }
        }
      }
    },
    handlePopCancel () {
      this.searchInfo = {}
      this.showSelPop = false
    },
    changeNumber (value, index) { // 收费项目的数量改变重新计算小计
      if (!value) {
        value = 1
        this.formData.orderBunchItemList[index].number = 1
      }
      this.formData.orderBunchItemList[index].totalAmount = value * this.formData.orderBunchItemList[index].unitAmount
      this.formData.orderBunchItemList[index].actualAmount = value * this.formData.orderBunchItemList[index].actualUnitAmount
    },
    changeTotal (value, index) { // 实收小计改变计算实收单价
      if (!value) {
        value = 0
        this.formData.orderBunchItemList[index].actualAmount = 0
      }
      const price = (value / this.formData.orderBunchItemList[index].number).toFixed(2)
      this.formData.orderBunchItemList[index].actualUnitAmount = Number(price)
    },
    changChildTotal (value, ind, index) {
      if (!value) {
        value = 0
        this.formData.orderBunchItemList[index].orderItemItemList[ind].actualAmount = 0
      }
      const actualAmount = this.formData.orderBunchItemList[index].actualAmount - this.formData.orderBunchItemList[index].orderItemItemList[ind].actualUnitAmount
      this.formData.orderBunchItemList[index].orderItemItemList[ind].actualUnitAmount = value
      this.formData.orderBunchItemList[index].actualAmount = actualAmount + value
    },
    removeItem (index) { // 删除收费项目
      const id = this.formData.orderBunchItemList[index].originId
      if (this.formData.orderBunchItemList[index].itemType === '物品费用') {
        this.materialPriceSelection.forEach((item, i) => {
          if (id === item.materialPriceStandardId) {
            this.materialPriceSelection.splice(i, 1)
          }
        })
      } else if (this.formData.orderBunchItemList[index].itemType === '物品') {
        this.materialSelection.forEach((item, i) => {
          if (id === item.materialId) {
            this.materialSelection.splice(i, 1)
          }
        })
      } else if (this.formData.orderBunchItemList[index].itemType === '课程') {
        this.courseSelection.forEach((item, i) => {
          if (id === item.id) {
            this.courseSelection.splice(i, 1)
          }
        })
      }
      this.formData.orderBunchItemList.splice(index, 1)
    },
    getYearAndMonth (start, end) {
      const result = []
      if (start && end) {
        const starts = start.split('-')
        const ends = end.split('-')
        let staYear = parseInt(starts[0])
        let staMon = parseInt(starts[1])
        const endYear = parseInt(ends[0])
        const endMon = parseInt(ends[1])
        while (staYear <= endYear) {
          if (staYear === endYear) {
            while (staMon <= endMon) {
              const str = staYear + '-' + (staMon >= 10 ? staMon : '0' + staMon) + '-01'
              result.push(str)
              staMon++
            }
            staYear++
          } else {
            const str = staYear + '-' + (staMon >= 10 ? staMon : '0' + staMon) + '-01'
            result.push(str)
            staMon++
            if (staMon > 12) {
              staMon = 1
              staYear++
            }
          }
        }
      }
      return result
    },
    transferMonth (time) {
      if (time) {
        return parseTime(time, '{y}-{m}')
      } else {
        return time
      }
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeForm-wrap {
  .iconplus {
    font-size: 12px;
    font-weight: bold;
  }

  .childSelect {
    .el-tag {
      height: 32px;
      line-height: 32px;
      margin: 0 8px 8px 0;
    }
  }

  ::v-deep .el-cascader {
    height: 32px;
    width: 100%;
  }

  .buttonBox {
    padding-bottom: 16px;
    text-align: left;

    .el-button + .el-button {
      margin-left: 8px;
    }
  }

  .selectBox {
    .iconfont {
      @include c_warn_color();
      cursor: pointer;
    }
  }

  .itemTable {
    .rowBox {
      font-size: 14px;

      .row,
      .col {
        align-items: center;
        display: flex;
        justify-content: center;
        padding: 0 10px;
      }

      .rowTitle {
        background: #fafafa;

        .colHeader {
          color: #9a9a9a;
          height: 42px;
        }
      }

      .rowBody {
        .itemColumn {
          border-bottom: 1px solid #eee;
          border-top: 1px solid #eee;

          &:not(:first-child) {
            margin-top: 16px;
          }

          .column {
            padding: 16px 0;
          }

          .childColumn {
            border-top: 1px dashed #eee;
            padding: 16px 0;
          }

          .colItem {
            .itemImg {
              @include bgc_divide_color();
              border-radius: 2px;
              height: 54px;
              margin-right: 15px;
              padding-top: 11px;
              text-align: center;
              width: 100px;

              img {
                width: 32px;
              }
            }

            .colSubtotal {
              width: 160px;

              .el-input-number {
                width: 100px;
              }
            }

            .name {
              flex: 1 1 0%;
              text-align: left;
            }

            .actual {
              height: 14px;
              line-height: 14px;
            }

            .actualInput {
              height: 32px;
              line-height: 32px;

              ::v-deep input {
                padding: 0 12px;
                width: 100px;
              }

              ::v-deep .el-input-number__increase {
                display: none;
              }

              ::v-deep .el-input-number__decrease {
                display: none;
              }
            }

            .origin {
              @include c_secondary_color();
              height: 14px;
              line-height: 14px;
              margin-top: 16px;
            }
          }
        }
      }
    }

    .itemName {
      display: flex;

      .itemImg {
        @include bgc_divide_color();
        border-radius: 2px;
        height: 54px;
        margin-right: 15px;
        padding-top: 11px;
        text-align: center;
        width: 100px;

        img {
          width: 32px;
        }
      }

      .name {
        max-width: 130px;
      }
    }

    .actual {
      height: 14px;
      line-height: 14px;
    }

    .disabledNumber {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      display: inline-block;
      height: 32px;
      line-height: 30px;
      text-align: center;
      width: 130px;
    }

    .actualInput {
      height: 32px;
      line-height: 32px;

      ::v-deep .el-input-number__increase {
        display: none;
      }

      ::v-deep .el-input-number__decrease {
        display: none;
      }
    }

    .origin {
      @include c_secondary_color();
      height: 14px;
      line-height: 14px;
      margin-top: 16px;
    }
  }
}

.selPop {
  .search {
    display: flex;
    padding-bottom: 16px;

    ::v-deep .el-cascader,
    .el-input {
      margin-right: 8px;
      width: 240px;
    }
  }
}
</style>

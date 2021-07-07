<template>
  <div class="chargeForm-wrap">
    <etm-form :model="formData" :rules="rule" type="dialog">
      <el-form-item label="账单名称" prop="orderBunchName">
        <el-input v-model="formData.orderBunchName" placeholder="请输入账单名称（不能超过10字）" />
      </el-form-item>
      <el-form-item label="发送类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio label="PER_CHILD">按幼儿</el-radio>
          <el-radio label="PER_CLAZZ">按班</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type === 'PER_CHILD'" label="接收对象" prop="childTargets">
        <div class="childSelect">
          <el-tag
            v-for="(tag, index) in formData.childTargets"
            :key="index"
            closable
            @close="removeTag(index)"
          >
            {{ tag.childName }}
          </el-tag>
          <el-button type="dashed" @click="selectChild"><i class="iconfont iconplus" />选择幼儿</el-button>
        </div>
      </el-form-item>
      <el-form-item v-else label="接收对象" prop="clazzTargets">
        <div class="clazz">
          <etm-clazz-cascader @change="getClazz($event, 'selectClazz')" />
        </div>
      </el-form-item>
      <el-form-item prop="noticeParent">
        <span slot="label">
          <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">
            <span>通知家长<i class="iconfont iconquestion-circle" /></span>
            <div slot="content">
              <img src="../../../../../../assets/images/guardcare/bg.png">
            </div>
          </el-tooltip>
        </span>
        <el-radio-group v-model="formData.noticeParent">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用订金" prop="usingDeposit">
        <el-radio-group v-model="formData.usingDeposit">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </etm-form>
    <div class="itemTable">
      <etm-title>收费项目</etm-title>
      <div class="buttonBox">
        <el-button type="dashed" @click="selectPrice"><i class="iconfont iconplus" />选择费用</el-button>
        <el-button type="dashed" @click="selectMaterial"><i class="iconfont iconplus" />选择物品</el-button>
        <el-button type="dashed" @click="selectCourse"><i class="iconfont iconplus" />选择课程</el-button>
      </div>
      <etm-table :data="formData.orderBunchItemList" :border="false" :stripe="false">
        <el-table-column slot="left" label="项目名称">
          <template slot-scope="scoped">
            <div class="itemName">
              <div class="itemImg">
                <img src="../../../../../../assets/images/etm-logo.png">
              </div>
              <div class="name">{{ scoped.row.orderBunchItemName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column slot="left" label="单价">
          <template slot-scope="scoped">
            <div class="actual">实收：¥ {{ scoped.row.actualUnitAmount }}</div>
            <div class="origin">应收：¥ {{ scoped.row.unitAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="left" label="数量" width="240">
          <template slot-scope="scoped">
            <el-input-number
              v-model="scoped.row.number"
              :min="1"
              :data-none="scoped"
              class="number"
              @change="changeNumber($event, scoped.$index)"
            />
            <span>{{ scoped.row.itemType === '物品' ? scoped.row.unit : scoped.row.itemType === '物品费用' ? '笔' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="left" label="小计" width="240">
          <template slot-scope="scoped">
            <div class="actualInput">实收：¥
              <el-input-number
                v-model="scoped.row.actualAmount"
                :min="0"
                :data-none="scoped"
                @change="changeTotal($event, scoped.$index)"
              />
            </div>
            <div class="origin">应收：¥ {{ scoped.row.totalAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="left" label="操作" width="90">
          <template slot-scope="scoped">
            <etm-text type="danger" @click="removeItem(scoped.$index)">删除</etm-text>
          </template>
        </el-table-column>
      </etm-table>
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
            <el-input v-model="searchInfo.childName" prefix-icon="el-icon-search" placeholder="请输入幼儿姓名" />
            <el-button type="primary" @click="search">搜索</el-button>
          </template>
          <el-input
            v-if="selPopType === 'materialPrice'"
            v-model="searchInfo.materialPriceValue"
            prefix-icon="el-icon-search"
            placeholder="请输入费用名称"
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
          @selection-change="selectItem"
        >
          <template v-if="selPopType === 'child'">
            <el-table-column slot="right" label="性别">
              <template slot-scope="scoped">
                {{ scoped.row.gender === 'MALE' ? '男' : scoped.row.gender === 'FEMALE' ? '女' : '' }}
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
  getChildList,
  getCourseList,
  getMaterialList,
  getMaterialPriceList
} from '@/api/guardcare/orderManage/charge'
import EtmClazzCascader from '@/components/EtmClazzCascader'
import { getClazzDetail } from '@/api/guardcare/childManage/childManage'

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
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rule: {
        orderBunchName: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
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
      childSelection: [], // 幼儿弹窗选中的数据
      materialSelection: [], // 物品弹窗选中的数据
      materialPriceSelection: [], // 费用弹窗选中的数据
      courseSelection: [], // 课程弹窗选中的数据
      searchInfo: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getClazz(value, type) {
      if (type === 'searchChild') {
        this.searchInfo.clazzValue = value
      } else {
        this.formData.clazzTargets = value
        this.formData.sendTargetList = []
        if (value.length) {
          getClazzDetail(value[1]).then(res => {
            this.formData.sendTargetList.push(res.data.name)
          })
        }
      }
    },
    getChild() { // 请求幼儿列表
      const param = {}
      if (this.searchInfo.childName) {
        param.childName = this.searchInfo.childName
      }
      if (this.searchInfo.clazzValue) {
        param.clazzId = this.searchInfo.clazzValue[1]
      }
      getChildList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    getMaterial() { // 请求物品列表
      const param = {
        paged: false,
        pageNum: 1,
        pageSize: 999
      }
      if (this.searchInfo.materialValue) {
        param.name = this.searchInfo.materialValue
      }
      getMaterialList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    getMaterialPrice() { // 请求费用列表
      const param = {
        paged: false,
        pageNum: 1,
        pageSize: 999,
        enable: true
      }
      if (this.searchInfo.materialPriceValue) {
        param.name = this.searchInfo.materialPriceValue
      }
      getMaterialPriceList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    getCourse() {
      const param = {
        paged: false,
        pageNum: 1,
        pageSize: 999,
        enable: true
      }
      if (this.searchInfo.courseValue) {
        param.name = this.searchInfo.courseValue
      }
      getCourseList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    search() { // 弹窗里搜索
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
    selectChild() { // 选择幼儿弹窗
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
    removeTag(index) {
      this.formData.childTargets.splice(index, 1)
    },
    selectPrice() { // 选择费用弹窗
      this.selTableData = []
      this.selPopTitle = '选择费用'
      this.selPopType = 'materialPrice'
      this.column = [
        {
          label: '费用名称',
          prop: 'materialPriceName'
        },
        {
          label: '单价（元）',
          prop: 'sellPrice'
        }
      ]
      this.getMaterialPrice()
      this.showSelPop = true
    },
    selectMaterial() { // 选择物品弹窗
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
          prop: 'sellPrice'
        }
      ]
      this.getMaterial()
      this.showSelPop = true
    },
    selectCourse() {
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
    selectItem(val) { // 各类型弹窗赋值
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
    setSelection() { // 打开弹窗选中已选择的数据
      const arr = []
      for (let i = 0; i < this.selTableData.length; i++) {
        if (this.selPopType === 'materialPrice') { // 费用
          for (let v = 0; v < this.materialPriceSelection.length; v++) {
            if (this.selTableData[i].materialPriceId === this.materialPriceSelection[v].materialPriceId) {
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
    handlePopClose() {
      this.searchInfo = {}
      this.showSelPop = false
    },
    handlePopConfirm() {
      if (this.selPopType === 'materialPrice') { // 选择费用
        // 判断收费项目表格的数据是否再次选中
        this.filterData(this.materialPriceSelection, '物品费用')
        // 循环选中的数据
        this.materialPriceSelection.forEach(item => {
          // 判断选中的数据是否已在收费项目表格
          let flag = false
          for (let v = 0; v < this.formData.orderBunchItemList.length; v++) {
            const selection = this.formData.orderBunchItemList[v]
            if (selection.itemType === '物品费用' && selection.originId === item.materialPriceId) {
              flag = true
            }
          }
          // 不在收费项目表格则插入数据
          if (!flag) {
            const data = {}
            data.itemType = '物品费用'
            data.originId = item.materialPriceId
            data.orderBunchItemName = item.materialPriceName
            data.number = 1
            data.unitAmount = item.sellPrice
            data.actualUnitAmount = item.sellPrice
            data.totalAmount = item.sellPrice
            data.actualAmount = item.sellPrice
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
            data.unitAmount = item.sellPrice
            data.actualUnitAmount = item.sellPrice
            data.totalAmount = item.sellPrice
            data.actualAmount = item.sellPrice
            data.unit = item.unit
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
    filterData(data, type) {
      for (let i = 0; i < this.formData.orderBunchItemList.length; i++) {
        if (this.formData.orderBunchItemList[i].itemType === type) {
          let flag = false
          for (let o = 0; o < data.length; o++) {
            if (type === '物品费用') {
              if (this.formData.orderBunchItemList[i].originId === data[o].materialPriceId) {
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
    handlePopCancel() {
      this.searchInfo = {}
      this.showSelPop = false
    },
    changeNumber(value, index) { // 收费项目的数量改变重新计算小计
      this.formData.orderBunchItemList[index].totalAmount = value * this.formData.orderBunchItemList[index].unitAmount
      this.formData.orderBunchItemList[index].actualAmount = value * this.formData.orderBunchItemList[index].actualUnitAmount
    },
    changeTotal(value, index) { // 实收小计改变计算实收单价
      const price = (value / this.formData.orderBunchItemList[index].number).toFixed(2)
      this.formData.orderBunchItemList[index].actualUnitAmount = Number(price)
    },
    removeItem(index) { // 删除收费项目
      this.formData.orderBunchItemList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .chargeForm-wrap {
    .iconplus{
      font-size: 12px;
      font-weight: bold;
    }
    .childSelect {
      .el-tag {
        margin: 0 8px 8px 0;
        height: 32px;
        line-height: 32px;
      }
    }

    ::v-deep .el-cascader {
      width: 100%;
      height: 32px;
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
      .itemName {
        display: flex;

        .itemImg {
          margin-right: 15px;
          padding-top: 11px;
          width: 100px;
          height: 54px;
          text-align: center;
          border-radius: 2px;
          @include bgc_divide_color();
          img{
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

      .actualInput {
        height: 32px;
        line-height: 32px;
        ::v-deep .el-input-number__increase{
          display: none;
        }
        ::v-deep .el-input-number__decrease{
          display: none;
        }
      }

      .origin {
        margin-top: 16px;
        height: 14px;
        line-height: 14px;
        @include c_secondary_color();
      }
    }
  }

  .selPop {
    .search {
      display: flex;
      padding-bottom: 16px;

      ::v-deep .el-cascader, .el-input {
        margin-right: 8px;
        width: 240px;
      }
    }
  }
</style>

<template>
  <div class="chargeForm-wrap">
    <etm-pop
      pop="big"
      :visible="isShow"
      title="转课"
      cancel-btn="取消"
      confirm-btn="确定转费"
      @cancel="cancel"
      @close="cancel"
      @confirm="popTransferFirm"
    >
      <el-row>
        <el-col :span="24">
          <etm-form ref="form1" type="dialog" :model="form">
            <el-form-item
              label="合同单号"
              prop="contractNo"
              :rules="formValidate.nullValueRule(true,'请输入合同单号')"
            >
              <el-input v-model="form.contractNo" />
            </el-form-item>
            <el-form-item label="学员姓名">{{ prop.name }}</el-form-item>
            <!--            <el-form-item-->
            <!--              label="业务类型"-->
            <!--              prop="type"-->
            <!--              :rules="formValidate.nullValueRule(true,'请输入业务类型')"-->
            <!--            >-->
            <!--              <el-radio v-model="form.type" label="TEACH" @change="radioChange">早教</el-radio>-->
            <!--              <el-radio v-model="form.type" label="CARE" @change="radioChange">托育</el-radio>-->
            <!--            </el-form-item>-->
          </etm-form>
        </el-col>
      </el-row>

      <div class="itemTable">
        <etm-title>转出项目</etm-title>
        <div class="getOut">
          <el-select v-model="form.outid" @change="classOutChange">
            <el-option
              v-for="(item, index) in allClass"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <!--    嵌套模板组件-->

        <nesting-table v-model="templateData" status="transfer" text="转出" @del="delOut" />

        <div v-if="templateData.length" class="total">
          转出总计：
          <el-button type="text">￥{{ form.totalTransferOut }}</el-button>
        </div>
      </div>

      <div class="itemTable">
        <etm-title>转入项目</etm-title>

        <div class="buttonBox">
          <el-button type="dashed" @click="selectEvent(form.type === 'CARE' ? 'nurseType' : 'earlyType')">
            <i class="iconfont iconplus" />选择课程类型
          </el-button>
          <el-button type="dashed" @click="selectEvent(form.type === 'CARE' ? 'nurseCourse' : 'earlyCourse')">
            <i class="iconfont iconplus" />选择课程
          </el-button>
        </div>
        <!--    嵌套模板组件-->

        <nesting-table v-model="templateData2" @del="deleteTel" />
        <div v-if="templateData2.length" class="total">
          转入总计：
          <el-button type="text">￥{{ form.totalTransferIn }}</el-button>
        </div>
      </div>

      <div>
        <etm-title>其他信息</etm-title>
        <el-row>
          <el-col :span="24">
            <etm-form ref="form2" type="dialog" :model="form">
              <el-form-item label="转课日期" prop="transferDate">
                <el-date-picker v-model="form.transferDate" type="date" placeholder="选择日期" />
              </el-form-item>

              <el-form-item label="备注">
                <el-input
                  v-model="form.transferRemake"
                  :maxlength="1000"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入备注内容"
                />
              </el-form-item>
            </etm-form>
          </el-col>
        </el-row>
      </div>
    </etm-pop>

    <etm-pop
      :visible="showPop"
      title="添加托育课程"
      cancle-btn="取消"
      pop="complex"
      @cancel="popCancel"
      @close="popCancel"
      @confirm="popConfirm"
    >
      <component :is="popType[popCurType]" v-if="popCurType" ref="pop" />
    </etm-pop>
  </div>
</template>

<script>
/**
 * chargeForm create by Administrator
 * createTime 2020/8/20 17:29
 */
import NestingTable from '../../components/nestingTable3'
import { choiceClassMixin } from '../../mixins/choiceClassMixin'
import {
  queryPayType,
  queryTeachInClassItem,
  queryTeachTransClass,
  createTransformOut
} from '@/api/newDaycare/contract'

import { parseTime } from '@/utils'
import { toFixed } from '@/views/newDaycare/contract/common'
import formValidate from '@/utils/rules'
// import nurseType from '../../components/addPop/nurseType' // 类型
// import nurseCourse from '../../components/addPop/nurseCourse'
import { createBatchNumber } from '@/utils/base' // 课程

export default {
  name: 'ChargeForm',
  components: { NestingTable },
  filters: {},
  mixins: [choiceClassMixin],
  props: {
    prop: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formValidate,
      // popCurType: '',
      // popType: {
      //   nurseCourse,
      //   nurseType
      // },
      cacheOutIds: [],
      isShow: false,
      radioOne: false,
      form: {
        teachOrCare: false,
        contractId: null,
        contractNo: 0,
        childId: 0,
        type: 'TEACH',
        outid: '',
        listTransferOutPurchaseItemsDTO: [],
        totalTransferOut: 0,
        listTransferInPurchaseItemsDTO: [],
        totalTransferIn: 0,
        transferDate: '',
        transferRemake: ''
      },
      // data: {},
      allClass: [],
      tableData: [],
      tableData2: [],
      payType: [],
      allUser: [],
      showPop: false,
      templateData: [],
      templateData2: [],
      contractType: {
        NEW_SIGNING: '新签约',
        TRANSFER_COURSE: '转课',
        RENEWAL: '续约'
      }
    }
  },
  computed: {},
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler(n) {
        this.isEdit = n.edit
        if (Object.keys(n).length) {
          this.init(n)
        }
      }
    },
    templateData: {
      deep: true,
      handler(n) {
        let _result = 0
        n.forEach((cur) => {
          _result += toFixed(cur.netReceiptsNotes)
        })

        this.form.totalTransferOut = _result.toFixed(2)
      }
    },
    templateData2: {
      deep: true,
      handler(n) {
        let _result = 0
        n.forEach((cur) => {
          _result += toFixed(cur.netReceiptsNotes)
        })

        this.form.totalTransferIn = _result.toFixed(2)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    deleteTel(cur) {
      let _index = 0
      const cacSetMealEnum = cur.cacSetMealEnum === 'CAE_COURSE' ? 'RURRICULUM' : cur.cacSetMealEnum
      switch (cacSetMealEnum) {
        case 'COST' :
        case 'GOODS' :
        case 'RURRICULUM' :
        case 'COURSE_TYPE' :

          _index = this.cacheTemplate[cacSetMealEnum].indexOf(cur.id)
          this.cacheTemplate[cacSetMealEnum].splice(_index, 1)

          break
        case 'SET_MEAL' :

          _index = this.cacheTemplate['SET_MEAL'].indexOf(cur.id)
          _index = this.cacheTemplate['SET_MEAL'].indexOf(cur.id)
          this.cacheTemplate[cacSetMealEnum].splice(_index, 1)

          cur.childList.forEach(c => {
            const _t = c.cacSetMealEnum === 'CAE_COURSE' ? 'RURRICULUM' : (c.cacSetMealEnum === 'PRICE' ? 'COST' : c.cacSetMealEnum)
            const _i = this.cacheTemplate[_t].indexOf(c.id)
            this.cacheTemplate[_t].splice(_i, 1)
          })

          break
      }
    },
    delOut(event) {
      const _index = this.cacheOutIds.indexOf(event.id)
      this.cacheOutIds.splice(_index, 1)
    },
    triggerShow() {
      this.isShow = true
    },
    popCancel() {
      this.showPop = false
    },
    classOutChange(event) {
      queryTeachInClassItem(event).then((res) => {
        if (this.cacheOutIds.includes(res.data.id)) {
          return
        }

        res.data._purchase = res.data.remainingBuyQuantity
        res.data._give = res.data.remainingGiftQuantity
        res.data.purchase = res.data.remainingBuyQuantity
        res.data.give = res.data.remainingGiftQuantity
        res.data.receivableNotes = toFixed(res.data.receivable * res.data.remainingBuyQuantity)
        res.data.netReceiptsNotes = toFixed(res.data.netReceipts * res.data.remainingBuyQuantity)

        if (res.data.img && res.data.img.length) {
          res.data.img = res.data.img[0].url
        }
        this.cacheOutIds.push(res.data.id)
        this.templateData.push(res.data)
      })
    },
    init(prop) {
      this.form.contractNo = createBatchNumber()
      this.form.childId = prop.childId
      this.form.contractId = prop.id
      this.form.transferDate = new Date()

      queryTeachTransClass(prop.id).then((res) => {
        this.allClass = res.data
      })

      queryPayType().then((res) => {
        this.payType = res.data
      })
    },
    popConfirmHandle(data) {
      this.templateData2 = this.templateData2.concat(data)
    },
    popTransferFirm() {
      Promise.all([
        this.$refs['form1'].$children[0].validate(),
        this.$refs['form2'].$children[0].validate()
      ]).then(res => {
        if (!this.templateData2.length || !this.templateData.length) {
          this.$message({
            type: 'warning',
            message: '请选择转入或转出项目'
          })

          return
        }

        if (this.form.totalTransferIn !== this.form.totalTransferOut) {
          this.$message({
            type: 'warning',
            message: '转出金额与转入金额不一致'
          })
          return
        }

        // this.form.listTransferOutPurchaseItemsDTO = this.templateData.map(cur => {
        //   if (cur['img'] && cur['img'].length) {
        //     // cur.img = cur['img'][0].url
        //
        //     cur.img = cur['img'][0].url
        //   } else {
        //     cur.img = ''
        //   }
        //
        //   if (cur.childList && cur.childList.length) {
        //     cur.childList.map(c => {
        //       if (c['img'] && c['img'].length) {
        //         c.img = c['img'][0].url
        //       } else {
        //         c.img = ''
        //       }
        //     })
        //   }
        //   return cur
        // })
        //
        // this.form.listTransferInPurchaseItemsDTO = this.templateData2.map(cur => {
        //   if (cur['img'] && cur['img'].length) {
        //     // cur.img = cur['img'][0].url
        //
        //     cur.img = cur['img'][0].url
        //   } else {
        //     cur.img = ''
        //   }
        //
        //   if (cur.childList && cur.childList.length) {
        //     cur.childList.map(c => {
        //       if (c['img'] && c['img'].length) {
        //         c.img = c['img'][0].url
        //       } else {
        //         c.img = ''
        //       }
        //     })
        //   }
        //   return cur
        // })
        this.form.listTransferOutPurchaseItemsDTO = this.templateData
        this.form.listTransferInPurchaseItemsDTO = this.templateData2

        this.form.transferDate = parseTime(this.form.transferDate, '{y}-{m}-{d}')

        createTransformOut(this.form
        ).then((res) => {
          this.isShow = false
          this.cacheOutIds = []
          this.$emit('update', {})
          this.reset()
          this.$message({
            message: '转课成功',
            type: 'success'
          })
        })
      })
    },
    // radioChange(event) {
    //   if (!this.radioOne) {
    //     this.radioOne = true
    //     return
    //   }
    //
    //   if (this.templateData2.length) {
    //     this.$etmTip.init({
    //       type: 'wraning',
    //       title: `确定切换业务类型？`,
    //       content: `会清空当前添加的项目`,
    //       confirmBtn: '确定',
    //       cancelBtn: '取消',
    //       cancel: () => {
    //         this.form.type = event === 'TEACH' ? 'CARE' : 'TEACH'
    //         // this.form.receivableNotes = 0
    //         // this.form.netReceiptsNotes = 0
    //         this.$etmTip.close()
    //       },
    //       confirm: () => {
    //         this.templateData2 = []
    //         this.$etmTip.close()
    //       }
    //     })
    //     this.$etmTip.open()
    //   }
    // },
    selectDiy() {
      if (!this.form.type) {
        this.$message({
          type: 'warning',
          message: '请选择业务类型'
        })
        return true
      }
    },
    reset() {
      this.templateData = []
      this.templateData2 = []
      this.radioOne = ''
      this.cacheTemplate = {
        'SET_MEAL': [],
        'COURSE_TYPE': [],
        'RURRICULUM': [],
        'GOODS': [],
        'COST': []
      }
      this.form = {
        teachOrCare: false,
        contractId: null,
        contractNo: 0,
        childId: 0,
        type: 'TEACH',
        outid: '',
        listTransferOutPurchaseItemsDTO: [],
        totalTransferOut: 0,
        listTransferInPurchaseItemsDTO: [],
        totalTransferIn: 0,
        transferDate: '',
        transferRemake: ''
      }
    },
    cancel() {
      this.isShow = false
      this.cacheOutIds = []
      this.reset()
      this.$refs['form1'].$children[0].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeForm-wrap {
}

.total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.buttonBox {
  margin-bottom: 16px;

  .el-button--small + .el-button--small {
    margin-left: 8px;
  }
  .iconplus{
    font-size: 12px;
  }
}

.getOut {
  margin-bottom: 16px;
}
</style>

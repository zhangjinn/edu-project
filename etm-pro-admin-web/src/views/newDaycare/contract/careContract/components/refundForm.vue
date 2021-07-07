<template>
  <div class="chargeForm-wrap">
    <etm-pop
      pop="big"
      :visible="isShow"
      title="退费"
      cancel-btn="取消"
      confirm-btn="确定退费"
      @cancel="cancel"
      @close="cancel"
      @confirm="popConfirm"
    >
      <div>
        <etm-field-label label="合同单号" type="left">{{ data.contractNo }}</etm-field-label>
        <etm-field-label label="学员姓名" type="left">{{ data.childName }}</etm-field-label>
        <etm-field-label label="业务类型" type="left">托育</etm-field-label>
        <etm-field-label label="合同实收总计" type="left">￥{{ data.receivable }}</etm-field-label>
        <etm-field-label label="合同应收总计" type="left">￥{{ data.paid }}</etm-field-label>
        <!--        <etm-field-label label="合同剩余总计" type="left">￥{{ data.balance }}</etm-field-label>-->
      </div>

      <div class="itemTable">
        <etm-title>购买项目</etm-title>

        <!--    嵌套模板组件-->

        <nesting-table v-model="templateData" :columns="columns" :show-img="true" :disable="false" :is-delete="false" />
      </div>

      <!--      <div class="itemTable">-->
      <!--        <etm-title>退费项目</etm-title>-->

      <!--        &lt;!&ndash;    嵌套模板组件&ndash;&gt;-->

      <!--        <nesting-table v-model="templateData2" :columns="columns" :show-img="true" :map="refundData" text="剩余" :disable="false" :is-delete="false" />-->
      <!--      </div>-->

      <div>
        <etm-title>支付信息</etm-title>
        <el-row>
          <el-col :span="16">
            <etm-form ref="form1" type="dialog" :model="form">
              <el-form-item label="实退总计" prop="refund" :rules="formValidate.nullValueRule(true, '请输入实退总计')">
                <el-input v-model="form.refund" />
              </el-form-item>
              <el-form-item label="退款方式" prop="refundId" :rules="formValidate.nullValueRule(true, '请选择退款方式')">
                <el-select v-model="form.refundId">
                  <el-option
                    v-for="(item, index) in payType"
                    :key="index"
                    :label="item.financePayTypeName"
                    :value="item.financePayTypeId"
                  />
                </el-select>
              </el-form-item>
            </etm-form>
          </el-col>
        </el-row>
      </div>

      <div>
        <etm-title>其他信息</etm-title>
        <el-row>
          <el-col :span="16">
            <etm-form type="dialog">
              <el-form-item label="退费日期" prop="refunDate">
                <el-date-picker
                  v-model="form.refundDate"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="form.refundRemake" type="textarea" :rows="5" placeholder="请输入备注内容" />
              </el-form-item>
            </etm-form>
          </el-col>
        </el-row>
      </div>

    </etm-pop>
  </div>
</template>

<script>

/**
 * chargeForm create by Administrator
 * createTime 2020/8/20 17:29
 */
import NestingTable from '../../components/nestingTable3'
import { queryPayType, queryExitDetail, exitContract } from '@/api/newDaycare/contract'
import { deepClone } from '@/views/newDaycare/contract/common'
import { parseTime } from '@/utils'
// import { exitContract } from '@/api/employee'
import formValidate from '@/utils/rules'

export default {
  name: 'ChargeForm',
  components: { NestingTable },
  filters: {},
  mixins: [],
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
      columns: [
        {
          label: '项目名称',
          width: '24%'
        }, {
          label: '单价',
          width: '20%'
        }, {
          label: '数量',
          width: '28%'
        }, {
          label: '小计',
          width: '21%'
        }
      ],
      formValidate,
      isShow: false,
      form: {
        cacContractId: null,
        refund: null,
        refundId: '',
        refundDate: '',
        refundRemake: ''
      },
      refundData: {
        id: 'id',
        name: 'name',
        netReceipts: 'netReceipts', // 实收
        give: 'remainingGiftQuantity', // 赠送
        receivable: 'receivable', // 应收
        purchase: 'remainingBuyQuantity', // 购买
        img: 'img',
        modify: 'modify',
        netReceiptsNotes: 'netReceiptsNotes', // 实收总额
        receivableNotes: 'receivableNotes', // 应收总额
        cacSetMealEnum: 'cacSetMealEnum', // 类型
        childList: 'childList'
      },
      data: {},
      tableData: [],
      payType: [],
      allUser: [],
      showPop: false,
      templateData: [],
      templateData2: [],
      contractType: {
        'NEW_SIGNING': '新签约',
        'TRANSFER_COURSE': '转课',
        'RENEWAL': '续约'
      }
    }
  },
  computed: {},
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler(n, o) {
        this.isEdit = n.edit
        // if (Object.keys(n).length) {

        this.init(n)
        // }
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    triggerShow() {
      this.isShow = true
    },
    reset() {
      this.form = {}
      this.$refs['form1'].$children[0].resetFields()
    },
    init(prop) {
      queryExitDetail(prop.id).then(res => {
        const { data } = res

        this.form.cacContractId = this.prop.id
        this.form.refund = data.refundAmount
        this.form.refundDate = new Date()

        this.data = data
        // this.templateData = deepClone(data.listPurchaseItemsDTO)
        // this.templateData2 = deepClone(data.listRefundPurchaseItemsDTO)

        this.templateData = deepClone(data.listPurchaseItemsDTO.map(cur => {
          if (cur['img'] && cur['img'].length) {
            // cur.img = cur['img'][0].url

            cur.img = cur['img'][0].url
          } else {
            cur.img = ''
          }

          if (cur.childList && cur.childList.length) {
            cur.childList.map(c => {
              if (c['img'] && c['img'].length) {
                c.img = c['img'][0].url
              } else {
                c.img = ''
              }
            })
          }
          return cur
        }))
        this.templateData2 = deepClone(data.listRefundPurchaseItemsDTO.map(cur => {
          if (cur['img'] && cur['img'].length) {
            // cur.img = cur['img'][0].url

            cur.img = cur['img'][0].url
          } else {
            cur.img = ''
          }

          if (cur.childList && cur.childList.length) {
            cur.childList.map(c => {
              if (c['img'] && c['img'].length) {
                c.img = c['img'][0].url
              } else {
                c.img = ''
              }
            })
          }
          return cur
        }))
      })

      queryPayType().then(res => {
        this.payType = res.data
      })
    },
    cancel() {
      this.isShow = false
      this.reset()
    },
    popConfirm() {
      this.$refs['form1'].$children[0].validate(valid => {
        if (valid) {
          this.form['refundDate'] = parseTime(this.form.refundDate, '{y}-{m}-{d}')
          exitContract(this.form).then(res => {
            this.isShow = false
            this.$refs['form1'].$children[0].resetFields()
            this.$message({
              type: 'success',
              message: '退费成功'
            })
            this.$emit('update', {})
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeForm-wrap {

}

</style>

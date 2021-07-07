<template>
  <div class="teachContract-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane name="teach" label="托育合同">
            <etm-screen-tab v-model="distancetype" :options="distanceList" title="快捷筛选" @change="distanceChange" />
            <etm-tool-bar v-show="true" v-model="formData" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">

        <etm-table-page v-fixedHead :data="tableData" :columns="columns" index @currentChange="currentChange">

          <el-table-column slot="left" label="合同编号" fixed="left" width="120">
            <template slot-scope="scoped">
              <el-button
                type="text"
                @click="trigger({name : 'chargeDetail', arguments : {edit:false, id : scoped.row.cacContractId,deposit : scoped.row.contractStatusEnum === '待审核' ? true : false, pid : scoped.row.childId, contractType : scoped.row.contractType, contractStatusEnum : scoped.row.contractStatusEnum}}, false)"
              >
                {{ scoped.row.contractNo }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column slot="left" label="学员姓名" fixed="left" width="120">
            <template slot-scope="scoped">
              <el-button
                type="text"
                @click="showChild(scoped.row.childId)"
              >
                {{ scoped.row.childName }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column slot="right" label="操作" fixed="right" width="200">
            <template slot-scope="scoped">
              <etm-text
                v-if="exclude(scoped.row.contractStatusEnum, ['作废', '退费'])"
                v-has="{authId: 'daycare.contractCare.update'}"
                type="primary"
                @click="trigger({name : 'chargeDetail', arguments : {edit : true, id : scoped.row.cacContractId, pid : scoped.row.childId, deposit : scoped.row.contractStatusEnum === '待审核' ? true : false}}, true)"
              >
                编辑
              </etm-text>
              <etm-text
                v-if="exclude(scoped.row.contractStatusEnum, ['退费', '正常', '作废', '过期'])"
                v-has="{authId: 'daycare.contractCare.exam'}"
                type="primary"
                @click="trigger({name : 'examineForm', arguments : {id : scoped.row.cacContractId}})"
              >
                审核
              </etm-text>
              <etm-text
                v-if="exclude(scoped.row.contractStatusEnum, ['退费', '正常', '作废', '过期'])"
                v-has="{authId: 'daycare.contractCare.remove'}"
                type="danger"
                @click="remover(scoped.row.cacContractId)"
              >删除
              </etm-text>
              <!--              <etm-text-->
              <!--                v-if="scoped.row.contractStatusEnum !== '待审核' &&-->
              <!--                  scoped.row.contractStatusEnum !== '审核未通过' &&-->
              <!--                  scoped.row.contractStatusEnum !== '退费' &&-->
              <!--                  scoped.row.contractStatusEnum !== '作废' &&-->
              <!--                  scoped.row.contractStatusEnum !== '过期'"-->
              <!--                v-has="{authId: 'daycare.contractCare.courseTransfer'}"-->
              <!--                type="primary"-->
              <!--                @click="trigger({name : 'transferClass', arguments : {id : scoped.row.cacContractId, name : scoped.row.childName, no : scoped.row.contractNo, childId : scoped.row.childId}})"-->
              <!--              >-->
              <!--                转课-->
              <!--              </etm-text>-->
              <etm-text
                v-if="exclude(scoped.row.contractStatusEnum, ['待审核', '审核未通过', '退费', '作废', '过期'])"
                v-has="{authId: 'daycare.contractCare.refund'}"
                type="primary"
                @click="trigger({name : 'refundForm', arguments : {id : scoped.row.cacContractId}})"
              >退费
              </etm-text>
              <etm-text
                v-if="exclude(scoped.row.contractStatusEnum, ['待审核', '审核未通过', '退费', '作废', '过期'])"
                v-has="{authId: 'daycare.contractCare.cancel'}"
                type="primary"
                @click="openScrap(scoped.row.cacContractId)"
              >
                作废
              </etm-text>
            </template>
          </el-table-column>

        </etm-table-page>
      </template>
    </etm-layout-split>

    <etm-pop
      title="合同作废"
      :visible="showScrap"
      cancel-btn="取消"
      @cancel="cancelScrap"
      @close="cancelScrap"
      @confirm="confirmScrap"
    >
      <etm-form ref="scrap" type="dialog" :rules="scrapRules" :model="scrapForm">
        <el-form-item label="作废原因" prop="reason">
          <el-input v-model="scrapForm.reason" type="textarea" :rows="6" placeholder="请输入合同作废原因" />
        </el-form-item>
      </etm-form>
    </etm-pop>

    <etm-drawer
      :visible.sync="childPop"
      type="big"
    >
      <etm-layout-split
        v-if="childPop"
        :left-styles="{minWidth: '560px', maxWidth: '560px'}"
        :styles="{height: '100vh'}"
        class="child-info-box"
      >
        <div slot="left" class="left">
          <child-logs :child-id="childId" />
        </div>
        <div slot="right" class="right">
          <child-info :child-id="childId" :category="currentTab" @update="init" />
        </div>
      </etm-layout-split>
    </etm-drawer>

    <component :is="popComponent[popType]" v-if="popType" ref="component" :prop="componentData" :drawer-path="drawerPath" @update="updatePage" @handleEdit="drawerPath = $event" />

  </div>

</template>

<script>
/**
 * teachContract create by Administrator
 * createTime 2020/8/31 14:11
 */

import baseMixin from '@/layout/mixin/baseMixin'
import chargeForm from './components/chargeForm'
import examineForm from './components/examineForm'
import choiceStudent from '../components/choice'
import refundForm from '@/views/newDaycare/contract/careContract/components/refundForm'
import transferClass from '@/views/newDaycare/contract/careContract/components/transferClass'
import chargeDetail from './components/chargeDetail'
import { queryCacPageLists, removeCacContract, updateScrap } from '@/api/newDaycare/contract'
import { parseTime } from '@/utils'

import ChildLogs from '@/views/newDaycare/childManage/myChild/components/childLogs'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'

export default {
  name: 'TeachContract',
  components: {
    ChildLogs,
    ChildInfo,
    chargeForm,
    choiceStudent,
    transferClass,
    examineForm,
    refundForm,
    chargeDetail
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      drawerPath: false,
      distancetype: null,
      showScrap: false,
      scrapForm: {
        reason: '',
        cacContractId: null
      },
      scrapRules: {
        reason: [{
          required: true,
          message: '请输入作废原因'
        }]
      },
      childPop: false,
      childId: 0,
      currentTab: 'DEAL',
      componentData: {}, // 公共传参传参
      popType: '',
      popComponent: {
        chargeForm: chargeForm,
        chargeDetail: chargeDetail,
        examineForm: examineForm,
        refundForm: refundForm,
        transferClass: transferClass
      },
      isSignUp: false,
      search: {},
      showStudent: false,
      activeName: 'teach',
      tableData: {
        content: []
      },
      distance: null,
      distanceList: [
        {
          name: '全部',
          value: null
        }, {
          name: '未审核',
          value: 'UNDER_REVIEW'
        }, {
          name: '本周合同',
          value: 'THIS_WEEKS_CONTRACT'
        }, {
          name: '本月合同',
          value: 'THIS_MONTHS_CONTRACT'
        }, {
          name: '本月到期',
          value: 'DUE_THIS_MONTH'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true
      },
      columns: [
        {
          label: '联系人电话',
          prop: 'contactPhoneNumber',
          width: '120',
          fixed: 'left'
        }, {
          label: '联系人姓名',
          prop: 'contactPhoneName',
          width: '120'
        }, {
          label: '合同状态',
          prop: 'contractStatusEnum',
          width: '120'
        }, {
          label: '合同类型',
          prop: 'contractType',
          width: '120'
        }, {
          label: '购买项目',
          prop: 'purchaseItemNames',
          width: '120'
        }, {
          label: '应收金额(元)',
          prop: 'receivable',
          width: '120',
          align: 'right'
        }, {
          label: '实收金额(元)',
          prop: 'paid',
          width: '120',
          align: 'right'
        }, {
          label: '实退金额(元)',
          prop: 'refund',
          width: '120',
          align: 'right'
        }, {
          label: '支付方式',
          prop: 'paymentName',
          width: '120'
        }, {
          label: '业绩所属人',
          prop: 'mainPerformanceName',
          width: '120'
        }, {
          label: '签约日期',
          prop: 'date',
          width: '120'
        }, {
          label: '有效期',
          prop: 'validityDate',
          width: '200'
        }, {
          label: '审核人',
          prop: 'toExamineName',
          width: '120'
        }, {
          label: '审核时间',
          prop: 'toExamineDate',
          width: '120'
        }, {
          label: '经办人',
          prop: 'currentEmployeeName',
          width: '120'
        }, {
          label: '经办时间',
          prop: 'createDateTime',
          width: '120'
        }
      ],
      formData: [
        {
          label: '学员姓名',
          type: 'input',
          value: '',
          prop: 'childName',
          props: {
            placeholder: '请输入学员姓名'
          }
        }, {
          label: '联系人电话',
          type: 'input',
          value: '',
          prop: 'contactPhoneNumber',
          props: {
            placeholder: '请输入联系人电话'
          }
        }, {
          label: '合同单号',
          type: 'input',
          value: '',
          prop: 'contractNo',
          props: {
            placeholder: '请输入合同单号'
          }
        }, {
          label: '合同状态',
          value: '',
          type: 'select',
          prop: 'contractStatusEnum',
          props: {
            placeholder: '请选择合同状态',
            clearable: true,
            filterable: true
          },
          options: [
            {
              label: '待审核',
              value: 'UNDER_REVIEW'
            }, {
              label: '正常',
              value: 'NORMAL'
            }, {
              label: '审核不通过',
              value: 'AUDIT_FAILED'
            }, {
              label: '退费',
              value: 'REFUND '
            }, {
              label: '过期',
              value: 'BE_OVERDUE'
            }
          ]
        }, {
          label: '经办人',
          type: 'input',
          value: '',
          prop: 'createName',
          props: {
            placeholder: '请输入经办人'
          }
        }, {
          label: '签约日期',
          type: 'date',
          value: '',
          prop: 'time',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    exclude(type, excludeArray) {
      return excludeArray.every(cur => {
        return type !== cur
      })
    },
    confirmScrap() {
      this.$refs['scrap'].$children[0].validate(err => {
        if (err) {
          updateScrap({ ...this.scrapForm, type: 'CARE' }).then(res => {
            this.$message.success('合同作废成功')
            this.cancelScrap()
            this.init()
          })
        }
      })
    },
    openScrap(id) {
      this.showScrap = true
      this.scrapForm.cacContractId = id
    },
    cancelScrap() {
      this.showScrap = false
      this.$refs['scrap'].$children[0].resetFields()
      this.scrapForm = {
        reason: '',
        cacContractId: null
      }
    },
    updatePage() {
      this.init(this.search)
    },
    showChild(id) {
      this.childPop = true
      this.childId = id
    },
    init(search = {}) {
      const result = Object.assign({
        childName: null,
        contactPhoneNumber: null,
        contractNo: null,
        contractStatusEnum: null,
        createName: null,
        startValidBeginTime: null,
        endValidBeginTime: null
      }, search, this.pageInfo, { contractEnum: this.distance })

      queryCacPageLists(result).then(res => {
        const result = res.data

        if (!result.content) {
          this.tableData = { content: [] }
          return
        }

        result.content.forEach((cur, index) => {
          result['content'][index].createDateTime = parseTime(cur.createDateTime, '{y}-{m}-{d}')
          if (cur.toExamineDate !== null) {
            result['content'][index].toExamineDate = parseTime(cur.toExamineDate, '{y}-{m}-{d}')
          }
          if (cur.date !== '--') {
            result['content'][index].date = parseTime(cur.date, '{y}-{m}-{d}')
          }

          result['content'][index].validityDate = parseTime(cur.validBeginTime, '{y}-{m}-{d}') + '至' + parseTime(cur.validEndTime, '{y}-{m}-{d}')
        })

        this.tableData = result
      })
    },
    distanceChange(event) {
      this.distance = event

      this.init(this.search)
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize,
        paged: true
      }
      this.init(this.search)
    },
    handleSearch(event) {
      const result = {}
      this.pageInfo.pageNum = 1
      event.forEach(cur => {
        if (cur.prop === 'time') {
          result['startValidBeginTime'] = cur.value[0]
          result['endValidBeginTime'] = cur.value[1]
        } else {
          result[cur.prop] = cur.value
        }
      })
      this.search = result

      this.init(result)
    },
    trigger(arg, drawerPath) {
      this.drawerPath = drawerPath
      this.popType = arg.name
      this.componentData = arg.arguments

      this.$nextTick(() => {
        this.$refs['component'].triggerShow()
      })
    },
    remover(id) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除合同吗？',
        content: '',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeCacContract(id).then(res => {
            this.init(this.search)
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // studentClose() {
    //   this.showStudent = false
    // },
    // studentOpen() {
    //   this.showStudent = true
    // },
    // signUpClose() {
    //   this.isSignUp = false
    // },
    // signUpOpen() {
    //   this.isSignUp = true
    // },
    // signUpConfirm() {
    //   this.isSignUp = false
    // },
    reset() {
      this.search = {}
      // this.distance = null
      this.init(this.search)
    }

  }
}
</script>
<style lang="scss" scoped>
.teachContract-wrap {
  margin-top: 16px;
}

::v-deep .EtmLayoutSplit-wrap {
  //height: 100vh;
  //
  //.layout-default {
  //  overflow-y: auto;
  //}
}
::v-deep .EtmDrawer-wrap {
  .EtmLayoutSplit-wrap {
    .layout-left {
      margin-right: 8px;
    }
  }
}
</style>

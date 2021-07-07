<template>
  <div class="earnestMoney-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" setting @setting="$router.push('/newdaycare_setting/card_setting')">
          <el-tab-pane name="order" label="会员卡管理">
            <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page v-fixedHead :data="tableData" :columns="columns" @currentChange="currentChange">
          <el-table-column slot="left" label="会员卡号" fixed="left" min-width="120">
            <template slot-scope="scoped">
              <el-button type="text" @click="changeEarnes(scoped.row)">{{ scoped.row.cardNumber }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="学员姓名" fixed="left" min-width="120">
            <template slot-scope="scoped">
              <el-button
                type="text"
                @click="showChild(scoped.row.childId)"
              >
                {{ scoped.row.childName }}
              </el-button>

              <!--              <el-button type="text" @click="changeEarnes(scoped.row.membershipCardId)">{{ scoped.row.childName }}-->
              <!--              </el-button>-->
            </template>
          </el-table-column>

          <el-table-column slot="right" label="操作" width="180" fixed="right">
            <template slot-scope="scoped">
              <etm-text
                type="primary"
                @click="changeEarnes(scoped.row, true, true)"
              >编辑
              </etm-text>
              <etm-text type="primary" @click="triggerMember(scoped.row.membershipCardId, scoped.row.status === '使用中')">{{ scoped.row.status == '使用中' ? '禁用' : '启用' }}</etm-text>
              <etm-text type="danger" @click="deleteEarnes(scoped.row.membershipCardId)">删除
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>

      <etm-drawer
        :visible.sync="studentDrawer"
      >
        <etm-layout-split>
          <etm-title :show-line="false" border size="big">
            {{ isEdit ? '编辑会员卡' : '会员卡详情' }}
            <template slot="tool">
              <template v-if="isEdit">
                <el-button plain size="mini" @click="cancel">取消</el-button>
                <el-button type="primary" size="mini" @click="save">保存</el-button>
              </template>
              <template v-else>
                <el-button v-if="earnestDetail.status" plain size="mini" @click="edit">编辑</el-button>
              </template>

            </template>
          </etm-title>

          <template v-if="isEdit">
            <deposit ref="deposit" v-model="earnestDetail" />
          </template>
          <template v-else>
            <div>
              <etm-field-label label="会员卡号" type="left">{{ earnestDetail.cardNumber }}</etm-field-label>
              <etm-field-label label="卡类型" type="left">{{ earnestDetail.cardTypeName }}</etm-field-label>
              <etm-field-label label="学员姓名" type="left">{{ earnestDetail.childName }}</etm-field-label>
              <etm-field-label label="关联联系人" type="left">{{ earnestDetail.personRelationName }}</etm-field-label>
              <etm-field-label label="联系人电话" type="left">{{ earnestDetail.phone }}</etm-field-label>
              <etm-field-label label="开卡时间" type="left">{{
                earnestDetail.openCardTime
              }}
              </etm-field-label>
            </div>
          </template>

        </etm-layout-split>
      </etm-drawer>

    </etm-layout-split>

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

  </div>

</template>

<script>
/**
 * earnestMoney create by Administrator
 * createTime 2020/8/31 14:12
 */
import ChildLogs from '@/views/newDaycare/childManage/myChild/components/childLogs'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'
// import SearchField from '@/views/daycare/childManage/myChild/components/searchField'
import Deposit from './components/deposit'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
// import { deepClone } from '../common'
import { queryCardDetailByCardId, queryCardLists, removeMemberCard, updateMemberCard, updateTriggerMember } from '@/api/newDaycare/contract'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'EarnestMoney',
  components: {
    // SearchField,
    Deposit,
    ChildLogs,
    ChildInfo
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      drawerPath: false,
      childPop: false,
      childId: 0,
      curInfo: {},
      isEdit: true,
      studentDrawer: false,
      activeName: 'order',
      showDeposit: false,
      showStudent: false,
      payType: [],
      searchKey: {},
      earnestDetail: {
        // cardNumber: '46456456',
        // cardTypeId: 4,
        // cardTypeName: '绿卡',
        // childId: 1853,
        // childName: '测试1',
        // membershipCardId: 14,
        // openCardTime: 1604505600000,
        // personRelationId: '1507',
        // personRelationName: 'hrhhn',
        // phone: '13012542365',
        // status: true
      },
      earnestDetail2: {},

      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true
      },
      // payType: {
      //   WECHAT: '微信',
      //   ALIPAY: '支付宝',
      //   CASH: '现金',
      //   BAND_CARD: '银行卡',
      //   NOT_USED: 'pos机'
      // },
      columns: [
        {
          label: '关联联系人',
          width: '120',
          prop: 'personRelationName',
          fixed: 'left'
        }, {
          label: '联系人电话',
          width: '120',
          prop: 'phone',
          fixed: 'left'
        }, {
          label: '卡类型',
          width: '120',
          prop: 'cardTypeName'
          // fixed: 'left'
        }, {
          label: '开卡时间',
          width: '120',
          prop: 'openCardTime'
          // fixed: 'left'
        }, {
          label: '状态',
          width: '120',
          prop: 'status'
          //  fixed: 'left'
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
          label: '会员卡号',
          type: 'input',
          value: '',
          prop: 'cardNumber',
          props: {
            placeholder: '请输入会员卡号'
          }
        }, {
          label: '联系人电话',
          type: 'input',
          value: '',
          prop: 'parentPhone',
          props: {
            placeholder: '请输入联系人电话'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    showChild(id) {
      this.childPop = true
      this.childId = id
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize,
        paged: true
      }
      this.init(this.searchKey)
    },
    /* 打开合同详情 */
    changeEarnes(row, edit = false, drawerPath = false) {
      this.drawerPath = drawerPath
      this.isEdit = edit
      this.studentDrawer = true
      this.curInfo = row
      // 这一行不能删
      this.earnestDetail = row
      queryCardDetailByCardId({ membershipCardId: row.membershipCardId }).then(res => {
        const result = res.data
        result.openCardTime = parseTime(result.openCardTime, '{y}-{m}-{d}')
        this.earnestDetail = result
        this.earnestDetail2 = result
      })
    },
    triggerMember(id, status) {
      updateTriggerMember({ membershipCardId: id, status: !status }).then(res => {
        this.$message.success('状态改变成功')
        this.init(this.searchKey)
      })
    },
    /* 删除合同 */
    deleteEarnes(id) {
      this.$etmTip.init({
        type: 'error',
        title: '确定要删除会员卡？',
        content: '',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeMemberCard({ membershipCardId: id }).then(res => {
            this.init(this.searchKey)
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    init(search = {}) {
      const params = Object.assign({
        cardNumber: null,
        childName: null,
        parentPhone: null,
        pageNum: 1,
        pageSize: 10,
        paged: true
      }, search, this.pageInfo)

      queryCardLists(params).then(res => {
        this.tableData = res.data
        const result = res.data['content']
        result.forEach((cur, index) => {
          result[index].status = cur.status ? '使用中' : '已禁用'
          result[index].openCardTime = parseTime(cur.openCardTime, '{y}-{m}-{d}')
        })

        this.tableData['content'] = result
      })
    },
    handleSearch(event) {
      const searchKey = {}
      this.pageInfo.pageNum = 1
      event.forEach(cur => {
        if (cur.prop === 'time') {
          searchKey['createTime'] = cur.value[0]
          searchKey['updateTime'] = cur.value[1]
        } else {
          searchKey[cur.prop] = cur.value
        }
      })

      this.searchKey = searchKey
      this.init(searchKey)
    },
    reset() {
      this.searchKey = {}
      this.init()
    },
    cancel() {
      if (this.drawerPath) {
        this.studentDrawer = false
        return
      }
      this.earnestDetail = deepClone(this.earnestDetail2)
      this.isEdit = false
      this.$refs['deposit'].$refs['form'].$children[0].resetFields()
    },
    save() {
      // console.log(this.earnestDetail)
      this.$refs['deposit'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          updateMemberCard(this.earnestDetail).then(res => {
            this.isEdit = false
            this.$message.success('修改成功')
            this.$refs['deposit'].$refs['form'].$children[0].resetFields()
            this.earnestDetail2 = deepClone(res.data)
            this.earnestDetail = deepClone(res.data)
            this.init()
            // this.studentDrawer = false
          })
        }
      })
    },
    edit() {
      this.drawerPath = false
      this.isEdit = true
    },
    query() {

    },

    // depositOpen() {
    //   this.showDeposit = true
    // },
    // depositClose() {
    //   this.showDeposit = false
    // },
    // depositConfirm() {
    //   this.showDeposit = false
    // },
    studentClose() {
      this.showStudent = false
    },
    studentOpen() {
      this.showStudent = true
    }
  }
}
</script>
<style lang="scss" scoped>
.earnestMoney-wrap {
  margin-top: 16px;
  ::v-deep .EtmDrawer-wrap {
    .EtmLayoutSplit-wrap {
      .layout-left {
        margin-right: 8px;
      }
    }
  }
}
</style>

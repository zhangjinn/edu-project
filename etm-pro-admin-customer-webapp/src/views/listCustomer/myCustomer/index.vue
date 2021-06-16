<template>
  <div class="my-customer-wrap">
    <!--    <etm-main-body>-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          ref="tabs"
          v-model="currentTab"
          setting
          @setting="setting"
        >
          <el-tab-pane
            label="未签单客户"
            name="UNSOLD"
          >
            <etm-screen-tab
              v-if="currentTab === 'UNSOLD'"
              v-model="quickScreening"
              :options="searchItems"
              title="快捷筛选"
              @change="screenTabChange"
            />
            <search-field
              v-if="currentTab === 'UNSOLD'"
              ref="field"
              :show-button="false"
              :category="currentTab"
            />
            <etm-tool-bar
              v-if="currentTab === 'UNSOLD'"
              v-model="formData"
              @search="handleSearch"
              @reset="handleReset"
            />
          </el-tab-pane>
          <el-tab-pane
            label="已签单客户"
            name="DEAL"
          >
            <etm-screen-tab
              v-if="currentTab === 'DEAL'"
              v-model="quickScreening"
              :options="searchItems"
              title="快捷筛选"
              @change="screenTabChange"
            />
            <search-field
              v-if="currentTab === 'DEAL'"
              ref="field"
              :show-button="false"
              :category="currentTab"
            />
            <etm-tool-bar
              v-if="currentTab === 'DEAL'"
              v-model="formData"
              @search="handleSearch"
              @reset="handleReset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <tablePage
          :params="tableParams"
          :current-tab="currentTab"
          :columns="columns"
          :table-data="tableData"
          @update="updateLists"
          @currentChange="currentChange"
        />
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->
  </div>
</template>

<script>
import searchField from '@/views/listCustomer/myCustomer/components/searchField'
import tablePage from '@/views/listCustomer/myCustomer/components/tablePage'
import {
  queryCustomerLists,
  queryDisableSetting,
  queryPassFields
} from '@/api/customer'
import { parseTime } from '@/utils'

export default {
  name: 'MyCustomer',
  components: {
    searchField,
    tablePage
  },
  data () {
    return {
      selectionData: [],
      tableData: {
        content: []
      },
      columns_system: {
        avatar: '客户头像',
        name: '客户名称',
        contactTelephone: '联系人电话',
        gender: '性别',
        telephone: '客户电话',
        contactName: '联系人姓名',
        importantLevel: '重要程度',
        abandoner: '放弃人',
        source: '来源',
        lastFollowTime: '最后跟进时间',
        marketer: '市场人员',
        counselor: '跟进人员',
        nextFollowTime: '下次跟进时间',
        salesStage: '销售阶段',
        age: '年龄'
      },
      columns: [],
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      currentTab: 'UNSOLD',
      tableParams: {
        deal: false,
        paged: true,
        quickFindType: null,
        pool: false,
        pageSize: 10,
        minFollowTime: null,
        maxFollowTime: null,
        pageNum: 1,
        items: null
      },
      formData: [{
        type: 'date',
        label: '跟进时间',
        prop: '',
        value: [],
        props: {
          type: 'daterange',
          startPlaceholder: '年/月/日',
          endPlaceholder: '年/月/日'
        }
      }],
      quickScreening: null,
      searchItems: [{
        name: '全部',
        value: null
      }, {
        name: '今天要跟进',
        value: 'NEED_FOLLOW_TODAY'
      }, {
        name: '今天已跟进',
        value: 'FOLLOW_UP_TODAY'
      }, {
        name: '3天内要跟进',
        value: 'NEED_FOLLOW_WITHIN_3_DAYS'
      }, {
        name: '3天内已跟进',
        value: 'FOLLOW_UP_WITHIN_3_DAYS'
      }, {
        name: '3天内未跟进',
        value: 'NEVER_FOLLOW_UP_WITHIN_3_DAYS'
      }, {
        name: '1周内已跟进',
        value: 'FOLLOW_UP_WITHIN_1_WEEK'
      }, {
        name: '1周未跟进',
        value: 'NEVER_FOLLOW_UP_WITHIN_1_WEEK'
      }, {
        name: '1个月未跟进',
        value: 'NEVER_FOLLOW_UP_WITHIN_1_MONTH'
      }, {
        name: '无跟进计划',
        value: 'NEVER_FOLLOW_UP_PLAN'
      }]
    }
  },
  watch: {
    currentTab: {
      handler (n) {
        if (n === 'UNSOLD') {
          this.tableParams.deal = false
        } else {
          this.tableParams.deal = true
        }
        this.tableParams.pageNum = 1
        this.tableParams.minFollowTime = null
        this.tableParams.maxFollowTime = null

        this.quickScreening = null
        this.tableParams.quickFindType = null

        this.formData[0].value = ''

        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    screenTabChange (e) {
      this.tableParams.quickFindType = e
      this.quickScreening = e
      this.$nextTick(() => {
        this.init()
      })
    },
    updateLists () {
      this.tableParams.pageNum = 1
      this.init()
    },
    currentChange ({ pageSize, pageNumber }) {
      this.tableParams.pageNum = pageNumber
      this.tableParams.pageSize = pageSize

      this.init()
    },
    setting () {
      this.$router.push({ path: '/customer_settings' })
    },
    handleReset () {
      this.$refs.field.reset()
      this.tableParams = {
        deal: this.currentTab === 'DEAL',
        paged: true,
        quickFindType: null,
        pool: false,
        pageSize: 10,
        minFollowTime: null,
        maxFollowTime: null,
        pageNum: 1,
        items: null
      }

      this.init()
    },
    init () {
      queryDisableSetting(false).then(setting => {
        const columns = []
        setting.data.forEach(cur => {
          if (cur.display && cur.key !== 'avatar' && cur.key !== 'name') {
            columns.push({
              label: cur.name || this.columns_system[cur.key],
              width: 120,
              prop: cur.key
            })
          }
        })

        queryCustomerLists(this.tableParams).then(res => {
          queryPassFields().then(pass => {
            const passField = []
            const map = {
              CUSTOMER_NAME: 'name',
              CONTACT_NAME: 'contactName',
              CONTACT_TELEPHONE: 'contactTelephone'
            }

            pass.data.forEach(cur => {
              if (cur.enable) {
                passField.push(map[cur.rule])
              }
            })

            const result = res.data

            result.content = result.content.map((cur, index) => {
              (cur.customFields || []).forEach(c => {
                // if (index === 0) {
                //   columns.push({
                //     label: c.name,
                //     width: 120,
                //     prop: c.key
                //   })
                // }
                cur[c.key] = c.value
              })
              cur.gender = this.gender[cur.gender]
              cur.nextFollowTime = cur.nextFollowTime ? parseTime(cur.nextFollowTime, '{y}-{m}-{d}') : ''
              cur.lastFollowTime = cur.lastFollowTime ? parseTime(cur.lastFollowTime, '{y}-{m}-{d}') : ''

              passField.forEach(i => {
                if (cur[i]) {
                  if (cur === 'contactTelephone') {
                    cur[i] = cur[i].substr(0, 3) + '****' + cur[i].substr(7)
                  } else {
                    cur[i] = cur[i].replace(/(?<=.).+/, '**')
                  }
                }
              })
              return cur
            })

            this.columns = columns
            // console.log(result, 'xxxxxxx')
            this.tableData = result
          })
        })
      })
    },
    handleSearch (e) {
      // 默认筛选数据
      const searchDefault = e
      // 筛选条件
      const searchField = this.$refs.field.query()

      // this.tableParams.quickFindType = this.quickScreening

      if (searchDefault.length) {
        this.tableParams.minFollowTime = searchDefault[0].value[0] + ' 00:00:00'
        this.tableParams.maxFollowTime = searchDefault[0].value[1] + ' 23:59:59'
      }

      this.tableParams.pageNum = 1
      this.tableParams.items = searchField

      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.my-customer-wrap{
  ::v-deep .EtmDrawer-wrap {
    .EtmLayoutSplit-wrap {
      .layout-left {
        margin-right: 8px;
      }
    }
  }
}
</style>

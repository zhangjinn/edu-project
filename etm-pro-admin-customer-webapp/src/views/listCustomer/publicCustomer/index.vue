<template>
  <div class="my-customer-wrap">
    <!--    <etm-main-body>-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          v-model="currentTab"
          setting
          @setting="setting"
        >
          <el-tab-pane
            label="公海客户"
            name="CHILD_POOL"
          >
            <search-field
              ref="public"
              category="CHILD_POOL"
              @query="handleSearch"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          v-fixedHead
          selection
          :columns="columns"
          :data="tableData"
          @currentChange="currentChange"
          @selection-change="selection"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-dropdown @command="changeCommand">
                <el-button plain>
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="batchDelete">
                    批量删除
                  </el-dropdown-item>
                  <el-dropdown-item command="batchGet">
                    批量领取
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            fixed="left"
            width="120"
            label="客户名称"
          >
            <template v-slot="{row}">
              <etm-text @click="showCustomer(row)">
                {{ row.name }}
              </etm-text>
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            width="120"
            fixed="right"
            label="操作"
          >
            <template v-slot="{row}">
              <etm-text @click="giveup(row)">
                领取
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->

    <!--    客户详情-->
    <etm-drawer
      :visible.sync="childPop"
    >
      <etm-layout-split
        :styles="{height: '100vh'}"
        class="child-info-box"
      >
        <child-info
          v-if="childPop"
          ref="childInfo"
          :child-id="childId"
          category="CHILD_POOL"
          @upate="$emit('update')"
        />
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import searchField from '@/views/listCustomer/myCustomer/components/searchField'
import childInfo from '@/views/listCustomer/myCustomer/components/pops/childInfo'
import {
  queryCustomerLists,
  createGiveUpCustomer,
  removeCustomer, queryDisableSetting, queryPassFields
} from '@/api/customer'
import { parseTime } from '@/utils'

export default {
  name: 'MyCustomer',
  components: {
    searchField,
    childInfo
  },
  data () {
    return {
      childPop: false,
      childId: 0,
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
        sales_stage: '销售阶段',
        age: '年龄'
      },
      currentTab: 'CHILD_POOL',
      selectionData: [],
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      tableData: {
        content: []
      },
      tableParams: {
        deal: false,
        paged: true,
        quickFindType: null,
        pool: true,
        pageSize: 10,
        minFollowTime: null,
        maxFollowTime: null,
        pageNum: 1,
        items: null
      },
      columns: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    showCustomer (row, edit = false) {
      this.childId = row.id
      this.childPop = true
      if (edit) {
        setTimeout(() => {
          this.$refs.childInfo.isEdit = true
        }, 0)
      }
    },
    giveup (row) {
      createGiveUpCustomer([row.id]).then(res => {
        this.$message.success(res.data.returnContent)
        this.init()
      })
    },
    reset () {
      this.tableParams = {
        deal: false,
        paged: true,
        quickFindType: null,
        pool: true,
        pageSize: 10,
        minFollowTime: null,
        maxFollowTime: null,
        pageNum: 1,
        items: null
      }

      this.init()
    },
    currentChange (pageNum, pageSize) {
      this.tableParams.pageNum = pageNum
      this.tableParams.pageSize = pageSize
      this.init()
    },
    selection (e) {
      this.selectionData = e
    },
    handleSearch (e) {
      this.tableParams.pageNum = 1
      this.tableParams.items = e

      this.$nextTick(() => {
        this.init()
      })
    },
    init () {
      queryDisableSetting(true).then(setting => {
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
            this.tableData = result
          })
        })
      })
    },
    changeCommand (e) {
      if (!this.selectionData.length) {
        this.$message.warning('请选择客户')
        return
      }

      const ids = this.selectionData.map(cur => {
        return cur.id
      })

      switch (e) {
        case 'batchDelete':

          this.$etmTip.init({
            type: 'error',
            title: '提示',
            content: '确定删除选中客户？',
            confirmBtn: '确定',
            cancelBtn: '取消',
            confirm: () => {
              removeCustomer(ids).then(res => {
                this.$message.success('删除成功')
                this.$etmTip.close()
                this.init()
              })
            },
            cancel: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
          break
        case 'batchGet':
          createGiveUpCustomer(ids).then(res => {
            this.$message.success(res.data.returnContent)
            this.init()
          })
          break
      }
    },
    setting () {
      this.$router.push({ path: '/customer_settings' })
    }
  }
}
</script>

<style scoped lang="scss">
.my-customer-wrap{

}
</style>

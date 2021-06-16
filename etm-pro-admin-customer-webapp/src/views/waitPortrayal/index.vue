<template>
  <div class="waitPortrayal-wrap">
    <!--    <etm-main-body>-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          ref="tabs"
          v-model="currentTab"
        >
          <el-tab-pane
            label="待画像批次"
            name="BATCH"
          >
            <etm-tool-bar
              v-model="formData['BATCH']"
              @search="handleSearch"
              @reset="handleReset"
            />
          </el-tab-pane>
          <el-tab-pane
            label="待画像客户"
            name="CUSTOMER"
          >
            <etm-tool-bar
              v-model="formData['CUSTOMER']"
              @search="handleSearch"
              @reset="handleReset"
            />
          </el-tab-pane>
          <!--          <el-tab-pane-->
          <!--            label="已画像客户"-->
          <!--            name="PORTRAIT"-->
          <!--          >-->
          <!--            <etm-tool-bar-->
          <!--              v-model="formData['PORTRAIT']"-->
          <!--              @search="handleSearch"-->
          <!--              @reset="handleReset"-->
          <!--            />-->
          <!--          </el-tab-pane>-->
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          v-if="currentTab === 'BATCH'"
          key="BATCH"
          :columns="columns['BATCH']"
          :data="tableData['BATCH']"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <etm-table-digit :data="digit" />
            <div slot="right">
              <el-button
                type="primary"
                @click="$refs.batchImport.show()"
              >
                <i class="el-icon-plus" /> 批量导入待画像客户
              </el-button>
            </div>
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            label="录入批次"
            fixed="left"
            min-width="120"
          >
            <template v-slot="{row}">
              <etm-text @click="goDetail(row)">
                {{ row.no }}
              </etm-text>
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            label="操作"
            fixed="right"
            width="120"
          >
            <template v-slot="{row}">
              <etm-text
                type="danger"
                @click="delBatch(row)"
              >
                删除批次
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
        <etm-table-page
          v-else-if="currentTab === 'CUSTOMER'"
          key="CUSTOMER"
          selection
          :columns="columns['CUSTOMER']"
          :data="tableData['CUSTOMER']"
          @selection-change="selection"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button
                :disabled="!selectChoice.length"
                type="primary"
                @click="delCustomer(selectChoice)"
              >
                批量删除
              </el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column
            slot="right"
            label="操作"
            width="120"
            fixed="right"
          >
            <template v-slot="{row}">
              <etm-text
                type="danger"
                @click="delCustomer([row.id])"
              >
                删除
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
        <etm-table-page
          v-else
          key="PORTRAIT"
          :columns="columns['PORTRAIT']"
          :data="tableData['PORTRAIT']"
          @selection-change="selection"
          @currentChange="currentChange"
        >
          <!--            <etm-table-tool-bar slot="tool">-->
          <!--              <el-button slot="right" :disabled="!selectChoice.length" type="primary" @click="delCustomer(selectChoice)">批量删除</el-button>-->
          <!--            </etm-table-tool-bar>-->
          <!--            <el-table-column slot="right" label="操作" width="200">-->
          <!--              <template v-slot="{row}">-->
          <!--                <etm-text type="danger" @click="delCustomer([row.id])">删除</etm-text>-->
          <!--              </template>-->
          <!--            </el-table-column>-->
        </etm-table-page>
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->

    <batchImport
      ref="batchImport"
      @success="init"
    />
  </div>
</template>

<script>
import batchImport from '@/views/waitPortrayal/components/batchImport'
import {
  queryBatchLists,
  removeBatch,
  removeCustomer,
  queryCustomer,
  queryBatchDroDown,
  queryWaitCustomTotal
} from '@/api/portrayal'
import { parseTime } from '@/utils'
export default {
  name: 'WaitPortrayal',
  components: {
    batchImport
  },
  data () {
    return {
      digit: [
        {
          digit: 0,
          text: '已画像批次数'
        },
        {
          digit: 0,
          text: '未画像批次数'
        },
        {
          digit: 0,
          text: '录入总人数'
        }
      ],
      batchDropDown: [],
      selectChoice: [],
      currentTab: 'BATCH',
      gender: {
        MALE: '男性',
        FEMALE: '女性'
      },
      columns: {
        BATCH: [
          // {
          //   label: '客户数量',
          //   prop: 'itemTotal',
          //   width: 120
          // },
          // {
          //   label: '已画像人数',
          //   prop: 'portrayedTotal',
          //   width: 120
          // },
          // {
          //   label: '未画像人数',
          //   prop: 'unPortrayedTotal',
          //   width: 120
          // },
          {
            label: '总人数',
            prop: 'itemTotal',
            width: 180
          },
          {
            label: '录入人员',
            prop: 'operatorName',
            width: 180
          }
        ],
        CUSTOMER: [
          {
            label: '客户名称',
            prop: 'name',
            width: 120,
            fixed: 'left'
          },
          {
            label: '客户电话',
            prop: 'telephone',
            width: 120,
            fixed: 'left'
          },
          {
            label: '性别',
            prop: 'gender',
            width: 120
          },
          {
            label: '生日',
            prop: 'birthday',
            width: 120
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            label: '备注',
            prop: 'remark',
            width: 240
          },
          {
            label: '录入批次',
            prop: 'batchNo',
            width: 120,
            fixed: 'right'
          },
          {
            label: '录入人员',
            prop: 'operatorName',
            fixed: 'right',
            width: 120
          }
        ],
        PORTRAIT: [
          {
            label: '客户名称',
            prop: 'name',
            width: 120
          },
          {
            label: '客户电话',
            prop: 'telephone',
            width: 120
          },
          {
            label: '性别',
            prop: 'gender',
            width: 120
          },
          {
            label: '生日',
            prop: 'birthday',
            width: 120
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            label: '备注',
            prop: 'remark',
            width: 240
          },
          {
            label: '录入批次',
            prop: 'batchNo',
            width: 120
          },
          {
            label: '录入人员',
            prop: 'operatorName',
            width: 120
          }
        ]
      },
      tableData: {
        BATCH: {
          content: []
        },
        CUSTOMER: {
          content: []
        },
        PORTRAIT: {
          content: []
        }
      },
      formData: {
        BATCH: [
          {
            label: '录入时间',
            type: 'date',
            prop: 'date',
            value: [],
            props: {
              type: 'daterange',
              startPlaceholder: '年/月',
              endPlaceholder: '年/月'
            }
          }, {
            label: '录入人员',
            type: 'input',
            prop: 'operatorName',
            value: '',
            props: {
              placeholder: '请填写录入人员'
            }
          }
        ],
        CUSTOMER: [
          {
            label: '录入批次',
            type: 'select',
            value: '',
            prop: 'batchId',
            options: [],
            props: {}
          }, {
            label: '录入人员',
            type: 'input',
            prop: 'operatorName',
            value: '',
            props: {
              placeholder: '请填写录入人员'
            }
          }
        ],
        PORTRAIT: [
          {
            label: '录入批次',
            type: 'select',
            value: '',
            prop: 'batchId',
            options: [],
            props: {}
          }, {
            label: '录入人员',
            type: 'input',
            prop: 'operatorName',
            value: '',
            props: {
              placeholder: '请填写录入人员'
            }
          }
        ]
      },
      pageInfo: {
        pageSize: 10,
        pageNum: 1,
        paged: true
      },
      searchParams: {}
    }
  },
  watch: {
    currentTab: {
      handler (n) {
        if (n === 'CUSTOMER' && this.searchParams.batchId) {
          console.log(n)
        } else {
          this.formData.CUSTOMER[0].value = ''
          this.formData.PORTRAIT[0].value = ''
          this.searchParams = {}
          this.selectChoice = []

          this.init()
        }
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    delCustomer (ids) {
      this.$etmTip.init({
        type: 'error',
        title: '确认要删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeCustomer(ids).then(res => {
            this.init()
            this.$message.success('删除画像客户成功')
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },
    init () {
      const require = {
        BATCH: queryBatchLists,
        CUSTOMER: queryCustomer,
        PORTRAIT: queryCustomer
      }
      if (this.currentTab === 'PORTRAIT') {
        this.searchParams.status = 'PORTRAYED'
      } else if (this.currentTab === 'CUSTOMER') {
        this.searchParams.status = 'UN_PORTRAYED'
      } else {
        this.searchParams.status = null
      }

      const api = require[this.currentTab]
      const params = Object.assign({}, this.pageInfo, this.searchParams)

      api(params).then(res => {
        const result = res.data
        result.content = result.content.map(cur => {
          cur.gender = this.gender[cur.gender]
          cur.birthday = cur.birthday ? parseTime(cur.birthday, '{y}-{m}-{d}') : ''
          return cur
        })

        this.tableData[this.currentTab] = result
      })

      queryWaitCustomTotal().then(res => {
        this.digit[0].digit = res.data.portrayedTotal
        this.digit[1].digit = res.data.unPortrayedTotal
        this.digit[2].digit = res.data.batchItemTotal
      })

      queryBatchDroDown().then(res => {
        const dropDown = (res.data || []).map(cur => {
          return {
            label: cur.no,
            value: cur.id
          }
        })
        this.formData.CUSTOMER[0].options = dropDown
        this.formData.PORTRAIT[0].options = dropDown
        this.batchDropDown = dropDown
      })
    },
    goDetail (row) {
      this.formData.CUSTOMER[0].value = row.id
      this.searchParams = { batchId: row.id }
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1,
        paged: true
      }
      this.currentTab = 'CUSTOMER'
      this.$nextTick(() => {
        this.init()
      })
    },
    setting () {

    },
    handleSearch (e) {
      const result = {}
      e.forEach(cur => {
        if (cur.prop === 'date') {
          result.minCreateDate = cur.value[0] + ' 00:00:00'
          result.maxCreateDate = cur.value[1] + ' 23:59:59'
        } else {
          result[cur.prop] = cur.value
        }
      })
      this.searchParams = result
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1,
        paged: true
      }
      this.init()
    },
    handleReset () {
      this.searchParams = {}
      this.pageInfo.pageNum = 1
      this.init()
    },
    selection (e) {
      this.selectChoice = e.map(cur => {
        return cur.id
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize

      this.init()
    },
    delBatch (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeBatch(row.id).then(res => {
            this.init()
            this.$message.success('删除批次成功')
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style scoped lang="scss">
.waitPortrayal-wrap{

}
</style>

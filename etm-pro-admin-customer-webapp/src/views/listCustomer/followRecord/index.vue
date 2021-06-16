<template>
  <div class="my-customer-wrap">
    <!--    <etm-main-body>-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="currentTab">
          <el-tab-pane
            label="跟进记录"
            name="public"
          >
            <etm-tool-bar
              v-model="formData"
              @search="search"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          :columns="columns"
          :data="tableData"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <etm-table-digit :data="tipData" />
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            width="120"
            label="客户姓名"
          >
            <template v-slot="{row}">
              {{ row.customer }}
            </template>
          </el-table-column>
          <el-table-column
            slot="left"
            min-width="240"
            label="跟进内容"
          >
            <template v-slot="{row}">
              <div class="ell">
                <etm-text @click="showDetail(row)">
                  {{ row.followContent }}
                </etm-text>
              </div>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->

    <detail
      ref="detail"
      :order-id="detailId"
    />
  </div>
</template>

<script>
import detail from '@/views/listCustomer/followRecord/detail'
import EtmTableDigit from '@/components/EtmTableDigit'
import { queryEmployeeSelectAll } from '@/api/employee'
import {
  queryFollowLog,
  queryFollowTotal,
  querySettingType
} from '@/api/customer'
import { parseTime } from '@/utils'
export default {
  name: 'FollowRecord',
  components: {
    detail,
    EtmTableDigit
  },
  data () {
    return {
      detailId: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true,
        sort: null
      },
      tableParams: {
        orderNo: null,
        customerName: null,
        startDate: null,
        endDate: null
      },
      currentTab: 'public',
      tipData: [
        {
          digit: 0,
          text: '本日跟进'
        },
        {
          digit: 0,
          text: '本周跟进'
        }, {
          digit: 0,
          text: '本月跟进'
        }
      ],
      tableData: {
        content: []
      },
      formData: [
        {
          label: '客户名称',
          prop: 'customerName',
          value: '',
          type: 'input',
          props: {
            placeholder: '请输入单号'
          }
        },
        {
          label: '跟进方式',
          prop: 'followWay',
          value: '',
          type: 'select',
          props: {
            placeholder: '请选择跟进方式'
          },
          options: []
        },
        {
          label: '跟进人',
          prop: 'operator',
          value: '',
          type: 'select',
          props: {
            placeholder: '请选择跟进人'
          },
          options: []
        }
        // {
        //   label: '跟进时间',
        //   prop: 'followTime',
        //   value: '',
        //   type: 'date'
        // },
        // {
        //   label: '下次跟进时间',
        //   prop: 'nextFollowTime',
        //   value: '',
        //   type: 'date'
        // }
      ],
      columns: [
        {
          label: '跟进方式',
          width: '120',
          prop: 'followWay'
        }, {
          label: '跟进时间',
          width: '120',
          prop: 'followTime'
        }, {
          label: '下次跟进时间',
          width: '120',
          prop: 'nextFollowTime'
        }, {
          label: '跟进人',
          width: '120',
          prop: 'operator'
        }
      ]
    }
  },
  created () {
    querySettingType('FOLLOW_WAY').then(res => {
      this.formData[1].options = res.data.options.map(cur => {
        return {
          label: cur.label,
          value: cur.label
        }
      })
    })

    queryEmployeeSelectAll().then(res => {
      this.formData[2].options = res.data.map(cur => {
        return {
          label: cur.name,
          value: cur.id
        }
      })
    })

    this.total()
    this.init()
  },
  methods: {
    showDetail (item) {
      this.detailId = item.id
      this.$refs.detail.show()
    },
    download (url) {
      const link = document.createElement('a')
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    total () {
      queryFollowTotal().then(res => {
        this.tipData[0].topTxt = res.data.followUpTodayTotal
        this.tipData[1].topTxt = res.data.followUpWeekTotal
        this.tipData[2].topTxt = res.data.followUpMonthTotal
      })
    },
    init () {
      console.log(this.tableParams)

      // customerName, followWay, operator, followTime, nextFollowTime, pageNum, pageSize, paged

      queryFollowLog({
        customerId: null,
        followWay: this.tableParams.followWay,
        operator: this.tableParams.operator,
        customerName: this.tableParams.customerName,
        pageNum: this.pageInfo.pageNum,
        //  followTime: this.tableParams.followTime ? this.tableParams.followTime + ' 00:00:00' : null,
        //  nextFollowTime: this.tableParams.nextFollowTime ? this.tableParams.nextFollowTime + ' 00:00:00' : null,
        pageSize: this.pageInfo.pageSize,
        paged: this.pageInfo.paged
      }).then(res => {
        this.tableData = res.data
        this.tableData.content = (res.data.content || []).map(cur => {
          cur.nextFollowTime = cur.nextFollowTime ? parseTime(cur.nextFollowTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
          cur.followTime = parseTime(cur.followTime, '{y}-{m}-{d} {h}:{i}:{s}')

          const content = `${cur.followContent}`
          if (content.length > 200) {
            cur.followContent = content.substr(0, 200) + '...'
          }
          return cur
        })
      })
    },
    search (e) {
      e.forEach(cur => {
        // if (cur.prop === 'date') {
        //   this.tableParams.startDate = `${cur.value[0]} 00:00:00`
        //   this.tableParams.endDate = `${cur.value[1]} 23:59:59`
        // } else {
        this.tableParams[cur.prop] = cur.value
        // }
      })

      this.init()
    },
    reset () {
      this.tableParams = {
        orderNo: null,
        customerName: null,
        startDate: null,
        endDate: null
      }

      this.init()
    },
    changeCommand (e) {
      switch (e) {
        case 'batchDelete':

          break
        case 'batchGet':

          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.my-customer-wrap{

}
</style>

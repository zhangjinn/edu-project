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
            label="客户画像详情"
            name="DETAIL"
          >
            <etm-tool-bar
              v-model="formData"
              @search="handleSearch"
              @reset="handleReset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          selection
          :columns="columns"
          :data="tableData"
          @selection-change="selection"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <div>
              <etm-screen-tab
                v-model="quickScreening"
                :options="searchItems"
                title=""
                @change="searchChange"
              />
              <div class="currentTags">
                <p>当前批次画像标签设置</p>
                <etm-text
                  v-for="(item, index) in tags"
                  :key="index"
                >
                  {{ item }}
                </etm-text>
              </div>
            </div>
            <div slot="right">
              <el-button
                :disabled="!selectChoice.length"
                type="primary"
                @click="addBatchCustomer"
              >
                批量添加到我的客户
              </el-button>
              <el-button
                type="primary"
                @click="exportExcel"
              >
                导出Excel
              </el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column
            slot="right"
            fixed="right"
            label="录入状态"
            width="120"
          >
            <template v-slot="{row}">
              <etm-status
                v-if="row.status === 'CONVERTED'"
                type="primary"
              >
                已转为客户
              </etm-status>
              <etm-status
                v-else
                type="danger"
              >
                未转为客户
              </etm-status>
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            fixed="right"
            label="操作"
            width="160"
          >
            <template v-slot="{row}">
              <etm-text
                v-if="row.status === '未转为客户'"
                type="primary"
                @click="transform([row.id])"
              >
                转为客户
              </etm-text>
              <etm-text
                v-if="row.status === '未转为客户'"
                type="danger"
                @click="delectBatch(row)"
              >
                删除
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->

    <batchImport ref="batchImport" />
  </div>
</template>

<script>
import batchImport from '@/views/waitPortrayal/components/batchImport'
import {
  queryHistory,
  queryHistorySearch,
  createTransformCustomer,
  createCustomerExcel,
  removeHistoryPortrait,
  queryPortrayalTags
} from '@/api/portrayal'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
export default {
  name: 'WaitPortrayal',
  components: {
    batchImport
  },
  data () {
    return {
      selectChoice: [],
      tags: [],
      status: {
        CONVERTED: '已转为客户',
        NOT_CONVERTED: '未转为客户'
      },
      quickScreening: null,
      searchItems: [
        {
          name: '全部',
          value: null
        },
        {
          name: '高度符合',
          value: 'HIGH'
        },
        {
          name: ' 中度符合',
          value: 'MIDDLE'
        },
        {
          name: '低度符合',
          value: 'LOW'
        },
        {
          name: '不符合',
          value: 'NO'
        }
      ],
      searchBatch: [],
      currentTab: 'DETAIL',
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      columns: [
        {
          label: '客户名称',
          prop: 'name',
          fixed: 'left',
          width: 120
        },
        {
          label: '手机号码',
          prop: 'telephone',
          fixed: 'left',
          width: 120
        },
        {
          label: '画像时间',
          prop: 'portraitTime',
          width: 120
        },
        {
          label: '客户画像',
          prop: 'portrait',
          width: 120
        },
        {
          label: '性别',
          prop: 'gender',
          width: 120
        },
        {
          label: '年龄',
          prop: 'age',
          width: 120
        },
        {
          label: '子女姓名',
          prop: 'kidsName',
          width: 120
        },
        {
          label: '子女性别',
          prop: 'kidsGender',
          width: 120
        },
        {
          label: '子女学龄',
          prop: 'kidsAge',
          width: 120
        },
        {
          label: '省',
          prop: 'province',
          width: 120
        },
        {
          label: '市',
          prop: 'city',
          width: 120
        },
        {
          label: '区',
          prop: 'district',
          width: 120
        },
        {
          label: '街道',
          prop: 'street',
          width: 120
        },
        // {
        //   label: '地址',
        //   prop: 'address',
        //   width: 120
        // }
        {
          label: '备注',
          prop: 'remark',
          width: 120
        }

      ],

      tableData: { content: [] },
      formData: [
        {
          label: '画像时间',
          type: 'select',
          value: '',
          prop: 'batchId',
          options: [],
          props: {
            placeholder: '请选择画像时间'
          }
        }, {
          label: '录入状态',
          type: 'select',
          value: '',
          prop: 'status',
          options: [{
            label: '未转为客户',
            value: 'NOT_CONVERTED'
          }, {
            label: '已转为客户',
            value: 'CONVERTED'
          }],
          props: {
            placeholder: '请选择录入状态'
          }
        },
        {
          label: '标签',
          type: 'select',
          value: '',
          prop: 'portrait',
          options: [],
          props: {
            placeholder: '请选择标签'
          }
        }
      ],
      searchParmas: {},
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        paged: true
      }
    }
  },
  watch: {
    // eslint-disable-next-line quote-props
    '$route': {
      immediate: true,
      handler (n) {
        console.log(n, n.name === 'customer_detailsPortrayal')
        if (n.name === 'customer_detailsPortrayal') {
          if (n.query.batchId) {
            this.searchParmas.batchId = n.query.batchId
            this.formData[0].value = parseInt(this.$route.query.batchId || 0)
          }

          this.init()
        }
      }
    }
  },
  // activated () {
  //   if (this.$route.query.batchId) {
  //     this.searchParmas.batchId = this.$route.query.batchId
  //     this.formData[0].value = this.$route.query.batchId
  //   }
  //   this.init()
  // },
  created () {

  },
  methods: {
    exportExcel () {
      createCustomerExcel(this.searchParmas).then(res => {
        downloadFileForUrl(res)
      })
    },
    delectBatch (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认要删除客户？',
        html: `${row.name}`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeHistoryPortrait(row.id).then(res => {
            this.$message.success('客户画像删除成功')
            this.$etmTip.close()
            this.init()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    transform (ids) {
      createTransformCustomer(ids).then(res => {
        // if (ids.length > 1) {
        this.$etmTip.init({
          type: 'success',
          title: '批量添加客户成功',
          html: `<p>已将${res.data.successItemTotal || 0}名客户添加到我的客户中</p><p>有${res.data.existItemTotal || 0}名客户已在客户名单中</p>`,
          confirmBtn: '确定',
          cancelBtn: '取消',
          confirm: () => {
            this.$etmTip.close()
            this.init()
          },
          cancel: () => {
            this.$etmTip.close()
            this.init()
          }
        })
        this.$etmTip.open()
        // } else {
        //   this.$message.success('添加客户成功')
        //   this.init()
        // }
      })
    },
    addBatchCustomer () {
      const ids = []
      this.selectChoice.forEach(cur => {
        ids.push(cur.id)
      })
      this.transform(ids)
    },
    init () {
      const params = Object.assign({}, this.searchParmas, this.tableParams)
      params.portraitLevel = this.quickScreening
      queryHistory(params).then(res => {
        const result = res.data
        result.content = (result.content || []).map(cur => {
          cur.gender = this.gender[cur.gender]
          cur.kidsGender = this.gender[cur.kidsGender]
          cur.kidsName = cur.kidsName ? cur.kidsName.substr(0, 1) + '**' : ''
          cur.kidsBirthday = cur.kidsBirthday ? parseTime(cur.kidsBirthday, '{y}-{m}-{d}') : ''
          cur.portraitTime = cur.portraitTime ? parseTime(cur.portraitTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
          cur.birthday = cur.birthday ? parseTime(cur.birthday, '{y}-{m}-{d}') : ''
          cur.status = this.status[cur.status]
          // cur.kidsAge = (cur.kidsAge || 0) + '年'
          // cur.age = (cur.age || 0) + '岁'
          return cur
        })

        queryPortrayalTags(this.searchParmas.batchId).then(res => {
          this.tags = []
          this.formData[2].options = (res.data || []).map(cur => {
            this.tags.push(cur.queryCondition)
            return {
              label: cur.queryCondition,
              value: cur.queryCondition
            }
          })
        })

        this.tableData = result
      })

      queryHistorySearch().then(res => {
        this.searchBatch = (res.data || []).map(cur => {
          return {
            label: cur.no,
            value: cur.id
          }
        })
        this.formData[0].options = this.searchBatch
      })
    },
    searchChange () {
      this.init()
    },
    handleSearch (e) {
      const result = {}
      e.forEach(cur => {
        result[cur.prop] = cur.value
      })

      this.searchParmas = result
      this.tableParams.pageNum = 1

      this.init()
    },
    handleReset () {
      this.searchParmas = {
        batchId: this.searchParmas.batchId
      }

      this.$nextTick(() => {
        this.formData[0].value = parseInt(this.searchParmas.batchId)
        this.init()
      })
    },
    selection (e) {
      this.selectChoice = e
    },
    currentChange (pageNum, pageSize) {
      this.tableParams.pageNum = pageNum
      this.tableParams.pageSize = pageSize

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
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style scoped lang="scss">
.waitPortrayal-wrap{
  ::v-deep{
    .EtmScreenTab-wrap{
      margin-bottom: 0;
    }

    .currentTags{
      display: flex;
      align-items: center;
      margin-top: 16px;

      .EtmText-wrap{
        display: flex;
        align-items: center;
        height: 25px;
      }

      p{
        margin-right: 16px;
      }
    }
  }
}
</style>

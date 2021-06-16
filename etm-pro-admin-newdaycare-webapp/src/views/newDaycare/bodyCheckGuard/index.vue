<template>
  <div class="healthCheck">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          ref="tabs"
          v-model="tabs"
          :setting="true"
          @setting="toSetting"
        >
          <template v-for="tab in tabsList">
            <el-tab-pane
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            >
              <etm-tool-bar
                v-model="tab.filters"
                @reset="resetQuery"
                @search="confirmQuery"
              />
            </el-tab-pane>
          </template>
        </etm-tabs>
      </div>
      <div slot="body">
        <etm-table-tool-bar slot="tool">
          <div slot="right">
            <template v-if="tabs === 'record'">
              <el-button
                slot="right"
                plain
                @click.stop="exportToExcel"
              >
                导出Excel
              </el-button>
            </template>
            <template v-if="tabs === 'detail'">
              <el-button
                slot="right"
                plain
                @click.stop="exportToExcel"
              >
                导出Excel
              </el-button>
            </template>
          </div>
        </etm-table-tool-bar>
        <etm-table-page
          :data="tableData"
          @currentChange="currentChange"
        >
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            slot="left"
            v-bind="column"
          >
            <template slot-scope="scope">
              <a
                v-if="column._link"
                @click.stop="showDetail(column, scope)"
              >{{ scope.row[column.prop] }}</a>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="tabs === 'detail'"
            slot="right"
            label="操作"
          >
            <template slot-scope="scoped">
              <etm-text
                v-if="!disabled && scoped.row.confirmTime === '-'"
                type="primary"
                @click.stop="abnConfirm(scoped)"
              >
                异常确认
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
        <etm-drawer
          :visible.sync="showDrawer"
          type="small"
        >
          <etm-layout-split>
            <etm-title
              :show-line="false"
              border
              size="big"
            >
              {{ activeRow && activeRow.clazzName }}检查明细
              <template slot="tool">
                <el-button
                  size="mini"
                  plain
                  @click.stop="exportExcel"
                >
                  导出Excel
                </el-button>
              </template>
            </etm-title>
            <etm-table
              :data="detailData"
              :columns="detailColumns"
            />
          </etm-layout-split>
        </etm-drawer>
        <etm-pop
          :visible="showPop"
          pop="complex"
          title="异常确认"
          confirm-btn="确定"
          cancel-btn="取消"
          @open="handlePopOpen"
          @close="handlePopClose"
          @confirm="handlePopConfirm"
          @cancel="handlePopCancel"
        >
          <etm-form
            ref="form"
            :model="formData"
            :rules="rules"
            type="dialog"
          >
            <el-form-item
              label="体温"
              prop="temperature"
            >
              <el-input
                v-model="formData.temperature"
                onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
              />
            </el-form-item>
            <el-form-item
              label="常见病状"
              prop="illness"
            >
              <etm-screen-tab
                v-model="formData.illness"
                :options="illnessList"
                multiple
              />
            </el-form-item>
          </etm-form>
        </etm-pop>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>
import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryClazzList,
  queryOddSureSetting,
  queryCheckTypeList,
  confirmAbnoraml,
  exportClazzCheckRecordToExcel,
  exportAbnoramlCheckListToExcel,
  exportCheckRecordListToExcel,
  queryCheckRecordList,
  queryCheckRecord,
  queryOddTypeList,
  queryAbnoramlCheckList
} from '@/api/newDaycare/bodyCheckGuard'
import { downloadFileForUrl } from '@/utils/file'
import transferDate from '@/utils/date'

const columnsList = {
  record: [
    {
      label: '班级名称',
      prop: 'clazzName',
      _link: true
    },
    {
      label: '待检人数',
      prop: 'checkNumber',
      sortable: true,
      sortBy: 'checkNumber'
    },
    {
      label: '实检人数',
      prop: 'actualCheckNumber',
      sortable: true,
      sortBy: 'actualCheckNumber'
    },
    {
      label: '体温异常（人）',
      prop: 'temperatureAbnormalNumber',
      sortable: true,
      sortBy: 'temperatureAbnormalNumber'
    },
    {
      label: '体表异常（人）',
      prop: 'bodyAbnormalNumber',
      sortable: true,
      sortBy: 'bodyAbnormalNumber'
    },
    {
      label: '检查时间',
      prop: 'checkTime',
      sortable: true,
      sortBy: 'checkTime'
    }
  ],
  detail: [
    {
      label: '班级名称',
      prop: 'clazzName'
    },
    {
      label: '幼儿姓名',
      prop: 'childName'
    },
    {
      label: '体温',
      prop: 'temperature',
      sortable: true,
      sortBy: 'temperature'
    },
    {
      label: '常见病状',
      prop: 'symptom'
    },
    {
      label: '检查时间',
      prop: 'checkTime',
      sortable: true,
      sortBy: 'checkTime'
    },
    {
      label: '确认时间',
      prop: 'confirmTime',
      sortable: true,
      sortBy: 'confirmTime'
    }
  ]
}
export default {
  mixins: [baseMixin],
  data () {
    return {
      tabs: 'record',
      tabsList: [
        {
          label: '检查记录',
          name: 'record',
          filters: [
            {
              type: 'date',
              label: '检查日期',
              props: {
                placeholder: '请选择检查日期',
                clearable: false
              },
              value: ''
            },
            {
              type: 'select',
              label: '班级',
              props: {},
              options: [],
              value: ''
            },
            {
              type: 'select',
              label: '检查类型',
              props: {},
              options: [],
              value: ''
            }
          ]
        },
        {
          label: '异常明细',
          name: 'detail',
          filters: [
            {
              type: 'date',
              label: '检查日期',
              props: {
                placeholder: '请选择检查日期',
                clearable: false
              },
              value: ''
            },
            {
              type: 'select',
              label: '班级',
              props: {},
              options: [],
              value: ''
            },
            {
              type: 'select',
              label: '检查类型',
              props: {},
              options: [],
              value: ''
            }
          ]
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        content: [{}]
      },
      detailData: [{}],
      detailColumns: [
        { label: '幼儿姓名', prop: 'childName' },
        { label: '检查类型', prop: 'subject' },
        { label: '体温', prop: 'temperature' },
        { label: '病状', prop: 'symptom' }
      ],
      activeRow: null,
      cacheData: null, // 缓存异常确认提交的数据
      checkTypeList: [],
      clazzList: [],
      queryObj: null,
      showDrawer: false,
      showPop: false,
      formData: {
        temperature: 36.8,
        illness: []
      },
      rules: {
        temperature: [{ required: true, message: '请输入体温' }],
        illness: [{
          required: true,
          validator (rule, value, callback) {
            if (value.length) {
              callback()
            } else {
              callback(new Error('请选择病状'))
            }
          }
        }]
      },
      illnessList: [],
      disabled: false,
      canExport: true,
      abnormalEntry: false
    }
  },
  computed: {
    columns () {
      return columnsList[this.tabs]
    }
  },
  watch: {
    tabs () {
      if (!this.abnormalEntry) {
        this.refreshTableData()
      }
    }
  },
  created () {
    this.getCheckTypeList()
    this.getClazzList()

    // 获取病症列表
    queryOddTypeList().then(res => {
      Array.isArray(res.data) && res.data.forEach(v => {
        this.illnessList.push({
          name: v.checkProjectName,
          value: v.checkProjectName
        })
      })
    }).catch(err => {
      console.error(err)
    })

    // 获取异常确认按钮是否显示
    queryOddSureSetting().then(res => {
      this.disabled = !res.data.abnormalCheck
    }).catch(err => {
      console.error(err)
    })
  },
  activated () {
    if (this.$store.state.guardcareDashboard.pageEntry === 'bodyCheck') {
      this.$nextTick(() => {
        this.tabs = 'record'
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'abnormalDetail') {
      this.$nextTick(() => {
        this.tabs = 'detail'
        this.abnormalEntry = true
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {
    toSetting () {
      this.$router.push('/newdaycare_bodyCheckGuardSetting')
    },
    confirmQuery () {
      const filters = {
        record: this.tabsList[0].filters,
        detail: this.tabsList[1].filters
      }[this.tabs]
      if (!filters[0].value) return this.$message.warning('请选择检查日期!')
      if (filters[0].value) { // 处理检查日期
        typeof filters[0].value === 'string' ? this.queryObj.checkDate = filters[0].value : this.queryObj.checkDate = transferDate(filters[0].value).time
        this.queryObj.date = this.queryObj.checkDate
      }
      if (filters[1].value !== undefined) { // 处理班级
        this.queryObj.clazzId = filters[1].value
      }
      this.queryObj.subject = filters[2].value
      this.refreshTableData()
    },
    resetQuery () { // 重置按钮点击事件
      // 初始化某些必选的筛选条件
      this.$nextTick(() => {
        this.tabsList[0].filters[2].value = this.checkTypeList[0].value || ''
        this.tabsList[1].filters[2].value = this.checkTypeList[0].value || ''
        this.tabsList[0].filters[0].value = new Date()
        this.tabsList[1].filters[0].value = new Date()
      })
      this.queryObj = {
        subject: this.checkTypeList[0].value,
        checkDate: transferDate(new Date()).time,
        date: transferDate(new Date()).time
      }
      this.refreshTableData()
    },
    showDetail (c, s) {
      this.activeRow = s.row
      queryAbnoramlCheckList(Object.assign({}, this.queryObj, {
        paged: false,
        clazzId: s.row.clazzId,
        abnormal: null
      })).then(res => {
        const { data } = res
        Array.isArray(data) && data.forEach(v => {
          v.temperature = v.temperature || '-'
          v.symptom = v.symptom || '-'
        })
        this.detailData = data || []
      }).catch(err => {
        console.error(err)
      })
      this.showDrawer = true
    },
    exportToExcel () { // 导出表格页成excel表
      if (!this.canExport) return
      this.canExport = false
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.queryObj) options = Object.assign({}, options, this.queryObj)
      if (this.tabs === 'record') {
        exportCheckRecordListToExcel(options).then(res => {
          downloadFileForUrl(res)
          this.canExport = true
        }).catch(err => {
          console.error(err)
          this.canExport = true
        })
      }
      if (this.tabs === 'detail') {
        options.abnormal = true
        exportAbnoramlCheckListToExcel(options).then(res => {
          downloadFileForUrl(res)
          this.canExport = true
        }).catch(err => {
          console.error(err)
          this.canExport = true
        })
      }
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData () {
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.queryObj) options = Object.assign({}, options, this.queryObj)
      if (this.tabs === 'record') { // 查询检查记录
        queryCheckRecordList(options).then(res => {
          const { data } = res
          Array.isArray(data.content) && data.content.forEach(v => {
            v.checkTime = v.checkDate ? transferDate(v.checkDate).time : '-'
          })
          this.tableData = data
        }).catch(err => {
          console.error(err)
        })
      }
      if (this.tabs === 'detail') { // 查询异常明细
        options.abnormal = true
        queryAbnoramlCheckList(options).then(res => {
          const { data } = res
          Array.isArray(data.content) && data.content.forEach(v => {
            v.checkTime = v.checkTime ? transferDate(v.checkTime).fullTime : '-'
            v.confirmTime = v.confirmTime ? transferDate(v.confirmTime).fullTime : '-'
          })
          this.tableData = data
          this.abnormalEntry = false
        }).catch(err => {
          console.error(err)
        })
      }
    },
    abnConfirm (s) {
      this.activeRow = s.row
      queryCheckRecord({ checkRecordId: s.row.checkRecordId }).then(res => {
        const { data } = res
        this.cacheData = data
        this.formData = {
          temperature: data.temperature,
          illness: data.symptom ? data.symptom.split(',') : []
        }
        this.handlePopOpen()
      }).catch(err => {
        console.error(err)
      })
    },
    handlePopOpen () {
      this.showPop = true
    },
    handlePopClose () {
      this.showPop = false
    },
    handlePopConfirm () { // 提交异常确认
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          this.cacheData.temperature = this.formData.temperature
          this.cacheData.symptom = this.formData.illness.join(',')
          this.cacheData.checkRecordId = this.activeRow.checkRecordId
          confirmAbnoraml(this.cacheData).then(res => {
            this.$message.success('异常确认成功')
            this.handlePopClose()
            this.refreshTableData()
          }).catch(err => {
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    handlePopCancel () {
      this.handlePopClose()
    },
    getCheckTypeList () { // 查询检查类型列表
      queryCheckTypeList().then(res => {
        this.checkTypeList = []
        Array.isArray(res.data) && res.data.forEach(v => {
          this.checkTypeList.push({
            label: v.checkSubjectName,
            value: v.checkSubjectName
          })
        })
        this.tabsList[0].filters[2].options = this.checkTypeList
        this.tabsList[1].filters[2].options = this.checkTypeList
        this.resetQuery()
      }).catch(err => {
        console.error(err)
      })
    },
    getClazzList () { // 查询班级列表
      queryClazzList({}).then(res => {
        this.clazzList = [{
          label: '全部',
          value: ''
        }]
        Array.isArray(res.data) && res.data.forEach(v => {
          this.clazzList.push({
            label: v.name,
            value: v.id
          })
        })
        this.tabsList[0].filters[1].options = this.clazzList
        this.tabsList[1].filters[1].options = this.clazzList
      }).catch(err => {
        console.error(err)
      })
    },
    exportExcel () {
      if (!this.canExport) return
      this.canExport = false
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        abnormal: null,
        clazzId: this.activeRow.clazzId
      }
      if (this.queryObj) options = Object.assign({}, options, this.queryObj)
      delete options.checkDate
      exportClazzCheckRecordToExcel(options).then(res => {
        downloadFileForUrl(res)
        this.canExport = true
      }).catch(err => {
        console.error(err)
        this.canExport = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.healthCheck {
  margin-top: 16px;
}
</style>

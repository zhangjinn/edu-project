<template>
  <div class="abnormalTotal-wrap">
    <!--<etm-app-bar title="晨午检" />-->

    <etm-table-page
      ref="etmTable"
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <el-table-column slot="right" label="操作">
        <template v-slot="{row}">
          <etm-text type="primary" @click="detail(row)">详情</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-side :visible.sync="visible" :title="propDetail.clazzName + '晨午检结果'" @close="close">
      <status-item :data="propDetail" :prop="propData" />
    </etm-side>
  </div>
</template>

<script>/**
 *  2020/4/21 9:31
 *  haijinsha
 */

import baseMixin from '@/layout/mixin/baseMixin'
import { queryAbnormalDetailByClazzId, queryBodyCheckAbnormalListPage } from '@/api/bodyCheck'
import EtmSide from '@/layout/main/EtmSide/src/EtmSide'
import StatusItem from '@/views/sacc/attendance/components/statusItem'
import { parseTime } from '@/utils'
import { getEnumKeyByValue } from '@/enums'

const propData = [
  {
    title: '开始日期',
    prop: 'startDate'
  },
  {
    title: '结束日期',
    prop: 'endDate'
  },
  {
    title: '班级名称',
    prop: 'clazzName'
  },
  {
    title: '应检人数',
    prop: 'targetNumber'
  },
  {
    title: '实检人数',
    prop: 'actuallyNumber'
  },
  {
    title: '异常人数',
    prop: 'abnormalNumber'
  }
]
export default {
  name: 'AbnormalTotal',
  components: { StatusItem, EtmSide },
  filters: {},
  mixins: [baseMixin],
  props: {
    showTool: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      propDetail: {},
      propData: propData,
      // 异常统计
      formData: [
        {
          label: '检测日期',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            type: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            clearable: false
          }
        },
        {
          label: '检测类型',
          type: 'select',
          prop: 'checkType',
          value: getEnumKeyByValue('晨检'),
          props: {
            placeholder: '请选择检测类型'
          },
          options: [
            {
              label: '晨检',
              value: getEnumKeyByValue('晨检')
            },
            {
              label: '午检',
              value: getEnumKeyByValue('午检')
            }
          ]
        }
      ],
      tableData: {},
      columns: [
        {
          label: '班级名称',
          prop: 'clazzName'
        },
        {
          label: '应检人次',
          prop: 'targetNumber'
        },
        {
          label: '实检人次',
          prop: 'actuallyNumber'
        },
        {
          label: '异常人次',
          prop: 'abnormalNumber'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getObjectByProp('date').value = [parseTime(Date.now(), '{y}-{m}-{d}'), parseTime(Date.now(), '{y}-{m}-{d}')]
    this.init()
  },
  methods: {
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    init() {
      queryBodyCheckAbnormalListPage({
        startDate: this.getValueByProp('date')[0],
        endDate: this.getValueByProp('date')[1],
        checkType: this.getValueByProp('checkType'),
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(res => {
        this.tableData = res.data
      })
    },
    // 晨午检
    bodyCheckHandleSearch(e) {
      this.init()
    },
    bodyCheckReset() {
      // this.formData[0].value = ''
    },
    detail(row) {
      console.log(row)
      this.visible = true
      queryAbnormalDetailByClazzId({
        clazzId: row.clazzId,
        checkType: this.getValueByProp('checkType'),
        startDate: this.getValueByProp('date')[0],
        endDate: this.getValueByProp('date')[1]
      }).then(res => {
        this.propDetail = row
        this.propData = propData.map(it => it)
        res.data.forEach(item => {
          this.propDetail[item.name] = item.number
          this.propData.push({
            title: item.name,
            prop: item.name
          })
        })
      })
    },
    close() {
      this.visible = false
      this.propDetail = {}
      this.propData = []
    }
  }
}
</script>

<style lang="scss" scoped>
  .abnormalTotal-wrap {

  }
</style>

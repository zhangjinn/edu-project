<template>
  <div class="bodyCheckTotal-wrap">
    <etm-table-page
      ref="etmTable"
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>/**
 *  2020/4/21 9:30
 *  haijinsha
 */

import baseMixin from '@/layout/mixin/baseMixin'
import { queryBodyCheckTotalListPage } from '@/api/bodyCheck'
import { getEnumKeyByValue } from '@/enums'
import { parseTime } from '@/utils'

export default {
  name: 'BodyCheckTotal',
  components: {},
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
      height1: '',
      // 晨午检统计
      formData: [
        {
          label: '检测日期',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            placeholder: '请选择检测时间',
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
        },
        {
          label: '异常率',
          prop: 'abnormalRate'
        },
        {
          label: '建议离园数',
          prop: 'leavingNumber'
        },
        {
          label: '建议离园率',
          prop: 'leavingRate'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getObjectByProp('date').value = parseTime(Date.now(), '{y}-{m}-{d}')
    this.init()
  },
  methods: {
    init() {
      queryBodyCheckTotalListPage({
        date: this.getValueByProp('date'),
        checkType: this.getValueByProp('checkType'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    // 晨午检
    bodyCheckHandleSearch(e) {
      this.init()
    },
    bodyCheckReset() {
      // this.formData[0].value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .bodyCheckTotal-wrap {
  }
</style>

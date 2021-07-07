<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
          >
            <el-tab-pane
              v-if="hasAuth('newdaycare.clazzCommentTeach.queryBatch', 'tabs', 'activeName')"
              label="早教点评"
              name="teach"
            >
              <etm-tool-bar v-model="formData" @search="handleSearch" />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('newdaycare.clazzCommentCare.queryBatch', 'tabs', 'activeName')"
              label="托育点评"
              name="care"
            >
              <etm-tool-bar v-model="formData2" @search="handleSearch2" />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('newdaycare.clazzCommentGuard.queryBatch', 'tabs', 'activeName')"
              label="幼儿点评"
              name="toddler"
            >
              <etm-tool-bar v-model="formData3" @search="handleSearch3" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <teach v-if="activeName==='teach'" :teach="teach" />
          <care v-if="activeName==='care'" :care="care" :set-type="setType" />
          <toddler v-if="activeName==='toddler'" :toddler="toddler" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
// import { parseTime } from '@/utils'

/**
 * index create by Administrator
 * createTime 2021/01/13 17:09
 */
import teach from '@/views/newDaycare/clazzComment/components/teach'
import care from './components/care'
import toddler from '@/views/newDaycare/clazzComment/components/toddler'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { queryFrequency, queryFindByDate } from '@/api/newDaycare/clazzComment'

export default {
  name: 'Index',
  components: { teach, care, toddler },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      activeName: 'teach',
      setType: null,
      formData: [
        {
          label: '课程',
          type: 'input',
          prop: 'courseName',
          value: '',
          props: {
            placeholder: '请输入课程名称'
          }
        },
        {
          label: '上课日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        },
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入宝宝姓名'
          }
        },
        {
          label: '点评状态',
          type: 'select',
          prop: 'state',
          value: '',
          options: [
            {
              label: '已点评',
              value: true
            },
            {
              label: '未点评',
              value: false
            }
          ],
          props: {
            placeholder: '请选择点评状态'
          }
        }
      ],
      formData2: [
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入宝宝姓名'
          }
        },
        {
          label: '点评状态',
          type: 'select',
          prop: 'state',
          value: '',
          options: [
            {
              label: '已点评',
              value: true
            },
            {
              label: '未点评',
              value: false
            }
          ],
          props: {
            placeholder: '请选择点评状态'
          }
        }
      ],
      formData3: [
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '点评日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        },
        {
          label: '幼儿姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入幼儿姓名'
          }
        },
        {
          label: '点评状态',
          type: 'select',
          prop: 'state',
          value: '',
          options: [
            {
              label: '已点评',
              value: true
            },
            {
              label: '未点评',
              value: false
            }
          ],
          props: {
            placeholder: '请选择点评状态'
          }
        }
      ],
      toddler: {},
      teach: {},
      care: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getSetting()
  },
  mounted() {
  },
  methods: {
    handleSearch() {
      const itemSearch = {}
      itemSearch.state = this.getObjectByProp('state', this.formData).value
      itemSearch.childName = this.getObjectByProp('childName', this.formData).value
      itemSearch.courseName = this.getObjectByProp('courseName', this.formData).value
      itemSearch.time = this.getObjectByProp('time', this.formData).value
      this.$set(this, 'teach', itemSearch)
      // console.log(itemSearch)
    },
    handleSearch2() {
      const itemSearch = {}
      itemSearch.state = this.getObjectByProp('state', this.formData2).value
      itemSearch.childName = this.getObjectByProp('childName', this.formData2).value
      itemSearch.courseName = this.getObjectByProp('clazzName', this.formData2).value
      itemSearch.time = this.getObjectByProp('time', this.formData2).value
      this.$set(this, 'care', itemSearch)
      // console.log(itemSearch)
    },
    handleSearch3() {
      const itemSearch = {}
      itemSearch.state = this.getObjectByProp('state', this.formData3).value
      itemSearch.childName = this.getObjectByProp('childName', this.formData3).value
      itemSearch.clazzName = this.getObjectByProp('clazzName', this.formData3).value
      itemSearch.time = this.getObjectByProp('time', this.formData3).value
      this.$set(this, 'toddler', itemSearch)
      // console.log(itemSearch)
    },
    getSetting() {
      queryFrequency().then(res => {
        // console.log(res.data)
        this.setType = res.data.frequencyType
        if (res.data.frequencyType === 'DAILY') {
          this.formData2.splice(1, 0, {
            label: '点评日期',
            type: 'date',
            value: parseTime(new Date(), '{y}-{m}-{d}'),
            prop: 'time',
            default: parseTime(new Date(), '{y}-{m}-{d}'),
            props: {
              type: 'date',
              placeholder: '年/月/日'
            }
          })
        } else if (res.data.frequencyType === 'WEEKLY') {
          this.formData2.splice(1, 0, {
            label: '点评日期',
            type: 'date',
            value: new Date(),
            prop: 'time',
            default: new Date(),
            props: {
              type: 'week',
              format: 'yyyy 第 WW 周',
              placeholder: '请选择周次',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              valueFormat: 'yyyy-MM-dd'
            }
          })
        } else {
          this.formData2.splice(1, 0, {
            label: '点评日期',
            type: 'date',
            value: new Date(),
            prop: 'time',
            default: new Date(),
            props: {
              type: 'month',
              placeholder: '选择时间',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              valueFormat: 'yyyy-MM-dd'
            }
          })
        }
        this.care.time = this.getObjectByProp('time', this.formData2).value
      })
    },
    getWeekMonth(item) {
      queryFindByDate({ type: item }).then(res => {
        // this.daily = res.data
        res.data.forEach(v => {
          v.endLocalDate = parseTime(v.endLocalDate, '{y}-{m}-{d}')
          v.startLocalDate = parseTime(v.startLocalDate, '{y}-{m}-{d}')
          this.daily.push({
            label: v.startLocalDate + '至' + v.endLocalDate,
            value: [v.startLocalDate, v.endLocalDate]
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}
</style>

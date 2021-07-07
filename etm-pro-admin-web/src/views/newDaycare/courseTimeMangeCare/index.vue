<template>
  <div class="index-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName" setting @setting="setting">
          <el-tab-pane
            v-for="(item, index) in tabPane"
            :key="index"
            :label="item.label"
            :name="item.value"
          >
            <etm-tool-bar
              v-if="item['tools']"
              v-model="item.tools"
              @search="handleSearch($event, item.value)"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <component :is="components[activeName]" :props="props" @rever="reverEvent" />
      </template>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/9/16 16:24
 */
import { parseTime } from '@/utils'

// import { queryRomeCareName } from '@/api/daycare/attendanceCare'

function getMonth(date, forward, step) {
  const day = 24 * 3600 * 1000
  let _step = -day

  date.setDate(1)
  if (forward) {
    _step = day * 32
  }

  const timeStamp = date.getTime() + _step
  const _resultTime = new Date(timeStamp)

  _resultTime.setDate(1)

  return (step === 1 ? _resultTime : getMonth(_resultTime, forward, step - 1))
}

function calcDateLists() {
  const _result = []
  const _firstMonth = getMonth(new Date(), false, 4)

  for (let i = 1; i <= 10; i++) {
    const itemMonth = getMonth(_firstMonth, true, i)
    _result.push({
      value: parseTime(itemMonth.getTime(), '{y}-{m}-{d}'),
      label: parseTime(itemMonth.getTime(), '{y}年{m}月')
    })
  }

  return _result
}

const DateLists = calcDateLists()

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      components: {
        oneDayProcess: () => import('./oneDayProcess'),
        // course: () => import('./course'),
        degree: () => import('./degree'),
        schedule: () => import('./schedule')
      },
      activeName: 'degree',
      classList: [],
      props: {},
      tabPane: [
        {
          value: 'degree',
          label: '托育学位',
          tools: [{
            label: '月份',
            props: {
              placeholder: '请选择月份',
              clearable: true,
              filterable: true
            },
            type: 'select',
            value: parseTime(new Date().getTime(), '{y}-{m}-01'),
            prop: 'date',
            options: DateLists
          }]
        },
        {
          value: 'schedule',
          label: '一周日程',
          tools: [{
            label: '班级',
            props: {
              placeholder: '请选择班级',
              clearable: true,
              filterable: true
            },
            type: 'select',
            value: '',
            prop: 'clazzId',
            options: []
          }]
        },
        {
          value: 'oneDayProcess',
          label: '日程内容',
          tools: [{
            type: 'input',
            label: '日程名称',
            props: {
              placeholder: '请输入日程名称'
            },
            prop: 'caeScheduleName',
            value: ''
          }]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    reverEvent(event) {
      const classList = Object.keys(event).map((cur) => {
        return {
          label: event[cur].caeClazzName,
          value: event[cur].caeClazzId
        }
      })
      this.tabPane[1].tools[0].options = classList
      this.tabPane[1].tools[0].value = classList[0].value
    },
    setting() {
      this.$router.push('/newdaycare_setting/courseTimeMange_setting')
    },
    handleSearch(event) {
      const _props = {}
      event.forEach(cur => {
        _props[cur.prop] = cur.value
      })
      this.$set(this, 'props', _props)
    },
    reset() {
      this.props = {}
      this.$nextTick(() => {
        if (this.activeName === 'schedule') {
          this.tabPane[2].tools[0].value = this.tabPane[2].tools[0].options[0].value
        } else if (this.activeName === 'degree') {
          this.tabPane[1].tools[0].value = parseTime(new Date().getTime(), '{y}-{m}-01')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  margin-top: 16px;
}
</style>

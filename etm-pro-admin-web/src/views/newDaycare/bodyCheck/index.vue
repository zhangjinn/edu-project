<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="checkName"
            :setting="hasAuthOfBool('daycare.bodyCheck.setting')"
            @setting="setting"
          >
            <el-tab-pane
              v-if="hasAuth('daycare.bodyCheck.queryBatch', 'tabs', 'checkName')"
              label="检查记录"
              name="bodyCheck"
            >
              <etm-tool-bar v-model="bodyCheck" @search="checkSearch" @reset="reset" />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.unhealthy.queryBatch', 'tabs', 'checkName')"
              label="异常明细"
              name="abnormal"
            >
              <etm-tool-bar v-model="abnormal" @search="abnormalSearch" @reset="reset2" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <check-list v-if="checkName === 'bodyCheck'" :item-type="checkItem" />
          <abnormal-list v-if="checkName === 'abnormal'" :item-type="abnormalItem" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/09/18 9:04
 */
import abnormalList from '@/views/newDaycare/bodyCheck/abnormalList'
import checkList from '@/views/newDaycare/bodyCheck/checkList'
import baseMixin from '@/layout/mixin/baseMixin'
// import { queryClassCareName } from '@/api/daycare/attendanceCare'
import { queryBodyCheckSetting, queryClass } from '@/api/newDaycare/bodyCheck'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: { abnormalList, checkList },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      checkName: 'bodyCheck',
      checkItem: {
        examinationSettingsId: null,
        date: parseTime(new Date(), '{y}-{m}-{d}')
      },
      abnormalItem: {
        examinationSettingsId: null,
        date: parseTime(new Date(), '{y}-{m}-{d}')
      },
      bodyCheck: [
        {
          label: '检查日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        },
        {
          label: '班级',
          type: 'select',
          prop: 'clazzId',
          value: '',
          options: [],
          props: {
            placeholder: '请选择'
          }
        },
        {
          label: '检查类型',
          type: 'select',
          prop: 'examinationSettingsId',
          value: '',
          options: [],
          default: '',
          props: {
            placeholder: '请选择'
          }
        }
      ],
      abnormal: [
        {
          label: '检查日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日'
          }
        },
        {
          label: '班级',
          type: 'select',
          prop: 'clazzId',
          value: '',
          options: [],
          props: {
            placeholder: '请选择'
          }
        },
        {
          label: '检查类型',
          type: 'select',
          prop: 'examinationSettingsId',
          value: '',
          options: [],
          default: '',
          props: {
            placeholder: '请选择'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {
    // checkItem: {
    //   handler() {
    //     console.log(this.checkItem)
    //   },
    //   deep: true
    // }
  },
  created() {
  },
  mounted() {
    // this.getCourse()
    this.getClassName()
    this.getCheckType()
  },
  methods: {
    checkSearch() {
      const itemSearch = {}
      itemSearch.date = this.getObjectByProp('time', this.bodyCheck).value
      itemSearch.clazzId = this.getObjectByProp('clazzId', this.bodyCheck).value
      itemSearch.examinationSettingsId = this.getObjectByProp('examinationSettingsId', this.bodyCheck).value
      // console.log(itemSearch)
      this.checkItem = itemSearch
    },
    abnormalSearch() {
      const itemSearch = {}
      itemSearch.date = this.getObjectByProp('time', this.abnormal).value
      itemSearch.clazzId = this.getObjectByProp('clazzId', this.abnormal).value
      itemSearch.examinationSettingsId = this.getObjectByProp('examinationSettingsId', this.abnormal).value
      // console.log(itemSearch)
      this.abnormalItem = itemSearch
    },
    setting() {
      this.$router.push('/newdaycare_bodyCheckSetting')
    },
    // getCourse() {
    //   queryClassCareName().then(res => {
    //     const itemList = []
    //     res.data.forEach(item => {
    //       itemList.push({
    //         label: item.caeCourseName,
    //         value: item.caeCourseId
    //       })
    //     })
    //     this.$set(this.bodyCheck[1], 'options', itemList)
    //     this.$set(this.abnormal[1], 'options', itemList)
    //   })
    // },
    getClassName() {
      queryClass().then(res => {
        const itemList = []
        // console.log(res.data)
        res.data.forEach(item => {
          itemList.push({
            label: item.clazzName,
            value: item.clazzId
          })
        })
        // console.log(itemList)
        this.$set(this.bodyCheck[1], 'options', itemList)
        this.$set(this.abnormal[1], 'options', itemList)
      })
    },
    getCheckType() {
      queryBodyCheckSetting({ type: 'CHECK_TYPE' }).then(res => {
        const itemList = []
        res.data.forEach(item => {
          itemList.push({
            label: item.checkSettingsName,
            value: item.checkSettingsId
          })
        })
        this.$set(this.bodyCheck[2], 'options', itemList)
        this.$set(this.abnormal[2], 'options', itemList)
        this.$set(this.bodyCheck[2], 'value', itemList[0].value)
        this.$set(this.abnormal[2], 'value', itemList[0].value)
        this.$set(this.checkItem, 'examinationSettingsId', itemList[0].value)
        this.$set(this.abnormalItem, 'examinationSettingsId', itemList[0].value)
        // console.log(this.bodyCheck[2])
      })
    },
    reset() {
      this.$nextTick(() => {
        this.bodyCheck[2].value = this.bodyCheck[2].options[0].value
      })
    },
    reset2() {
      this.$nextTick(() => {
        this.abnormal[2].value = this.bodyCheck[2].options[0].value
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}
</style>

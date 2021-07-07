<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs ref="tabs" v-model="activeName" :setting="hasAuthOfBool('guardcare.course.setting')" @setting="setting" @tab-click="tabChange">
          <el-tab-pane
            v-if="hasAuth('guardcare.courseExtra.queryBatch', 'tabs', 'activeName')"
            label="特色课程"
            name="tab1"
          >
            <etm-tool-bar
              v-model="formData1"
              @search="search('tab1',formData1)"
              @reset="reset('tab1',formData1)"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="hasAuth('guardcare.courseClazz.queryBatch', 'tabs', 'activeName')"
            label="班级课程"
            name="tab2"
          >
            <etm-tool-bar
              v-model="formData2"
              @search="search('tab2',formData2)"
              @reset="reset('tab2',formData2)"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <first-table
          v-if="activeName==='tab1'"
          ref="tab1"
        />
        <second-table
          v-if="activeName==='tab2'"
          ref="tab2"
        />
      </template>
    </etm-layout-split>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import firstTable from './firstTable/firstTable'
import secondTable from './secondTable/secondTable'
// import { getGrade } from '@/api/guardcare/edu/gradeManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
import { getSemesterSetting } from '@/api/newDaycare/listEduGuardScheduleManage'
// import { getSemesterSetting } from '@/api/guardcare/edu/scheduleManage'

export default {
  name: 'Index',
  components: {
    firstTable,
    secondTable
  },
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'tab1',
      formData1: [
        {
          label: '课程名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入课程名称'
          }
        }
      ],
      formData2: [

        {
          label: '学期',
          type: 'select',
          prop: 'semester',
          value: null,
          props: {
            placeholder: '请选择学期'
          },
          options: []
        },
        {
          label: '年级',
          type: 'select',
          prop: 'grade',
          value: null,
          props: {
            placeholder: '请选择年级'
          },
          options: []
        },
        {
          label: '课程名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入课程名称'
          }
        }

      ]

    }
  },
  created() {
    this.reset('tab1', this.formData1)
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addSpecialCourse') {
      this.activeName = 'tab1'
      this.$nextTick(() => {
        this.$refs.tab1.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'addClazzCourse') {
      this.activeName = 'tab2'
      this.$nextTick(() => {
        this.$refs.tab2.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {
    setting() {
      this.$router.push({ path: '/newdaycare_setting/scheduleManageSetting' })
    },
    getSelectData() {
      getSemesterSetting().then(res => {
        const semester = []
        res.data.forEach(v => {
          semester.push({
            label: `${v.name}`,
            value: v.id
          })
        })
        this.formData2[0].options = semester
      }).catch(err => {
        console.error(err)
      })
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.formData2[1].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    search(ref, fromData) {
      this.$refs[ref].formData = fromData
      this.$refs[ref].init()
    },
    tabChange() {
      if (this.activeName === 'tab1') {
        this.reset('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.getSelectData()
        this.reset('tab2', this.formData2)
      }
    },
    reset(ref, fromData) {
      fromData.forEach((item, index) => {
        item.value = null
      })
      this.$nextTick(() => {
        this.$refs[ref].formData = fromData
        this.$refs[ref].init()
      })
    }

  }
}
</script>

<style scoped>

</style>

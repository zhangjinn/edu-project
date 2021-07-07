<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          :setting="hasAuthOfBool('guardcare.scheduleCourse.setting')"
          @setting="setting"
          @tab-click="tabChange"
        >
          <el-tab-pane
            v-if="hasAuth('guardcare.scheduleCourseExtra.queryBatch', 'tabs', 'activeName')"
            label="特色课课表"
            name="tab1"
          >
            <etm-tool-bar
              v-show="activeName==='tab1' && categoryActive==='1'"
              v-model="formData1"
              @search="search('active1',formData1)"
              @reset="reset('active1',formData1)"
            />
            <etm-tool-bar
              v-show="activeName==='tab1' && categoryActive==='2'"
              v-model="formData2"
              @search="search('active2',formData2)"
              @reset="reset('active2',formData2)"
            >
              <EtmSearchClass
                v-show="activeName==='tab1' && categoryActive==='2'"
                ref="searchClass1"
              />
            </etm-tool-bar>
          </el-tab-pane>

          <el-tab-pane
            v-if="hasAuth('guardcare.scheduleCourseClazz.queryBatch', 'tabs', 'activeName')"
            label="班级课表"
            name="tab2"
          >
            <etm-tool-bar
              v-show="activeName==='tab2'"
              v-model="formDataClass"
              @search="search('tab2',formDataClass)"
              @reset="reset('tab2',formDataClass)"
            >
              <EtmSearchClass
                v-show="activeName==='tab2'"
                ref="searchClass2"
              />
            </etm-tool-bar>
          </el-tab-pane>

          <el-tab-pane
            v-if="hasAuth('guardcare.scheduleWeek.queryBatch', 'tabs', 'activeName')"
            label="每周计划"
            name="tab3"
          >
            <etm-tool-bar
              v-show="activeName==='tab3'"
              v-model="formDataWeekPlan"
              @search="search('tab3',formDataWeekPlan)"
              @reset="reset('tab3',formDataWeekPlan)"
            >
              <EtmSearchClass
                v-show="activeName==='tab3'"
                ref="searchClass3"
              />
            </etm-tool-bar>
          </el-tab-pane>

        </etm-tabs>
      </template>
      <template slot="body">
        <first-table
          v-if="activeName === 'tab1' && categoryActive==='1'"
          ref="active1"
          @changeView="changeView"
        />
        <second-table
          v-if="activeName === 'tab1' && categoryActive==='2'"
          ref="active2"
          @changeView="changeView"
        />
        <classSchedule
          v-if="activeName === 'tab2'"
          ref="tab2"
        />
        <weeklyPlan
          v-if="activeName === 'tab3'"
          ref="tab3"
        />

      </template>
    </etm-layout-split>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import EtmSearchClass from './components/EtmSearchClass'
import firstTable from './specialClassSchedule/firstTable/firstTable'
import secondTable from './specialClassSchedule/secondTable/secondTable'
import classSchedule from './classSchedule'
import weeklyPlan from './weeklyPlan'
// import { getRoom } from '@/api/guardcare/edu/roomManage'
// import {} from '@/api/newDaycare/list'
import { getEmployeeAll } from '@/api/customer'
import { getCourseSpecial } from '@/api/newDaycare/listEduGuardCourseManage'
import { getSemesterSetting, getSemesterWeekSetting, getRoom } from '@/api/newDaycare/listEduGuardScheduleManage'
// import { getSemesterSetting, getSemesterWeekSetting } from '@/api/guardcare/edu/scheduleManage'

export default {
  name: 'Index',
  components: {
    firstTable,
    secondTable,
    classSchedule,
    weeklyPlan,
    EtmSearchClass
  },
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'tab1',
      categoryActive: '1',
      formData1: [
        {
          label: '学期',
          type: 'select',
          prop: 'semester',
          value: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择课学期'
          },
          events: {
            change: this.changeSemester
          },
          options: []
        },
        {
          label: '课程名称',
          type: 'select',
          prop: 'courseName',
          value: null,
          props: {
            filterable: true,
            placeholder: '请选择课程名称'
          },
          options: []
        },
        {
          label: '上课场地',
          type: 'select',
          prop: 'roomName',
          value: null,
          props: {
            filterable: true,
            placeholder: '请选择上课场地'
          },
          options: []
        },
        {
          label: '授课老师',
          type: 'select',
          prop: 'teacher',
          value: null,
          props: {
            filterable: true,
            placeholder: '请选择授课老师'
          },
          options: []
        }
      ],
      formData2: [
        {
          label: '学期',
          type: 'select',
          prop: 'semester',
          value: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择课学期'
          },
          events: {
            change: this.changeSemester
          },
          options: []
        },
        {
          label: '课程名称',
          type: 'select',
          prop: 'courseName',
          value: null,
          props: {
            filterable: true,
            placeholder: '请选择课程名称'
          },
          options: []
        }

      ],

      formDataClass: [
        {
          label: '学期',
          type: 'select',
          prop: 'semester',
          value: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择课学期'
          },
          events: {
            change: this.changeSemester
          },
          options: []
        }
      ],
      formDataWeekPlan: [
        {
          label: '学期',
          type: 'select',
          prop: 'semester',
          value: null,
          default: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择课学期'
          },
          events: {
            change: this.changeSemester
          },
          options: []
        },
        {
          label: '周次',
          type: 'select',
          prop: 'week',
          value: null,
          default: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择课周次'
          },
          events: {
            change: this.changeWeek
          },
          options: []
        }
      ],
      formDataSlot: {
        value1: null,
        value2: null,
        value2Label: null
      },
      semester: '',
      clazz: '',
      viewLoaded: false

    }
  },
  created() {
    this.changeView('1')
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'specialSchedule') {
      this.activeName = 'tab1'
      this.categoryActive = '1'
      this.$nextTick(() => {
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'clazzSchedule') {
      this.activeName = 'tab2'
      this.$nextTick(() => {
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'weekPlan') {
      this.activeName = 'tab3'
      this.$nextTick(() => {
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {

    setting() {
      this.$router.push({ path: '/newdaycare_setting/scheduleManageSetting' })
    },

    // 改变tab
    async tabChange() {
      if (this.activeName === 'tab1') {
        await this.changeView('1')
      } else if (this.activeName === 'tab2') {
        await this.getSemesterSettingData(this.formDataClass)
        await this.$refs['searchClass2'].getGradeList()
        this.search('tab2', this.formDataClass)
      } else if (this.activeName === 'tab3') {
        await this.getSemesterSettingData(this.formDataWeekPlan)
        await this.$refs['searchClass3'].getGradeList()
        this.search('tab3', this.formDataWeekPlan)
      }
    },

    // 改变特色课程的视图
    async changeView(val) {
      this.categoryActive = val

      if (this.categoryActive === '1') {
        await this.getSemesterSettingData(this.formData1)
        this.getCourseSpecialData(this.formData1)
        this.getRoomList()
        this.getEmployeeAllData()
        this.search('active1', this.formData1)
      } else if (this.categoryActive === '2') {
        await this.getSemesterSettingData(this.formData2)
        await this.$refs['searchClass1'].getGradeList()
        this.getCourseSpecialData(this.formData2)
        this.search('active2', this.formData2)
      }
    },

    // 搜索--加载table数据
    search(ref, formData) {
      const that = this
      this.$nextTick(() => {
        if (that.activeName === 'tab1' && that.categoryActive === '2') {
          that.formDataSlot = that.$refs['searchClass1'].formDataSlot
        } else if (that.activeName === 'tab2') {
          that.formDataSlot = that.$refs['searchClass2'].formDataSlot
        } else if (that.activeName === 'tab3') {
          that.formDataSlot = that.$refs['searchClass3'].formDataSlot
        }
        that.$refs[ref].formDataSlot = that.formDataSlot
        that.$refs[ref].formData = formData
        that.$refs[ref].init()
      })
    },

    // 重置
    async reset(ref, formData) {
      const that = this
      formData.forEach((item, index) => {
        item.value = null
      })
      await this.getSemesterSettingData(formData)
      if (ref === 'active2') {
        await this.$refs['searchClass1'].getGradeList()
      } else if (ref === 'tab2') {
        await this.$refs['searchClass2'].getGradeList()
      } else if (ref === 'tab3') {
        await this.$refs['searchClass3'].getGradeList()
      }
      that.search(ref, formData)
    },

    // 获取特色课程
    getCourseSpecialData(currentFormData) {
      const param = {
        paged: false
      }
      getCourseSpecial(param).then((res) => {
        currentFormData[1].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 获取场所
    getRoomList() {
      const param = {
        paged: false
      }
      getRoom(param).then((res) => {
        this.formData1[2].options = this.convertDataToOptions(res.data, 'roomName', 'roomId')
      })
    },

    // 获取市场人员
    getEmployeeAllData() {
      getEmployeeAll().then((res) => {
        this.formData1[3].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 学期
    async getSemesterSettingData(currentFormData) {
      await getSemesterSetting({
        noLoadding: true
      }).then(res => {
        const options = this.convertDataToOptions(res.data, 'name', 'id')
        const currentSemester = res.data.filter(val => val.currentTerm)

        currentFormData[0].options = options
        if (currentFormData[0].options.length > 0) {
          if (currentSemester.length > 0) {
            currentFormData[0].value = currentSemester[0].id
            currentFormData[0].default = currentSemester[0].id
            currentFormData[0].name = currentSemester[0].name
          } else {
            currentFormData[0].value = currentFormData[0].options[0].value
            currentFormData[0].default = currentFormData[0].options[0].value
            currentFormData[0].name = currentFormData[0].options[0].label
          }
        }
      }).catch(err => {
        console.error(err)
      })
      if (this.activeName === 'tab3') {
        await this.changeSemester(this.formDataWeekPlan[0].value)
      }
    },

    // 学期改变并获取周次列表
    async changeSemester(id) {
      if (this.activeName === 'tab1' && this.categoryActive === '1') {
        this.formData1[0].name = this.formData1[0].options.find(val => val.value === id).label
      } else if (this.activeName === 'tab1' && this.categoryActive === '2') {
        this.formData2[0].name = this.formData2[0].options.find(val => val.value === id).label
      } else if (this.activeName === 'tab2') {
        this.formDataClass[0].name = this.formDataClass[0].options.find(val => val.value === id).label
      } else if (this.activeName === 'tab3') {
        this.formDataWeekPlan[0].name = this.formDataWeekPlan[0].options.find(val => val.value === id).label
        const param = {
          courseTermId: id,
          noLoadding: true
        }
        await getSemesterWeekSetting(param).then((res) => {
          if (res.data) {
            this.formDataWeekPlan[1].options = this.convertDataToOptions(res.data, 'name', 'id')
            if (this.formDataWeekPlan[1].options.length > 0) {
              const currentTime = new Date().getTime()
              let flag = false
              this.formDataWeekPlan[1].options.forEach(item => {
                if (currentTime >= item.startDate && currentTime <= item.endDate) {
                  this.formDataWeekPlan[1].value = item.value
                  this.formDataWeekPlan[1].default = item.value
                  this.formDataWeekPlan[1].name = item.label
                  flag = true
                }
              })
              if (!flag) {
                this.formDataWeekPlan[1].value = this.formDataWeekPlan[1].options[0].value
                this.formDataWeekPlan[1].default = this.formDataWeekPlan[1].options[0].value
                this.formDataWeekPlan[1].name = this.formDataWeekPlan[1].options[0].label
              }
            }
            res.data.forEach((cur, index) => {
              if (cur.currentTerm) {
                this.formDataWeekPlan[1].value = cur.value
                this.formDataWeekPlan[1].default = cur.value
                this.formDataWeekPlan[1].name = cur.label
              }
            })
          }
        })
      }
    },

    // 周次改变
    changeWeek(id) {
      let name = ''
      this.formDataWeekPlan[1].options.map((val, index) => {
        if (id === val.value) {
          name = val.label
        }
      })
      this.formDataWeekPlan[1].name = name
    }

  }
}
</script>

<style scoped>

</style>

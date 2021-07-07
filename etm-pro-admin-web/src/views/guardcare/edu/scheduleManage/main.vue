<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs ref="tabs" v-model="activeName" :setting="hasAuthOfBool('guardcare.scheduleCourse.setting')" @setting="setting" @tab-click="tabChange">
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
                v-if="activeName==='tab1' && categoryActive==='2'"
                ref="searchClass1"
                @firstTrigger="firstTrigger('active2', formData2)"
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
                v-if="activeName==='tab2'"
                ref="searchClass2"
                @firstTrigger="firstTrigger('tab2', formDataClass)"
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
                v-if="activeName==='tab3'"
                ref="searchClass3"
                @firstTrigger="firstTrigger('tab3',formDataWeekPlan)"
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
import { getRoom } from '@/api/guardcare/edu/roomManage'
import { getEmployeeAll } from '@/api/customer'
import { getCourseSpecial } from '@/api/guardcare/edu/courseManage'
import { getSemesterSetting, getSemesterWeekSetting } from '@/api/guardcare/edu/scheduleManage'

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
      this.$router.push({ path: '/guardcareSettings/scheduleManageSetting' })
    },

    firstTrigger(ref, formData) {
      this.search(ref, formData)
    },

    // 改变tab
    tabChange() {
      if (this.activeName === 'tab1') {
        this.changeView('1')
      } else if (this.activeName === 'tab2') {
        this.getSemesterSettingData('firstTrigger')
        this.$nextTick(() => {
          this.search('tab2', this.formDataClass)
        })
      } else if (this.activeName === 'tab3') {
        this.getSemesterSettingData('firstTrigger')
        this.$nextTick(() => {
          this.search('tab3', this.formDataWeekPlan)
        })
      }
    },

    // 改变特色课程的视图
    changeView(val) {
      this.categoryActive = val
      this.getCourseSpecialData()
      if (this.categoryActive === '1') {
        this.getRoomList()
        this.getEmployeeAllData()
        this.$nextTick(() => {
          this.reset('active1', this.formData1)
        })
      } else if (this.categoryActive === '2') {
        this.$nextTick(() => {
          this.reset('active2', this.formData2)
        })
      }
    },

    // 搜索
    search(ref, formData) {
      this.viewLoaded = false
      const that = this
      if (ref === 'active1') {
        that.initSearch(ref, formData)
      } else if (ref === 'active2') {
        this.formDataSlot = this.$refs['searchClass1'].formDataSlot
        if (this.formDataSlot.value2) {
          that.initSearch(ref, formData)
        }
      } else if (ref === 'tab2') {
        this.formDataSlot = this.$refs['searchClass2'].formDataSlot
        if (this.formDataSlot.value2 && this.formDataClass[0].value) {
          this.viewLoaded = true
          that.initSearch(ref, formData)
        }
      } else if (ref === 'tab3') {
        this.formDataSlot = this.$refs['searchClass3'].formDataSlot
        if (this.formDataSlot.value2 && this.formDataWeekPlan[1].value) {
          this.viewLoaded = true
          that.initSearch(ref, formData)
        }
      }
    },

    // 重置
    reset(ref, formData) {
      const that = this
      if (ref === 'active1') {
        formData.forEach((item, index) => {
          item.value = null
        })
        that.initSearch(ref, formData)
      } else if (ref === 'active2') {
        this.$refs['searchClass1'].initClazz()
        this.formDataSlot = this.$refs['searchClass1'].formDataSlot
        if (this.formDataSlot.value2) {
          that.initSearch(ref, formData)
        }
      } else if (ref === 'tab2') {
        this.initWeek()
        this.$refs['searchClass2'].initClazz()
        this.formDataSlot = this.$refs['searchClass2'].formDataSlot
        if (this.formDataSlot.value2 && this.formDataClass[0].value) {
          that.initSearch(ref, formData)
        }
      } else if (ref === 'tab3') {
        this.initWeek()
        this.$refs['searchClass3'].initClazz()
        this.formDataSlot = this.$refs['searchClass3'].formDataSlot
        if (this.formDataSlot.value2 && this.formDataWeekPlan[1].value) {
          that.initSearch(ref, formData)
        }
      }
    },

    // 加载table数据
    initSearch(ref, formData) {
      this.$nextTick(() => {
        this.$refs[ref].formDataSlot = this.formDataSlot
        this.$refs[ref].formData = formData
        this.$refs[ref].init()
      })
    },

    // 获取特色课程
    getCourseSpecialData() {
      const param = {
        paged: false
      }
      getCourseSpecial(param).then((res) => {
        if (this.categoryActive === '1') {
          this.formData1[0].options = this.convertDataToOptions(res.data, 'name', 'id')
        } else {
          this.formData2[0].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    // 获取场所
    getRoomList() {
      const param = {
        paged: false
      }
      getRoom(param).then((res) => {
        this.formData1[1].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 获取市场人员
    getEmployeeAllData() {
      getEmployeeAll().then((res) => {
        this.formData1[2].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 学期
    getSemesterSettingData(firstTrigger) {
      getSemesterSetting().then(res => {
        const semester = []
        res.data.forEach(v => {
          semester.push({
            label: `${v.name}`,
            value: v.id
          })
        })
        if (this.activeName === 'tab2') {
          this.formDataClass[0].options = semester
          if (this.formDataClass[0].options.length > 0) {
            this.formDataClass[0].value = this.formDataClass[0].options[0].value
            this.formDataClass[0].default = this.formDataClass[0].options[0].value
            this.formDataClass[0].name = this.formDataClass[0].options[0].label
          }
        } else if (this.activeName === 'tab3') {
          this.formDataWeekPlan[0].options = semester
          if (this.formDataWeekPlan[0].options.length > 0) {
            this.formDataWeekPlan[0].value = this.formDataWeekPlan[0].options[0].value
            this.formDataWeekPlan[0].default = this.formDataWeekPlan[0].options[0].value
            this.formDataWeekPlan[0].name = this.formDataWeekPlan[0].options[0].label

            this.changeSemester(this.formDataWeekPlan[0].value, firstTrigger)
          }
        }

        if (firstTrigger) {
          if (this.activeName === 'tab2') {
            this.search('tab2', this.formDataClass)
          }
        }
      }).catch(err => {
        console.error(err)
      })
    },

    // 周次
    getWeekData(id, firstTrigger) {
      const param = {
        courseTermId: id
      }
      getSemesterWeekSetting(param).then((res) => {
        if (res.data) {
          this.formDataWeekPlan[1].options = this.convertDataToOptions(res.data, 'name', 'id')
          if (this.formDataWeekPlan[1].options.length > 0) {
            this.formDataWeekPlan[1].value = this.formDataWeekPlan[1].options[0].value
            this.formDataWeekPlan[1].default = this.formDataWeekPlan[1].options[0].value
            this.formDataWeekPlan[1].name = this.formDataWeekPlan[1].options[0].label
          }
          if (firstTrigger) {
            if (this.activeName === 'tab3') {
              if (this.viewLoaded) {
                return
              }
              this.search('tab3', this.formDataWeekPlan)
            }
          }
        }
      })
    },

    // 学期改变
    changeSemester(id, firstTrigger) {
      if (this.activeName === 'tab2') {
        let name = ''
        this.formDataClass[0].options.map((val, index) => {
          if (id === val.value) {
            name = val.label
          }
        })
        this.formDataClass[0].name = name
      } else if (this.activeName === 'tab3') {
        let name = ''
        this.formDataWeekPlan[0].options.map((val, index) => {
          if (id === val.value) {
            name = val.label
          }
        })
        this.formDataWeekPlan[0].name = name
        this.getWeekData(id, firstTrigger)
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
    },

    // 初始化周次
    initWeek() {
      if (this.formDataWeekPlan[0].options.length > 0) {
        this.formDataWeekPlan[0].value = this.formDataWeekPlan[0].options[0].value
        this.changeSemester(this.formDataWeekPlan[0].value)
      }
    }

  }
}
</script>

<style scoped>

</style>

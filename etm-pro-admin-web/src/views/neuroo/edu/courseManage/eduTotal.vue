<template>
  <div class="eduSchedule-wrap">
    <etm-calendar v-model="currentDate">
      <div slot="header">{{ query.schoolName }} {{ query.clazzName }}</div>
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <div
          :class="[
            'calendar-box',
          ]"
        >
          <div class="calendar-day">{{ day(data) }}</div>
          <template v-for="(item, index) of dateData">
            <template v-if="item.date.split('-')[0] === month(data)" class="当前月">
              <template v-if="item.date.split('-')[1] === day(data)" class="当前天">
                <div :key="index" class="number-box">
                  <!--:class="{'active-course': item.active === course.courseName}"-->
                  <p class="source-item"><span>{{ item.customerNumber }}</span>/{{ item.currentNumber }}/{{ item.arrivedNumber }}/{{ item.requestForLeaveNumber }}</p>
                  <p class="source-item">在册/占位/出勤/请假</p>
                </div>
              </template>
            </template>
          </template>
          <div class="btn_detail">
            <p @click="detail(data.day)">详情</p>
          </div>
        </div>
      </template>
    </etm-calendar>
    <etm-side :append-to-body="false" class="etm-side" :visible.sync="visible" title="学位详情" @close="visible = false">

      <div v-for="(item,index) of schoolPropDetail" :key="index" class="school-box">

        <!--园区信息-->
        <etm-title size="14" :border="true" show-toggle @click.native="item.show = !item.show">{{ item.schoolName }}园区学位详情</etm-title>
        <el-collapse-transition>
          <div v-show="item.show">
            <status-item :data="item" :prop="schoolPropData" />

            <!--班级信息-->
            <template v-for="(clazz, idx) of item.clazzCountList">
              <etm-title :key="idx+ '0'" :border="false">{{ clazz.clazzName }}学位详情</etm-title>
              <status-item :key="idx" :data="clazz" :prop="clazzPropData" />
            </template>
          </div>
        </el-collapse-transition>
      </div>

    </etm-side>
  </div>

</template>

<script>
import EtmCalendar from '@/views/neuroo/edu/courseManage/components/EtmCalendar'
import { queryStudentTotal, queryStudentTotalDetail } from '@/api/neuroo/edu/courseManage'
import { getStartDateAndEndDateByDate } from '@/utils/date'
import { parseTime } from '@/utils'
import EtmSide from '@/layout/main/EtmSide/src/EtmSide'
import StatusItem from '@/views/sacc/attendance/components/statusItem'

/** ∂
 * eduSchedule create by haijinsha
 * createTime 2020/6/22 15:43
 */
export default {
  name: 'EduTotal',
  components: { StatusItem, EtmSide, EtmCalendar },
  filters: {},
  mixins: [],
  props: {
    query: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentDate: new Date(),
      dateData: [],
      visible: false,
      currentCourseInfo: {},
      courses: [],
      clazzId: '',
      schoolPropData: [
        {
          title: '所属园区',
          prop: 'schoolName'
        },
        {
          title: '日期',
          prop: 'date'
        },
        {
          title: '全部学位',
          prop: 'allFullNumber'
        },
        {
          title: '剩余学位',
          prop: 'allLastNumber'
        },
        {
          title: '在册数',
          prop: 'allCustomerNumber'
        },
        {
          title: '占位数',
          prop: 'allCurrentNumber'
        },
        {
          title: '出勤数',
          prop: 'allArrivedNumber'
        },
        {
          title: '请假数',
          prop: 'allRequestForLeaveNumber'
        }
      ],
      clazzPropData: [
        {
          title: '全部学位',
          prop: 'fullNumber'
        },
        {
          title: '当前学员',
          prop: 'currentNumber'
        },
        {
          title: '剩余学位',
          prop: 'lastNumber'
        },
        {
          title: '老师',
          prop: 'teacher'
        },
        {
          title: '出勤数',
          prop: 'arrivedNumber'
        },
        {
          title: '请假数',
          prop: 'requestForLeaveNumber'
        }
      ],
      schoolPropDetail: []
    }
  },
  computed: {},
  watch: {
    query: {
      handler(value) {
        const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(value.date))
        this.currentDate = value.date
        this.init(startDate, endDate)
      },
      deep: true
    },
    currentDate(value, old) {
      if (parseTime(value, '{m}') !== parseTime(old, '{m}')) {
        const { startDate, endDate } = getStartDateAndEndDateByDate(this.currentDate)
        this.$emit('change', parseTime(value, '{y}-{m}-{d}'))
        this.init(startDate, endDate)
      }
    }
  },
  created() {
  },
  mounted() {
    // const { startDate, endDate } = getStartDateAndEndDateByMonth(this.currentDate.getMonth() + 1)
    // this.init(startDate, endDate)
  },
  methods: {
    init(startDate, endDate) {
      // if (!this.query.schoolId) {
      //   return this.$message.warning('请先选择园区')
      // }
      queryStudentTotal({ schoolId: this.query.schoolId, startDate, endDate }).then(res => {
        console.log(res)
        this.dateData = res.data
      })
    },
    month(data) {
      try {
        return data.day.split('-')[1]
      } catch (e) {
        return '-'
      }
    },
    day(data) {
      try {
        return data.day.split('-')[2]
      } catch (e) {
        return '-'
      }
    },
    /**
     * 查询详情
     * @param date
     */
    detail(date) {
      // if (!this.query.schoolId) {
      //   return this.$message.warning('请先选择园区')
      // }
      queryStudentTotalDetail({ schoolId: this.query.schoolId, schoolName: this.query.schoolName, date }).then(res => {
        this.schoolPropDetail = res.data.map(item => {
          item.show = true
          item.date = parseTime(item.date, '{y}-{m}-{d}')
          return item
        })
        console.log(res)
      })
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .eduSchedule-wrap {
    height: 100%;
    overflow: auto;

    & /deep/ {
      .btn_detail {
        cursor: pointer;
        p {
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          @include bgc_main_color();
          color: $white;
        }

        display: none;
      }

      .el-calendar-day {
        height: auto;
      }

      .el-calendar-day:hover {
        .btn_detail {
          display: block;
        }
      }
    }

    .calendar-box {
      min-height: 150px;
      padding: 10px;
      position: relative;
      display: flex;
      flex-direction: column;

      &:hover {
        .calendar-day {
          @include c_main_color();
        }
      }

      .calendar-day {
        font-size: 16px;
      }

      .number-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        top: -10px;

        .source-item:first-child {
          font-size: 20px;

          span {
            font-size: 20px;
            @include c_main_color();
          }
        }
      }

      .btn_detail {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }

    .active-course {
      @include c_main_color();
    }
  }

  .school-box {
    & /deep/ .EtmTitle-wrap {
      margin-bottom: 0;
    }
  }
</style>

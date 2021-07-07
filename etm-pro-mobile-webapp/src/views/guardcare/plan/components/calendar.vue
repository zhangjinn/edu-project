<template>
  <div class="calendar">
    <vue-hash-calendar
      ref="calendar"
      :visible.sync="isShowCalendar"
      v-bind="$attrs"
      :is-show-week-view="true"
      :disabled-week-view="true"
      :disabled-date="disabledDate"
      disabled-class-name="c-999"
      :default-datetime="defaultDatetime"
      :disabled-scroll="true"
      @change="change"
    >
      <div slot="day" slot-scope="scope">
        <div v-if="scope.extendAttr.isToday">今</div>
        <div v-else>{{ scope.date.day }}</div>
      </div>
    </vue-hash-calendar>
  </div>
</template>
<script>
import RunFuncAsync from '../../../../utils/utils'
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isShowCalendar: true,
      defaultDatetime: new Date(),
      weekRangeStart: 0, // 周列表中最早的时间
      weekRangeEnd: Date.now() // 周列表中最后的时间
    }
  },
  watch: {
    list: {
      handler(v) {
        if (!v.length) return
        const weekObj = this.inWeekListRange(new Date())
        if (weekObj) {
          this.defaultDatetime = new Date()
        } else {
          this.defaultDatetime = new Date(v[0].startDate)
        }
        this.weekRangeStart = v[0].startDate
        this.weekRangeEnd = v[v.length - 1].endDate
      },
      immediate: true
    },
    defaultDatetime: {
      handler(v) {
        const fn = () => {
          this.$emit('dateChange', { time: v, obj: this.inWeekListRange(v) })
        }
        const instance = RunFuncAsync.getInstance(fn)
        instance.run()
      }
    }
  },
  methods: {
    prevWeek() {
      this.defaultDatetime = new Date(this.defaultDatetime.getTime() - 7 * 24 * 60 * 60 * 1000)
    },
    nextWeek() {
      this.defaultDatetime = new Date(this.defaultDatetime.getTime() + 7 * 24 * 60 * 60 * 1000)
    },
    inWeekListRange(date) { // 判断传入的时间点是否在周列表中，如果存在返回对应周详情对象，不存在返回false
      date = typeof date === 'object' ? date : new Date(+date)
      if (this.list.length) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].startDate <= date.getTime() && this.list[i].endDate + 24 * 60 * 60 * 1000 > date.getTime()) {
            return this.list[i]
          }
        }
      }
      return false
    },
    change(v) {
      // 这里要判断选择的日期是否超出了学期的周次范围
      if (v.getTime() >= this.weekRangeEnd + 24 * 60 * 60 * 1000) { // 比学期结束晚
        this.defaultDatetime = new Date(this.weekRangeEnd)
        this.$toast('当前周已经是该学期最后一周了噢')
      } else if (v.getTime() < this.weekRangeStart) { // 比学期开始早
        this.defaultDatetime = new Date(this.weekRangeStart)
        this.$toast('当前周已经是该学期第一周了噢')
      } else { // 在学期中
        this.defaultDatetime = v
      }
    },
    disabledDate(v) {
      return !this.inWeekListRange(v)
    }
  }
}
</script>

<style scoped lang="scss">
.calendar {
  border-top: 1px solid $text-e;
  box-shadow: 1px 4px 8px 0px rgba(34, 34, 34, 0.04);
  ::v-deep .c-999 {
    color: $text-9;
  }
}
</style>

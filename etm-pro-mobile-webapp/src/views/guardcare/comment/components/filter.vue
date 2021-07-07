<template>
  <div class="filter">
    <div class="selectBox">
      <van-row>
        <van-col :span="6" class="textLeft">
          <dropdown
            ref="grade"
            type="grade"
            @open="openGrade"
            @select="confirmGrade"
          />
        </van-col>
        <van-col :span="6" class="textCenter">
          <dropdown
            ref="clazz"
            :grade-id="gradeId"
            type="clazz"
            @open="openClazz"
            @select="confirmClazz"
          />
        </van-col>
        <van-col :span="12" class="textRight">
          <template>
            <popup :title="displayTime" :list="columns" @select="confirmTime" @index="i => index = i" />
          </template>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import dropdown from '../../components/dropdown'
import { transferDate } from '../../../../js/rules'
import popup from './popup'
export default {
  components: {
    dropdown,
    popup
  },
  props: {
    frequency: { // PER_MONTH PER_WORK PER_TWO_WORK
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      gradeId: null,
      clazzId: null,
      time: '',
      listByOneWeek: [],
      listByTwoWeek: [],
      listByMonth: [],
      index: 0
    }
  },
  computed: {
    columns() {
      return { 'PER_WORK': this.listByOneWeek, 'PER_TWO_WORK': this.listByTwoWeek, 'PER_MONTH': this.listByMonth }[this.frequency]
    },
    displayTime() {
      if (this.frequency === 'PER_MONTH') {
        return this.time.slice(0, 7)
      } else {
        return this.time.replace('至', '~').replace(/-/g, '/')
      }
    }
  },
  watch: {
    list: {
      handler(list) {
        if (Array.isArray(list) && list.length) {
          this.handleOneWeek(list)
          this.handleTwoWeek(list)
          this.handleOneMonth(list)
          this.time = this.columns[0].name
        }
      },
      immediate: true
    },
    gradeId() {
      this.$emit('change')
    },
    clazzId() {
      this.$emit('change')
    },
    time() {
      this.$emit('change')
    }
  },
  methods: {
    handleOneWeek(source) { // 处理频率为一周的
      this.listByOneWeek = []
      source.forEach(v => {
        this.listByOneWeek.push({
          // startDate: v.startDate,
          // endDate: v.endDate,
          name: v.name.slice(0, 21),
          startWeekId: v.id,
          endWeekId: v.id
        })
      })
    },
    handleTwoWeek(source) { // 处理频率为两周的
      this.listByTwoWeek = []
      for (let i = 0; i < source.length; i += 2) {
        if (source[i] && source[i + 1]) { // 将两周合并成一周
          this.listByTwoWeek.push({
            // startDate: source[i].startDate,
            // endDate: source[i + 1].endDate,
            name: source[i].name.slice(0, 11) + source[i + 1].name.slice(11, 21),
            ids: [source[i].id, source[i + 1].id],
            startWeekId: source[i].id,
            endWeekId: source[i + 1].id
          })
        } else { // 没有两周，直接拿最后一周
          this.listByTwoWeek.push({
            // startDate: source[i].startDate,
            // endDate: source[i].endDate,
            name: source[i].name.slice(0, 21),
            ids: [source[i].id],
            startWeekId: source[i].id,
            endWeekId: source[i].id
          })
        }
      }
    },
    handleOneMonth(source) { // 处理频率为一个月的
      this.listByMonth = []
      if (source.length === 1) {
        this.listByMonth.push({
          // startDate: source[0].startDate,
          // endDate: source[0].endDate,
          name: source[0].name.slice(0, 21),
          startWeekId: source[0].id,
          endWeekId: source[0].id
        })
        return
      }
      let index = 0
      let startMonth, endMonth, startIndex
      while (index < source.length) {
        startIndex = index
        startMonth = transferDate(source[startIndex].startDate).month
        if (startIndex === source.length - 1) { // 如果开头是最后一项
          this.listByMonth.push({
            // startDate: source[0].startDate,
            // endDate: source[0].endDate,
            name: source[startIndex].name.slice(0, 21),
            startWeekId: source[startIndex].id,
            endWeekId: source[startIndex].id
          })
          return
        }
        do {
          endMonth = transferDate(source[index++].startDate).month
        } while (startMonth === endMonth && index + 1 < source.length)
        this.listByMonth.push({
          // startDate: source[startIndex].startDate,
          // endDate: source[index].endDate,
          name: source[startIndex].name.slice(0, 11) + source[index].name.slice(11, 21),
          startWeekId: source[startIndex].id,
          endWeekId: source[index].id
        })
        index++
      }
    },
    // 园区切换
    confirmGrade(val, type) {
      this.gradeId = val.value
      if (type === 'load') return
      this.clazzId = 0
    },
    // 班级切换
    confirmClazz(val) {
      this.clazzId = val.value
    },
    confirmTime(time) {
      this.time = time
    },
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.grade.opendropdown(false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  .selectBox {
    background-color: $white;
  }
  .scrollBox {
    max-height: calc(100vh - 160px);
    overflow-y: auto;
  }
  .textLeft, .textCenter, .textRight {
    text-align: center;
  }
}
</style>

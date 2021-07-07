<template>
  <div class="filter">
    <div class="selectBox">
      <van-row>
        <van-col :span="8" class="textLeft">
          <dropdown
            ref="grade"
            type="grade"
            @select="confirmGrade"
          />
        </van-col>
        <!-- <van-col :span="6" class="textCenter">
          <dropdown
            ref="clazz"
            :grade-id="gradeId"
            type="clazz"
            @open="openClazz"
            @select="confirmClazz"
          />
        </van-col> -->
        <van-col :span="16" class="textRight">
          <template>
            <i @click.stop="prevWeek">&lt; 上一周</i>
            <span>{{ time | transferTime }}</span>
            <i @click.stop="nextWeek">下一周 &gt;</i>
          </template>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import dropdown from '../../plan/components/dropdown'
import transferDate from '../../../../js/date'
export default {
  components: {
    dropdown
  },
  filters: {
    transferTime(date) {
      const timeObj = transferDate(date.getTime())
      return `${timeObj.year}年${timeObj.month}月`
    }
  },
  props: {
    time: {
      type: Date,
      default() {
        return new Date()
      }
    }
  },
  data() {
    return {
      gradeId: null,
      clazzId: null,
      index: 0
    }
  },
  computed: {
  },
  watch: {
    gradeId() {
      this.$emit('change')
    },
    clazzId() {
      this.$emit('change')
    }
  },
  methods: {
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
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.grade.opendropdown(false)
      }
    },
    prevWeek() {
      this.$emit('prevWeek')
    },
    nextWeek() {
      this.$emit('nextWeek')
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  .selectBox {
    height: 60px;
    padding-top: 7.5px;
    background-color: $white;
  }
  .scrollBox {
    max-height: calc(100vh - 160px);
    overflow-y: auto;
  }
  .textLeft, .textCenter, .textRight {
    text-align: center;
  }
  .textRight {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 45px;
    i {
      color: $text-9;
      font-size: 11px;

    }
    span {
      color: $text-2;
      font-size: 14px;
    }
  }
}
</style>

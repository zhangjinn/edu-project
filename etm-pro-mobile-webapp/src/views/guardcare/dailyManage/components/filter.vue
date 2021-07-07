<template>
  <div class="filter">
    <div class="selectBox">
      <van-row>
        <van-col :span="12" class="textLeft">
          <dropdown
            ref="grade"
            type="grade"
            @open="openGrade"
            @select="confirmGrade"
          />
        </van-col>
        <van-col :span="12" class="textCenter">
          <dropdown
            ref="clazz"
            :grade-id="gradeId"
            type="clazz"
            @open="openClazz"
            @select="confirmClazz"
          />
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import dropdown from './dropdown'
export default {
  components: {
    dropdown
  },
  data() {
    return {
      gradeId: null,
      clazzId: null
    }
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
    // 班级切换
    confirmClazz(val) {
      this.clazzId = val.value
    },
    // 园区切换
    confirmGrade(val, type) {
      this.gradeId = val.value
      if (type === 'load') return
      this.clazzId = 0
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

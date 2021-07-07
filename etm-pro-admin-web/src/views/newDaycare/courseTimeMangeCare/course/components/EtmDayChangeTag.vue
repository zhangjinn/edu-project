<template>
  <div class="EtmDayChangeTag-wrap">
    <el-button-group>
      <slot name="left">
        <el-button @click="handleClick(1)"> &lt;</el-button>
      </slot>
      <el-button @click="handleClick(2)">
        <slot>{{ today }}</slot>
      </el-button>
      <slot>
        <el-button @click="handleClick(3)">&gt;</el-button>
      </slot>
    </el-button-group>
  </div>

</template>

<script>/**
 * EtmDayChangeTag create by haijinsha
 * createTime 2020/9/15 14:33
 */
const ONEDAY = 60 * 60 * 24 * 1000
import { parseTime } from '@/utils'

export default {
  name: 'EtmDayChangeTag',
  components: {},
  filters: {},
  mixins: [],
  props: {
    value: {
      // yyyy-MM-dd
      type: String,
      default() {
        return parseTime(new Date(), '{y}-{m}-{d}')
      }
    }
  },
  data() {
    return {
      index: 2
    }
  },
  computed: {
    today() {
      // const date = parseTime(this.value, '{y}-{m}-{d}').split('-')
      // return this.value === parseTime(new Date(), '{y}-{m}-{d}') ? '今天' : date[1] + '-' + date[2]
      return '今天'
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    handleClick(index) {
      this.index = index
      let date = null
      switch (index) {
        case 1:
          // 前一天
          date = parseTime(new Date(this.value).getTime() - ONEDAY, '{y}-{m}-{d}')
          break
        case 2:
          // 今天
          date = parseTime(new Date(), '{y}-{m}-{d}')
          break
        case 3:
          // 明天
          date = parseTime(new Date(this.value).getTime() + ONEDAY, '{y}-{m}-{d}')
      }
      parseTime(this.value, '{y}-{m}-{d}')
      this.$emit('change', date)
    }
  }
}
</script>
<style lang="scss" scoped>
  .EtmDayChangeTag-wrap {

  }
</style>

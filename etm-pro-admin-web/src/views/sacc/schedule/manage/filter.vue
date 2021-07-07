<template>
  <div class="index-wrap">
    <etm-tabs v-model="activeName" :setting="true" @toggle="toggle" @setting="$emit('setting')">
      <el-tab-pane :label="$t('schedule.breadCrumbTitleManage')" name="manage">
        <etm-tool-bar v-show="show" ref="form" v-model="formData" @search="query" @reset="reset" /></el-tab-pane>
    </etm-tabs>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  mixins: [baseMixin],
  data() {
    const _this = this
    return {
      queryWeek: '',
      show: true,
      activeName: 'manage',
      formData: [
        {
          label: _this.$t('schedule.popLabelBelongClass'),
          type: 'input',
          prop: 'queryClass',
          value: '',
          props: {
            placeholder: _this.$t('schedule.classInputPlaceHolderText')
          }
        },
        {
          label: _this.$t('schedule.popLabelDate'),
          type: 'date',
          prop: 'queryTime',
          value: '',
          props: {
            'type': 'week',
            'format': _this.$t('schedule.popFormatDate'),
            'placeholder': _this.$t('schedule.weekSelectPlaceHolderText'),
            'picker-options': { firstDayOfWeek: 1 },
            'ref': 'weekpicker'
          },
          events: {
            'change': this.queryTimeChange
          }
        }
      ]
    }
  },
  created() {
    this.reset()
  },
  methods: {
    query() {
      let queryWeek
      if (this.getValueByProp('queryTime')) {
        const thursday = new Date(new Date(this.getValueByProp('queryTime')).getTime() + 2 * 24 * 60 * 60 * 1000) // 以星期四为基准
        queryWeek = thursday.getFullYear() + '' + this.queryWeek
      } else {
        queryWeek = undefined
      }
      this.$emit('query')
      this.$store.commit('schedule/SET_QUERY', {
        queryClass: this.getValueByProp('queryClass'),
        queryWeek
      })
    },
    reset() {
      this.resetProp()
      this.queryWeek = ''
      this.$emit('query')
      this.$store.commit('schedule/SET_QUERY', {
        queryClass: undefined,
        queryWeek: undefined
      })
    },
    queryTimeChange() {
      this.$nextTick(() => {
        if (this.$refs.form.$refs.weekpicker.displayValue) {
          const weekNumber = this.$refs.form.$refs.weekpicker.displayValue.match(/第(\w+)周/)[1]
          this.queryWeek = ('0' + weekNumber).slice(-2) + this.$t('schedule.weekText')
        } else {
          this.queryWeek = ''
        }
      })
    },
    toggle(val) {
      this.show = val
    }
  }
}
</script>

<style scoped lang="scss">
.index-wrap {

}
</style>

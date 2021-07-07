<template>
  <div class="addSchedule-wrap">
    <etm-pop
      title="添加日程"
      :visible="isShow"
      cancel-btn="取消"
      @close="cancel"
      @cancel="cancel"
      @confirm="confirm"
    >
      <add-form ref="addForm" :props="formProps" />
    </etm-pop>
  </div>

</template>

<script>
/**
 * addSchedule create by Administrator
 * createTime 2020/9/22 11:41
 */

import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { createSchedule } from '@/api/newDaycare/nurseSchedule'
import addForm from '@/views/newDaycare/courseTimeMangeCare/schedule/components/addPop/addForm'

export default {
  name: 'AddSchedule',
  components: {
    // EtmColor,
    addForm
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isShow: false,
      formProps: {},
      form: {
        clazzId: null,
        clazzTeacherId: null,
        date: null,
        timePeriodId: null,
        remark: ''
      }
    }
  },
  computed: {},
  watch: {
    props: {
      deep: true,
      handler(n) {
        this.form.clazzId = n.clazz.caeClazzId
        this.form.clazzTeacherId = n.clazz.headTeacherId
        this.form.date = parseTime((new Date(n.startDay).getTime() + n.step * 3600 * 24 * 1000), '{y}-{m}-{d}')
        this.form.timePeriodId = n.timePeriodId
        this.formProps = { name: n['clazz']['headTeacherName'] }
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    show() {
      this.isShow = true
    },
    cancel() {
      this.isShow = false
      this.reset()
    },
    reset() {
      this.form = {
        clazzId: null,
        clazzTeacherId: null,
        date: null,
        timePeriodId: null,
        remark: ''
      }
      this.$refs['addForm'].reset()
    },
    confirm() {
      this.$refs['addForm'].validate().then(res => {
        const _result = Object.assign(res, this.form)

        _result.helpTeacherId = (_result.helpTeacherId2 || []).join(',')
        createSchedule(_result).then(res => {
          this.cancel()
          this.$message.success('添加日程成功')
          this.$emit('update', {})
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addSchedule-wrap {

}
</style>

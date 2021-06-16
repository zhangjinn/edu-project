<template>
  <div class="remarkSchedule-wrap">
    <etm-pop
      title="添加备注"
      :visible="isShow"
      cancel-btn="取消"
      @close="cancel"
      @cancel="cancel"
      @confirm="confirm"
    >
      <etm-form
        v-model="form"
        type="dialog"
      >
        <el-form-item label="备注内容">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="日程内容">
          {{ props.name }}
        </el-form-item>
        <el-form-item label="日期">
          {{ curDate }}
        </el-form-item>
        <el-form-item label="时间">
          {{ props.round }}
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
/**
 * remarkSchedule create by Administrator
 * createTime 2020/9/22 13:34
 */
import { parseTime } from '@/utils'
import { createRemark } from '@/api/newDaycare/nurseSchedule'

export default {
  name: 'RemarkSchedule',
  components: {},
  filters: {},
  mixins: [],
  props: {
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        id: null,
        remark: ''
      },
      isShow: false
    }
  },
  computed: {
    curDate () {
      const { props } = this
      console.log(props, '-----')
      return parseTime((new Date(props.startDay).getTime() + props.step * 24 * 3600 * 1000), '{y}-{m}-{d}')
    }
  },
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    confirm () {
      this.form.id = this.props.id

      createRemark(this.form).then(res => {
        this.cancel()
        this.$message.success('备注添加成功')
        this.$emit('update', {})
      })
    },
    cancel () {
      this.isShow = false
      this.form = {
        id: null,
        remark: ''
      }
      this.reset()
    },
    reset () {

    },
    show () {
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

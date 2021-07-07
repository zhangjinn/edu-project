<template>
  <div class="setting-wrap">
    <etm-title>考勤时间设置</etm-title>
    <el-form ref="form" :model="form" label-width="300px" style="margin-top: 24px;">
      <el-form-item label="送园签入时间">
        <el-time-picker v-model="form.enterTime" placeholder="选择时间" />
      </el-form-item>
      <el-form-item label="离园签出时间">
        <el-time-picker v-model="form.leaveTime" placeholder="选择时间" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button class="etm-button-plain" type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import EtmTitle from '@/layout/main/EtmTitle/src/EtmTitle'
import { queryAttendanceSettings, updateAttendanceSettings } from '@/api/attendance'

/**
   *  2020/4/20 19:08
   *  haijinsha
   */
export default {
  name: 'Setting',
  components: { EtmTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      form: {
        enterTime: '',
        leaveTime: ''
      },
      rules: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryAttendanceSettings().then(res => {
        this.form = res.data
      })
    },
    save() {
      const { leaveTime, enterTime } = this.form
      updateAttendanceSettings({ leaveTime, enterTime }).then(res => {
        this.$message.success('更新成功')
        this.$emit('switch', 'attendance')
      })
    },
    cancel() {
      this.$emit('switch', 'attendance')
    }
  }
}
</script>

<style lang="scss" scoped>
  .setting-wrap {

  }
</style>

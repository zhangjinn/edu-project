<template>
  <div class="recoverWrap">
    <ul>
      <li class="row">
        <p>
          请假时间大于
          <el-input v-model="receiveDay" @blur="dayUp" />
          天视为有效请假
        </p>
        <el-switch v-model="receiveValue" @change="sent" />
      </li>
    </ul>
  </div>
</template>
<script>
import { queryAttendanceSetting, updateAttendanceSetting } from '@/api/newDaycare/attendanceTeach'

export default {
  data() {
    return {
      receiveDay: 3,
      receiveValue: true,
      settingID: ''
    }
  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    sent() {
      // console.log(this.receiveValue)
      this.updateSetting()
    },
    dayUp() {
      // console.log(this.receiveDay)
      this.updateSetting()
    },
    init() {
      queryAttendanceSetting().then(res => {
        this.settingID = res.data.taattendanceSettingId
        this.receiveDay = res.data.value
        this.receiveValue = res.data.enable
      })
    },
    updateSetting() {
      updateAttendanceSetting({
        taattendanceSettingId: this.settingID,
        value: this.receiveDay,
        enable: this.receiveValue
      }).then(res => {
        this.$message.success('操作成功')
        this.init()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.recoverWrap {
  .row {
    width: 50%;
    height: 48px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > > > .el-input {
      width: 30px;

      .el-input__inner {
        padding: 0;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>

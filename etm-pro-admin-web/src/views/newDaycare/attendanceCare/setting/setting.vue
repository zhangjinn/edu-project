<template>
  <div class="recoverWrap">
    <ul>
      <li class="row">
        <p>
          请假连续大于
          <el-input v-model="receiveDay" oninput="value = value.replace(/(^0)|[^\d]/g, '')" @blur="dayUp" />
          天，合同时长将自动顺延
        </p>
        <el-switch v-model="receiveValue" @change="sent" />
      </li>
    </ul>
  </div>
</template>
<script>
import { queryAttendanceCareSetting, updateAttendanceCareSetting } from '@/api/newDaycare/attendanceCare'

export default {
  data() {
    return {
      receiveDay: 1,
      receiveValue: true
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
      queryAttendanceCareSetting().then(res => {
        this.settingID = res.data.caAattendanceSettingId
        this.receiveDay = res.data.value
        this.receiveValue = res.data.enable
      })
    },
    updateSetting() {
      updateAttendanceCareSetting({
        caAattendanceSettingId: this.settingID,
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

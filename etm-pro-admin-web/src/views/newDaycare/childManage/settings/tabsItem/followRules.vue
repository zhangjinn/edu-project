<template>
  <div class="followWrap">
    <ul>
      <li class="row">
        <p>
          新学员下次跟进时间小于
          <el-input v-model="day" @blur="dayUp" />
          天
        </p>
        <el-switch v-model="value" @change="dayUp" />
      </li>
    </ul>
  </div>
</template>
<script>
import { queryStuRule, updateStuRule } from '@/api/newDaycare/childManageSettings'

export default {
  components: {},
  data() {
    return {
      value: true,
      day: 3,
      ruleId: ''
    }
  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryStuRule({ ruleName: 'NEXT_FOLLOW_INTERVAL' }).then(res => {
        // console.log(res.data)
        this.ruleId = res.data[0].ruleId
        this.day = res.data[0].value
        this.value = res.data[0].enable
      })
    },
    updateSetting() {
      updateStuRule({ ruleId: this.ruleId, value: this.day, enable: this.value }).then(res => {
        this.$message.success('操作成功')
        this.init()
      })
      // console.log(this.day, this.value)
    },
    dayUp() {
      this.updateSetting()
    }
  }
}
</script>

<style scoped lang="scss">
.followWrap {
  .row {
    width: 50%;
    height: 48px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & ::v-deep .el-input {
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

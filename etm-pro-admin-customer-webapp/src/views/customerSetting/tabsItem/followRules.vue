<template>
  <div class="followWrap">
    <ul>
      <li class="row">
        <p>
          新客户下次跟进时间小于
          <el-input
            v-model="day"
            @input="v => day = restrictInput(v)"
            @blur="dayUp"
          />
          天
        </p>
        <el-switch
          v-model="value"
          @change="dayUp"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import {
  queryFollowRules,
  updateFollowRules,
  createFollowRules
} from '@/api/customerSettings'
export default {
  components: {},
  data () {
    return {
      value: true,
      day: 3,
      ruleId: ''
    }
  },
  computed: {},
  mounted () {
    this.init()
  },
  methods: {
    restrictInput (value) {
      if (Number.isNaN(+value) || +value <= 0) {
        this.$message.warning('请输入大于0的正整数')
        return 1
      } else {
        return value
      }
    },
    init () {
      queryFollowRules().then(res => {
        this.ruleId = res.data[0].id
        this.day = res.data[0].value
        this.value = res.data[0].enable
      })
    },
    updateSetting () {
      if (this.ruleId) {
        updateFollowRules({
          id: this.ruleId,
          value: this.day,
          rule: 'NEXT_FOLLOW_TIME_LE',
          enable: this.value
        }).then(res => {
          this.$message.success('操作成功')
          this.init()
        })
      } else {
        createFollowRules({
          value: this.day,
          rule: 'NEXT_FOLLOW_TIME_LE',
          enable: this.value
        }).then(res => {
          this.$message.success('操作成功')
          this.init()
        })
      }
    },
    dayUp () {
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

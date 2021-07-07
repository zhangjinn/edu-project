<template>
  <div class="recoverWrap">
    <ul>
      <li class="row">
        <p>
          <el-input v-model="params['NOT_FOLLOWED_RECYCLE'].input" @blur="updateSetting('NOT_FOLLOWED_RECYCLE')" />
          天未跟进的学员自动回收至公海
        </p>
        <el-switch v-model="params['NOT_FOLLOWED_RECYCLE'].switch" @change="updateSetting('NOT_FOLLOWED_RECYCLE')" />
      </li>
      <li class="row">
        <p>
          <el-input v-model="params['UNSOLD_RECYCLE'].input" @blur="updateSetting('UNSOLD_RECYCLE')" />
          天未成交的学员自动回收至公海
        </p>
        <el-switch v-model="params['UNSOLD_RECYCLE'].switch" @change="updateSetting('UNSOLD_RECYCLE')" />
      </li>
      <li class="row">
        <p>
          最后跟进人员
          <el-input v-model="params['RECEIVE_CHILD'].input" @blur="updateSetting('RECEIVE_CHILD')" />
          天内不可领取其已自动回收的学员
        </p>
        <el-switch v-model="params['RECEIVE_CHILD'].switch" @change="updateSetting('RECEIVE_CHILD')" />
      </li>
    </ul>
  </div>
</template>
<script>
import { queryStuRule, updateStuRule } from '@/api/newDaycare/childManageSettings'

export default {
  data() {
    return {
      params: {
        'NOT_FOLLOWED_RECYCLE': {
          input: 3,
          switch: true,
          id: null
        },
        'RECEIVE_CHILD': {
          input: 3,
          switch: true,
          id: null
        },
        'UNSOLD_RECYCLE': {
          input: 3,
          switch: true,
          id: null
        }
      }
    }
  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryStuRule({ ruleName: 'NOT_FOLLOWED_RECYCLE' }).then(res => {
        // console.log(res.data)

        res.data.forEach(cur => {
          this.params[cur.ruleName] = {
            input: cur.value,
            switch: cur.enable,
            id: cur.ruleId
          }
        })
      })
    },
    updateSetting(key) {
      const value = this.params[key]
      updateStuRule({ ruleId: value.id, value: value.input, enable: value.switch }).then(res => {
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

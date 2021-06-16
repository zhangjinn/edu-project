<template>
  <div class="recoverWrap">
    <ul>
      <li class="row">
        <p>
          <el-input
            v-model="followday"
            @input="v => followday = restrictInput(v)"
            @blur="updateSetting"
          />
          天未跟进的会员自动回收至公海
        </p>
        <el-switch
          v-model="followvalue"
          @change="updateSetting"
        />
      </li>
      <li class="row">
        <p>
          <el-input
            v-model="nodealday"
            @input="v => nodealday = restrictInput(v)"
            @blur="dealSetting"
          />
          天未成交的会员自动回收至公海
        </p>
        <el-switch
          v-model="nodealvalue"
          @change="dealSetting"
        />
      </li>
      <li class="row">
        <p>
          最后跟进人员
          <el-input
            v-model="receiveday"
            @input="v => receiveday = restrictInput(v)"
            @blur="receiveSetting"
          />
          天内不可领取其已自动回收的会员
        </p>
        <el-switch
          v-model="receivevalue"
          @change="receiveSetting"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import {
  queryRecoverRules,
  updateRecoverRules,
  createRecoverRules
} from '@/api/customerSettings'
export default {
  data () {
    return {
      followday: 3,
      followvalue: true,
      followId: '',
      nodealday: 3,
      nodealvalue: true,
      nodealId: '',
      receiveday: 3,
      receivevalue: true,
      receiveId: ''
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
      queryRecoverRules().then(res => {
        const { data } = res
        Array.isArray(data) && data.forEach(v => {
          if (v.rule === 'NOT_FOLLOWED_RECYCLE') {
            this.followday = v.value
            this.followvalue = v.enable
            this.followId = v.id
          } else if (v.rule === 'UNSOLD_RECYCLE') {
            this.nodealday = v.value
            this.nodealvalue = v.enable
            this.nodealId = v.id
          } else if (v.rule === 'RECEIVE_CUSTOMER') {
            this.receiveday = v.value
            this.receivevalue = v.enable
            this.receiveId = v.id
          }
        })
      })
    },
    updateSetting () {
      if (this.followId) {
        updateRecoverRules({
          id: this.followId,
          value: this.followday,
          enable: this.followvalue,
          rule: 'NOT_FOLLOWED_RECYCLE'
        }).then(res => {
          this.$message.success('操作成功')
          this.init()
        })
      } else {
        createRecoverRules({
          value: this.followday,
          enable: this.followvalue,
          rule: 'NOT_FOLLOWED_RECYCLE'
        }).then(res => {
          this.$message.success('操作成功')
          this.init()
        })
      }
    },
    dealSetting () {
      updateRecoverRules({
        id: this.nodealId,
        value: this.nodealday,
        enable: this.nodealvalue,
        rule: 'UNSOLD_RECYCLE'
      }).then(res => {
        this.$message.success('操作成功')
        this.init()
      })
    },
    receiveSetting () {
      if (this.followId) {
        updateRecoverRules({
          id: this.receiveId,
          value: this.receiveday,
          enable: this.receivevalue,
          rule: 'RECEIVE_CUSTOMER'
        }).then(res => {
          this.$message.success('操作成功')
          this.init()
        })
      } else {
        createRecoverRules({
          value: this.followday,
          enable: this.followvalue,
          rule: 'RECEIVE_CUSTOMER'
        }).then(res => {
          this.$message.success('操作成功')
          this.init()
        })
      }
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

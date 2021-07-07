<template>
  <div class="account">
    <div class="switch">
      <span :class="{active: active === 'balance'}" @click.stop="switchState('balance')">账户余额</span>
      <span :class="{active: active === 'refund'}" @click.stop="switchState('refund')">退费记录</span>
    </div>
    <div class="amount">
      <div class="money">
        <span>¥</span>
        3,000
      </div>
      <el-button>提现</el-button>
    </div>
    <div class="more">
      <Etm-title>余额明细</Etm-title>
      <ul>
        <li>
          <div>
            <p>单据8899666退费200元到余额</p>
            <span class="time">2020/02/23  20:23</span>
          </div>
          <div class="plus">
            +200元
          </div>
        </li>
        <li>
          <div>
            <p>账户提现200</p>
            <span class="time">2020/02/23  20:23</span>
          </div>
          <div class="minus">
            -200元
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import EtmTitle from '@/layout/main/EtmTitle'
export default {
  components: {
    EtmTitle
  },
  data() {
    return {
      active: 'balance'
    }
  },
  methods: {
    switchState(state) {
      this.active = state
    }
  }
}
</script>

<style scoped lang="scss">
.account {
  height: calc(100vh - 225px);
  overflow-y: auto;
  .switch {
    font-size: 14px;
    line-height: 32px;
    padding: 0 24px;
    span {
      cursor: pointer;
      @include c_text_color();
      &.active {
        @include c_title_color();
      }
      & + span {
        margin-left: 28px;
      }
    }
  }
  .amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 24px;
    .money {
      @include c_title_color();
      font-size: 24px;
      font-weight: bold;
      span {
        font-size: 16px;
      }
    }
    & >>> .el-button {
      padding: 9px 25px;
      @include bgc_white();
      @include c_main_color();
    }
  }
  .more {
    & >>> .EtmTitle-wrap .text {
      border-top: 1px solid;
      @include bc_divide_color();
      border-bottom: none;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0 24px 15px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 78px;
        border-bottom: 1px solid;
        @include bc_divide_color();
      }
      p {
        font-size: 14px;
        @include c_text_color();
        margin-bottom: 12px;
      }
      span {
        font-size: 14px;
        @include c_secondary_color();
      }
      .plus {
        @include c_main_color();
        font-size: 16px;
      }
      .minus {
        @include c_title_color();
        font-size: 16px;
      }
    }
  }
}
</style>

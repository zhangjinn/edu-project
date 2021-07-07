<template>
  <div class="menuList">
    <etm-title>{{ $t('schedule.scheduleManageSettingTitle') }}</etm-title>
    <div class="menuListBtn">
      <span
        :class="{active: settingState === 'time'}"
        @click.stop="switchState('time')"
      >
        {{ $t('schedule.scheduelTimeTitle') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  data() {
    return {
      activeMenu: ['menu']
    }
  },
  computed: {
    settingState() {
      return this.$store.state.schedule.settingState
    }
  },
  methods: {
    switchState(state) {
      this.$store.commit('schedule/SET_SETTINGSTATE', state)
    }
  }
}
</script>

<style scoped lang="scss">
.menuList {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    @include bgc_white();
    padding-top: 3px;
    font-size: 14px;

    & /deep/.EtmTitle-wrap{
      font-size: 14px;
      margin-bottom: 0;
      .text{
        border: 0;
      }
    }
    &Btn {
      display: flex;
      flex-direction: column;
      padding-left: 24px;
      & /deep/ >span {
        display: block;
        width: 100%;
        text-align: left;
        cursor: pointer;
        @include c_text_color();
        & + span{
          margin-top: 16px;
        }
        &.active {
          background-color: transparent;
          border-radius: 0;
          @include c_main_color();
        }
      }

    }
  }
</style>

<template>
  <div class="signUpSetup">
    <etm-layout-split>
      <div slot="left">
        <!--        <etm-title :border="false">考勤规则</etm-title>-->
        <!--        <div class="menuListBtn">-->
        <!--          <span-->
        <!--            type="text"-->
        <!--            :class="{active: activeBtn === 'holiday'}"-->
        <!--            @click="handleSwitch('holiday')"-->
        <!--          >-->
        <!--            假期设置-->
        <!--          </span>-->
        <!--        </div>-->
        <etm-title :border="false">套餐设置</etm-title>
        <div class="menuListBtn">
          <span
            v-for="(item,index) in setList"
            :key="index"
            type="text"
            :class="{active: activeBtn === item.tag}"
            @click="handleSwitch(item.tag)"
          >
            {{ item.text }}
          </span>
        </div>
      </div>
      <div slot="right">
        <holiday v-if="activeBtn === 'holiday'" />
        <care-type v-show="activeBtn === 'careType'" />
        <care-plan v-show="activeBtn === 'carePlan'" />
        <standard v-show="activeBtn === 'standard'" />
        <material v-show="activeBtn === 'material'" />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import holiday from './holiday'
import careType from './careType'
import carePlan from './carePlan'
import standard from './standard'
import material from './material'

export default {
  components: {
    holiday,
    careType,
    carePlan,
    standard,
    material
  },
  data() {
    return {
      activeBtn: 'careType',
      setList: [
        {
          text: '托管类型',
          tag: 'careType'
        },
        {
          text: '托管套餐',
          tag: 'carePlan'
        },
        {
          text: '餐费标准',
          tag: 'standard'
        },
        {
          text: '材料物品',
          tag: 'material'
        }
      ]
    }
  },
  methods: {
    handleSwitch(tag) {
      this.activeBtn = tag
    }
  }
}
</script>

<style lang="scss" scoped>
  .signUpSetup {

    .menuListBtn {
      display: flex;
      flex-direction: column;
      padding-left: 16px;

      & /deep/ > span {
        display: block;
        margin-bottom: 16px;
        text-align: left;
        cursor: pointer;
        @include c_text_color();

        &.active {
          background-color: transparent;
          border-radius: 0;
          @include c_main_color();
        }
      }

    }
  }
</style>

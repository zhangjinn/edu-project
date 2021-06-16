<template>
  <div class="rightContent-wrap">
    <div
      class="colBox allowance"
      @click="toAllowance"
    >
      托育申请补贴流程
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_allowanceBG.png">
      </div>
    </div>
    <div
      class="colBox skill"
      @click="toSkill"
    >
      高效获客技巧
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_skillBG.png">
      </div>
    </div>
    <div
      class="colBox recipe"
      @click="toRecipe"
    >
      托育营养食谱标准
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_recipeBG.png">
      </div>
    </div>
    <div
      class="colBox policy"
      @click="toPolicy"
    >
      2020托育新政
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_policyBG.png">
      </div>
    </div>
  </div>
</template>

<script>
/**
 * rightContent create by Administrator
 * createTime 2020/9/25 14:01
 */
export default {
  name: 'RightContent',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    toAllowance () {
      this.$router.push({
        path: '/newdaycare_list/daycare_allowanceGuide'
      })
    },
    toSkill () {
      this.$router.push({
        path: '/newdaycare_list/daycare_skillGuide'
      })
    },
    toRecipe () {
      this.$router.push({
        path: '/newdaycare_list/daycare_recipeGuide'
      })
    },
    toPolicy () {
      this.$router.push({
        path: '/newdaycare_list/daycare_policyGuide'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rightContent-wrap {
  .colBox {
    @include c_white();
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    margin-bottom: 16px;
    padding: 0 20px;
    position: relative;

    &:hover {
      opacity: 0.8;
    }

    .bgImg {
      bottom: 0;
      left: 0;
      position: absolute;
      width: 100%;

      img {
        display: block;
        width: 100%;
      }
    }

    .iconImg {
      bottom: 0;
      position: absolute;
      right: 16px;
      width: 48px;

      img {
        display: block;
        width: 100%;
      }
    }

    &.allowance {
      background: linear-gradient(to right, #81bfff, #55a8fd);
    }

    &.skill {
      background: linear-gradient(to right, #ffcf74, #ffbc3c);
    }

    &.recipe {
      background: linear-gradient(to right, #77e99c, #4dd87a);
    }

    &.policy {
      background: linear-gradient(to right, #b0a4ef, #8f7ee5);
    }
  }
}
</style>

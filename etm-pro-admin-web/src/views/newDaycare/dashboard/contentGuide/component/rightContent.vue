<template>
  <div class="rightContent-wrap">
    <div class="colBox allowance" @click="toAllowance">
      托育申请补贴流程
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_allowanceBG.png">
      </div>
    </div>
    <div class="colBox skill" @click="toSkill">
      高效获客技巧
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_skillBG.png">
      </div>
    </div>
    <div class="colBox recipe" @click="toRecipe">
      托育营养食谱标准
      <div class="bgImg">
        <img src="../../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../../assets/images/guardcare/dashboard_recipeBG.png">
      </div>
    </div>
    <div class="colBox policy" @click="toPolicy">
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
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    toAllowance() {
      this.$router.push({
        path: '/newdaycare_list/daycare_allowanceGuide'
      })
    },
    toSkill() {
      this.$router.push({
        path: '/newdaycare_list/daycare_skillGuide'
      })
    },
    toRecipe() {
      this.$router.push({
        path: '/newdaycare_list/daycare_recipeGuide'
      })
    },
    toPolicy() {
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
    position: relative;
    padding: 0 20px;
    margin-bottom: 16px;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    @include c_white();
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    .bgImg {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;

      img {
        display: block;
        width: 100%;
      }
    }

    .iconImg {
      position: absolute;
      right: 16px;
      bottom: 0;
      width: 48px;

      img {
        display: block;
        width: 100%;
      }
    }

    &.allowance {
      background: linear-gradient(to right, #81BFFF, #55A8FD);
    }

    &.skill {
      background: linear-gradient(to right, #FFCF74, #FFBC3C);
    }

    &.recipe {
      background: linear-gradient(to right, #77E99C, #4DD87A);
    }

    &.policy {
      background: linear-gradient(to right, #B0A4EF, #8F7EE5);
    }
  }
}
</style>

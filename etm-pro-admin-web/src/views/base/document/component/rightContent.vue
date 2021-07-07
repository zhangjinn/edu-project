<template>
  <div class="rightContent-wrap">
    <div class="colBox allowance" @click="toAllowance">
      国家卫生健康委关于做好托育机构相关工作的通知及解读
      <div class="bgImg">
        <img src="../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../assets/images/guardcare/dashboard_allowanceBG.png">
      </div>
    </div>
    <div class="colBox skill" @click="toSkill">
      托育中心如何设计一日流程？
      <div class="bgImg">
        <img src="../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../assets/images/guardcare/dashboard_skillBG.png">
      </div>
    </div>
    <div class="colBox recipe" @click="toRecipe">
      两类托育服务可享中央每人1万元补助，该如何申请？
      <div class="bgImg">
        <img src="../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../assets/images/guardcare/dashboard_recipeBG.png">
      </div>
    </div>
    <div class="colBox policy" @click="toPolicy">
      托育中心如何设计，托育中心的设计原则
      <div class="bgImg">
        <img src="../../../../assets/images/guardcare/dashboard_rippleBg.png">
      </div>
      <div class="iconImg">
        <img src="../../../../assets/images/guardcare/dashboard_policyBG.png">
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
        path: '/document/allowanceGuide'
      })
    },
    toSkill() {
      this.$router.push({
        path: '/document/skillGuide'
      })
    },
    toRecipe() {
      this.$router.push({
        path: '/document/recipeGuide'
      })
    },
    toPolicy() {
      this.$router.push({
        path: '/document/policyGuide'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rightContent-wrap {
  .colBox {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 0 20px;
    margin-bottom: 16px;
    height: 60px;
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
      background: linear-gradient(to right, #81bfff, #19a8fd);

      &:hover {
        background: linear-gradient(to right, rgba(129, 191, 255, .8), rgba(85, 168, 253, .8));
      }
    }

    &.skill {
      background: linear-gradient(to right, #ffcf74, #ffbc3c);

      &:hover {
        background: linear-gradient(to right, rgba(255, 207, 116, .8), rgba(255, 188, 60, .8));
      }
    }

    &.recipe {
      background: linear-gradient(to right, #77e99c, #4dd87a);

      &:hover {
        background: linear-gradient(to right, rgba(119, 233, 156, .8), rgba(77, 216, 122, .8));
      }
    }

    &.policy {
      background: linear-gradient(to right, #b0a4ef, #8f7ee5);

      &:hover {
        background: linear-gradient(to right, rgba(176, 164, 239, .8), rgba(143, 126, 229, .8));
      }
    }
  }
}
</style>

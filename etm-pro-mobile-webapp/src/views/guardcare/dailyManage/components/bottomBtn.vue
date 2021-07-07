<template>
  <div class="bottomBtn">
    <div class="cancel" @click.stop="$router.go(-1)">取消</div>
    <div class="finish" @click.stop="$emit('finish')">完成</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.bottomBtn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 50px;
  background-color: $white;
  .cancel, .finish {
    width: 160px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    border-radius: 17px;
  }
  .cancel {
    color: $theme;
    background-color: $white;
    border: 1px solid $theme;
  }
  .finish {
    color: $white;
    background-color: $theme;
  }
}
</style>

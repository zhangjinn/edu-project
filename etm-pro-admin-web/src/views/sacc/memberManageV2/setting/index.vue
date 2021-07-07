<template>
  <div class="setting">
    <div class="menu">
      <menu-list />
    </div>
    <div class="list">
      <list />
    </div>
  </div>
</template>
<script>
import menu from './menu/index'
import list from './list/index'

export default {
  components: {
    menuList: menu,
    list
  }
}
</script>

<style scoped lang="scss">
.setting {
  height: 100%;
  display: flex;
  @include bgc_bg_color();
  .menu {
    height: 100%;
    width: 210px;
    @include bgc_white();
    border-radius: 2px;
  }
  .list {
    height: 100%;
    width: calc(100% - 226px);
    margin-left: 16px;
    @include bgc_white();
    border-radius: 2px;
  }
}
</style>

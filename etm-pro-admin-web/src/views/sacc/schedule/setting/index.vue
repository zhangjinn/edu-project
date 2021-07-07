<template>
  <div class="setting">
    <etm-layout-split :left-styles="{minWidth:'250px'}">
      <template slot="left">
        <div class="menu">
          <menu-list />
        </div>
      </template>
      <template slot="right">
        <div class="list">
          <list />
        </div>
      </template>
    </etm-layout-split>
  </div>
</template>
<script>
import menu from './menu/index'
import list from './list/index'
export default {
  components: {
    menuList: menu,
    list
  },
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
.setting {
  /*height: 100%;*/
  /*display: flex;*/
  //@include bgc_bg_color();
  /*.menu {*/
    /*height: 100%;*/
    /*width: 210px;*/
    //@include bgc_white();
    /*border-radius: 2px;*/
  /*}*/
  .list {
    margin-bottom: 16px;
    /*height: 100%;*/
    /*width: calc(100% - 226px);*/
    /*margin-left: 16px;*/
    //@include bgc_white();
    /*border-radius: 2px;*/
  }
}
</style>

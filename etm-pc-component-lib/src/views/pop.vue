<template>
  <div class="pop-wrap">
    <el-button @click.stop="popType = 'simple'; showPop = true;">simple类型</el-button>
    <el-button @click.stop="popType = 'complex'; showPop = true;">complex类型</el-button>
    <el-button @click.stop="popType = 'big'; showPop = true;">big类型</el-button>
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="弹窗的标题"
      confirm-btn="确定"
      cancel-btn="取消"
      :show-cancel-btn="false"
      :show-confirm-btn="false"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="showPop = false"
      @cancel="showPop = false"
    >
      这里面插入弹窗的主体内容，或者通过组件的content属性来插入导入的VUE组件
    </etm-pop>

  </div>
</template>

<script>
/**
 * screenTab create by haijinsha
 * createTime 2020/9/21 10:50
 */
export default {
  name: 'Pop',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      showPop: false,
      popType: 'simple'
    }
  },

  methods: {

    change(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss">
  .screenTab-wrap {
    height: 100vh;
    background-color: #fff;
  }
</style>

<template>
  <div class="index-wrap">
    <!--  <etm-app-bar :show="false">排课管理</etm-app-bar>-->
    <etm-main-body bread :bread-data="initData" history-key="courseManage_neuroo" />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import addClass from '@/views/neuroo/edu/courseManage/addClass'
import main from '@/views/neuroo/edu/courseManage/main'
import setting from '@/views/neuroo/edu/courseManage/setting'

/**
 *  2020/4/17 9:26
 *  haijinsha
 */
export default {
  name: 'Index',
  components: { EtmMainBody },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      initData: [
        [
          { name: '排课管理', route: 'courseManage', view: main },
          { name: '添加排课', route: 'addClass', view: addClass }
        ],
        [
          { name: '排课管理', route: 'courseManage', view: main },
          { name: '修改排课', route: 'editClass', view: addClass }
        ],
        [
          { name: '排课管理', route: 'courseManage', view: main },
          { name: '排课设置', route: 'setting', view: setting }
        ]
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    handleSearch(e) {
      const temp = this.formData.map(item => {
        return { [item.prop]: item.value }
      })
      console.log(temp)
    },
    reset() {
      this.formData.forEach(item => {
        item.value = ''
      })
    },
    changeRoute() {
    },
    edit(row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    height: 100%;

    & /deep/ .subBread .mainView.hide {
      /*height: calc(100vh - 188px);*/
    }
  }
</style>

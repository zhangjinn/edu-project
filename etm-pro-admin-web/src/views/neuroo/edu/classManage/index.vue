<template>
  <div class="index-wrap">
    <!--  <etm-app-bar :show="false">班级管理</etm-app-bar>-->
    <etm-main-body bread :bread-data="initData" history-key="classManage_neuroo" />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import addClass from '@/views/neuroo/edu/classManage/addClass'
import main from '@/views/neuroo/edu/classManage/main'

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
          { name: '班级管理', route: 'classManage', view: main },
          { name: '添加班级', route: 'addClass', view: addClass }
        ],
        [
          { name: '班级管理', route: 'classManage', view: main },
          { name: '修改班级', route: 'editClass', view: addClass }
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

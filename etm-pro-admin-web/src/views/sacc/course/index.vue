<template>
  <div class="index-wrap">
    <!--  <etm-app-bar title="课程管理" @click="changeRoute" />-->
    <etm-main-body
      ref="mainBody"
      :bread="true"
      :bread-data="initData"
      history-key="courseManage"
    />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody'
import addCourse from '@/views/sacc/course/addCourse'
import main from '@/views/sacc/course/main'
import setting from '@/views/sacc/course/setting'

/**
   *  2020/4/15 15:22
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
          { name: '课程管理', route: 'course', view: main },
          { name: '添加课程', route: 'addCourse', view: addCourse }
        ],
        [
          { name: '课程管理', route: 'course', view: main },
          { name: '修改课程', route: 'editCourse', view: addCourse }
        ],
        [
          { name: '课程管理', route: 'course', view: main },
          { name: '课程设置', route: 'setting', view: setting }
        ]
      ]
    }
  },
  methods: {
    changeRoute() {
      this.$refs.mainBody.$children[0].handleSwitch('setting')
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    height: 100%;
    & /deep/ .subBread .mainView.hide {
      /*height: calc(100vh - 200px);*/
    }
  }
</style>

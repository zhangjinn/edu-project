<template>
  <div class="det">
    <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
      <!-- <el-tab-pane label="学籍信息" name="status">
        <status :content="statusData" />
      </el-tab-pane> -->
      <el-tab-pane label="消课订单" name="order">
        <order :id="memberId" ref="order" :content="orderData" :name="name" />
      </el-tab-pane>
      <el-tab-pane label="课程表" name="timetable">
        <timetable :id="memberId" ref="timetable" :name="name" />
      </el-tab-pane>
      <el-tab-pane label="请假记录" name="leave">
        <leave :id="memberId" ref="leave" :content="leaveData" />
      </el-tab-pane>
      <el-tab-pane label="考勤记录" name="sign">
        <sign :id="memberId" ref="sign" />
      </el-tab-pane>
    </etm-tabs>
  </div>
</template>

<script>
// import status from './tabs/status'
import order from './tabs/order'
import sign from './tabs/sign'
import leave from './tabs/leave'
import timetable from './tabs/timetable'
export default {
  components: {
    // status,
    order,
    sign,
    leave,
    timetable
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    memberId: {
      type: [Number, String]
    },
    // eslint-disable-next-line vue/require-default-prop
    name: {
      type: String
    }
  },
  data() {
    return {
      activeName: 'order',
      statusData: null,
      orderData: null,
      leaveData: null
    }
  },
  watch: {
    activeName(v) {
      this.$refs[v].refresh()
    }
  }
}
</script>

<style scoped lang="scss">
.det {
  position: relative;
  /*width: calc(100% - 360px);*/
  //@include bgc_white();
  /*& >>> .el-tabs__header.is-top {*/
  /*  line-height: 50px;*/
  /*}*/
  /*& >>> .el-tabs__item {*/
  /*  padding: 0 15px;*/
  /*}*/
}

</style>

<template>
  <div class="index-wrap">
    <!--  <etm-app-bar :show="false" @click="changeRoute">考勤管理</etm-app-bar>-->
    <etm-main-body ref="mainBody" bread :bread-data="initData" history-key="attendanceManage" />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import detail from '@/views/sacc/attendance/components/detail'
import main from '@/views/sacc/attendance/main'
import setting from '@/views/sacc/attendance/components/setting'

/**
   *  2020/4/14 10:54
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
          { name: '考勤管理', route: 'attendance', view: main },
          { name: '考勤详情', route: 'detail', view: detail },
          { name: '考勤设置', route: 'setting', view: setting }
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
    changeRoute() {
      this.$refs.mainBody.$children[0].handleSwitch('setting')
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    font-size: 14px;
    & /deep/ .subBread .mainView.hide {
      /*height: calc(100vh - 184px);*/
    }

    & /deep/ .el-calendar-day {
      /*height: 120px;*/
      height: auto;
      padding: 0;
    }

    .weekEnd {
      /*background-color: red;*/
      /*user-select: none;*/
      /*pointer-events: none;*/
    }

    .no-edit {
      background-color: #fdfcff;
    }

    & /deep/ .el-calendar-table__row {
      td:not(.current) {
        pointer-events: none;
      }

      td.next {
        display: none;
      }

      td.prev {
        .el-calendar-day {
          display: none;
        }
      }
    }

    // 上一个月
    .pre-month {
    }

    // 当前月
    .current-month {
    }

    // 下一个月
    .next-month {

    }

    .box {
      position: relative;
      height: 120px;
      display: flex;
      flex-direction: column;

      .calendar-day {
        font-size: 16px;
        margin-bottom: 8px;
        padding: 8px 0 0 8px;
      }

      .item-box {
        padding: 8px;
        flex: 1;

        & > div {
          line-height: 1.5;
        }

        .btn-edit {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background-color: $main-color;
          color: #fff;
          display: none;
        }
      }
    }

    .active {
      display: block !important;
    }

    .desc {
      padding: 20px;
      color: $secondary-color;

      .chi {
        color: #FF3F2A;
      }

      .yan {
        color: #FBA047;
      }
    }
  }
</style>

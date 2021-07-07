<template>
  <div class="leave">
    <div class="tabBox">
      <div class="textLeft van-hairline--bottom">
        <tabs
          class="tabs"
          :tab-list="tabList"
          :tab-active="tabActive"
          @change="tabChange"
        />
      </div>
    </div>
    <div v-if="leaveList.length" class="container">
      <template v-for="(item, index) in leaveList">
        <leave-card
          :key="index"
          :data="item"
          type="approval"
          @click.native="toDetail(item.askForLeaveId)"
        />
      </template>
    </div>
    <div v-else class="noData">
      <no-content message="没请内容哦~" type="none" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import leaveCard from "./leaveCard";
import noContent from "../../../../components/common/noContent";
import {getLeaveList} from "@/service/daycare/leave";
// import {getLeaveList} from '@/service/daycare/leave'
import tabs from "../../../../components/common/tabs";

export default {
  name: "Index",
  components: {
    tabs,
    leaveCard,
    noContent,
  },
  data() {
    return {
      tabActive: 0,
      tabList: ["待审批", "已审批"],
      tabTypeList: ["UNDER_REVIEW", ["PASS", "REVOKED", "AUDIT_FAILED"]],
      clazzId: null,
      gradeId: null,
      approvalList: [],
      leaveList: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    confirmGrade(val, type) {
      this.gradeId = val.value;
      if (type === "load") return;
      this.clazzId = 0;
      this.getData();
    },
    confirmClazz(val) {
      this.clazzId = val.value;
      this.getData();
    },
    getData() {
      if (this.tabTypeList[this.tabActive] instanceof Array) {
        getLeaveList({status: this.tabTypeList[this.tabActive][0]}).then(res => {
          this.leaveList = res.data.data;
          getLeaveList({status: this.tabTypeList[this.tabActive][1]}).then(res => {
            this.leaveList = this.leaveList.concat(res.data.data)
            getLeaveList({status: this.tabTypeList[this.tabActive][2]}).then(res => {
              this.leaveList = this.leaveList.concat(res.data.data)
            });
          });
        });
      } else {
        getLeaveList({status: this.tabTypeList[this.tabActive]}).then(res => {
          this.leaveList = res.data.data;
        });
      }
    },
    tabChange(index) {
      this.tabActive = index;
      this.getData();
    },
    toDetail(id) {
      this.$router.push({
        path: "/daycare_leaveDetail",
        query: {
          leaveId: id,
        },
      });
    },
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.leave {
  .header {
    height: 46px;

    .topFixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 11;
      padding: 0 12px;
      width: 100%;
      height: 46px;
      background-color: $white;

      .selectBox {
        display: flex;

        .select {
          flex: 1;
        }
      }
    }
  }

  .container {
    padding: 12px;
  }

  .noData {
    padding-top: 100px;
    height: calc(100vh - 96px);
    background-color: $white;
  }

  .tabs {
    background: #fff;

    & /deep/ .tab {
      width: 50%;
      margin-right: 0;
      text-align: center;
    }
  }
}
</style>

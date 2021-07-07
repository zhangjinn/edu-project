<template>
  <div class="leave">
    <div class="header">
      <div class="topFixed van-hairline--bottom">
        <div class="selectBox">
          <div class="select">
            <dropdown
              ref="grade"
              type="grade"
              @open="openGrade"
              @select="confirmGrade"
            />
          </div>
          <div class="select">
            <dropdown
              ref="clazz"
              :grade-id="gradeId"
              type="clazz"
              @open="openClazz"
              @select="confirmClazz"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="leaveList.length" class="container">
      <template v-for="(item, index) in leaveList">
        <leave-card
          :key="index"
          :data="item"
          type="approval"
          @click.native="toDetail(item.leaveRequestId)"
        />
      </template>
    </div>
    <div v-else class="noData">
      <no-content message="没请假内容哦~" type="none" />
    </div>
  </div>
</template>

<script>
import leaveCard from './leaveCard'
import dropdown from '../../components/dropdown'
import noContent from '../../../../components/common/noContent'
import { getLeaveList } from '../../../../service/guardcare/leave'

export default {
  name: 'Index',
  components: {
    leaveCard,
    dropdown,
    noContent
  },
  data() {
    return {
      tabActive: 0,
      tabList: ['待我审批', '请假记录'],
      clazzId: null,
      gradeId: null,
      approvalList: [],
      leaveList: []
    }
  },
  methods: {
    confirmGrade(val, type) {
      this.gradeId = val.value
      if (type === 'load') return
      this.clazzId = 0
      this.getData()
    },
    confirmClazz(val) {
      this.clazzId = val.value
      this.getData()
    },
    getData() {
      const param = {}
      if (this.gradeId) {
        param.gradeId = this.gradeId
      } else {
        param.gradeId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      this.getLeave(param)
    },
    getLeave(data) {
      getLeaveList(data).then(res => {
        this.leaveList = res.data.data
      })
    },
    tabChange(index) {
      this.tabActive = index
    },
    toDetail(id) {
      this.$router.push({
        path: '/guardcare_leaveDetail',
        query: {
          leaveId: id
        }
      })
    },
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.grade.opendropdown(false)
      }
    }
  }

}
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
}
</style>

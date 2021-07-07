<template>
  <div class="leave">
    <div class="header">
      <div class="topFixed van-hairline--bottom">
        <div class="topBox van-hairline--bottom">
          <tabs :tab-list="tabList" :tab-active="tabActive" type="big" @change="tabChange" />
        </div>
        <div class="schoolBox">
          <div class="park">
            <dropdown
              ref="school"
              type="school"
              @open="openSchool"
              @select="confirmSchool"
            />
          </div>
          <div class="park">
            <dropdown
              ref="clazz"
              :school-id="schoolId"
              type="clazz"
              @open="openClazz"
              @select="confirmClazz"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="tabActive === 0">
      <div v-if="approvalList.length" class="container">
        <template v-for="(item, index) in approvalList">
          <leave-card
            :key="index"
            :data="item"
            type="approval"
            @click.native="toDetail(item.leaveRequestId)"
          />
        </template>
      </div>
      <div v-else class="noData">
        <no-content message="审批列表为空~" type="none" />
      </div>
    </div>
    <div v-else>
      <div v-if="leaveList.length" class="container">
        <template v-for="(item, index) in leaveList">
          <leave-card
            :key="index"
            :data="item"
            type="detail"
            @click.native="toDetail(item.leaveRequestId)"
          />
        </template>
      </div>
      <div v-else class="noData">
        <no-content message="请假记录列表为空~" type="none" />
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '../../../../components/common/tabs'
import leaveCard from './leaveCard'
import dropdown from '../../components/dropdown'
import noContent from '../../../../components/common/noContent'
import { getApprovalList, getLeaveList } from '../../../../service/neuroo/leave'

export default {
  name: 'Index',
  components: {
    tabs,
    leaveCard,
    dropdown,
    noContent
  },
  data() {
    return {
      tabActive: 0,
      tabList: ['待我审批', '请假记录'],
      clazzId: null,
      schoolId: null,
      approvalList: [],
      leaveList: []
    }
  },
  methods: {
    confirmSchool(val, type) {
      this.schoolId = val.value
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
      if (this.schoolId) {
        param.schoolId = this.schoolId
      } else {
        param.schoolId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      this.getApproval(param)
      this.getLeave(param)
    },
    getApproval(data) {
      getApprovalList(data).then(res => {
        this.approvalList = res.data.data
      })
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
        path: '/leaveDetail_neuroo',
        query: {
          leaveId: id
        }
      })
    },
    openSchool(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.school.opendropdown(false)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
    .leave {
        .header {
            height: 96px;

            .topFixed {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 11;
                padding: 0 12px;
                width: 100%;
                height: 96px;
                background-color: $white;

                .schoolBox {
                    display: flex;

                    .park {
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
            height: calc(100vh - 146px);
            background-color: $white;
        }
    }
</style>

<template>
  <div class="monitorManageSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
          <el-tab-pane label="员工开放时段" name="EMPLOYEE">
            <items :list="timeList" type="EMPLOYEE" @refresh="refreshList" />
          </el-tab-pane>
          <el-tab-pane label="家长开放时段" name="PARENT">
            <items :list="timeList" type="PARENT" @refresh="refreshList" />
          </el-tab-pane>
          <el-tab-pane label="服务套餐" name="service">
            <plan ref="plan" />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>
import items from './items'
import plan from './plan'
import {
  queryDeviceOpenTimeList
} from '@/api/guardcare/cloudDeviceManage/monitor'
export default {
  components: {
    items,
    plan
  },
  data() {
    return {
      tabsValue: 'EMPLOYEE',
      timeList: []
    }
  },
  watch: {
    tabsValue: {
      handler(v) {
        if (v === 'service') {
          this.$nextTick(() => {
            this.$refs.plan.getListData()
          })
        } else {
          this.refreshList()
        }
      },
      immediate: true
    }
  },
  methods: {
    refreshList() {
      if (this.tabsValue === 'EMPLOYEE' || this.tabsValue === 'PARENT') {
        queryDeviceOpenTimeList({ type: this.tabsValue }).then(res => {
          this.timeList = res.data
        }).catch(err => {
          this.timeList = []
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.monitorManageSetting {
  padding-top: 16px;
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>

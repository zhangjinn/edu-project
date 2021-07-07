<template>
  <div class="staffAuthorize">
    <etm-layout-split>
      <template slot="left">
        <div class="collapse">
          <div class="collapse-title">
            <h3>员工列表</h3>
            <!-- <i class="iconplus iconfont" /> -->
          </div>
          <el-input v-model="keywords" class="search-input" placeholder="请输入搜索内容" @keyup.native.enter="handleSearch">
            <span slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="handleSearch" />
          </el-input>
          <etm-tabs v-if="employeeList.length" v-model="employeeId" :show-toggle="false" tab-position="left">
            <el-tab-pane v-for="(tab, index) in employeeList" :key="index" :label="tab.name + (tab.telephone ? `(${tab.telephone})` : '')" :name="tab.id + ''" />
          </etm-tabs>
          <div v-else class="noTabsList">
            <p>请点击右上角“+”</p>
            <p>添加员工</p>
          </div>
        </div>
      </template>

      <template slot="right">
        <VideoTemplate
          :title="employeeName"
          :video-data="authCamsList"
          @add="openAuthPop"
          @openVideo="openVideoPop"
          @deauthorize="handleDeauthorize"
        />
      </template>
    </etm-layout-split>

    <!-- 查看监控内容的弹窗 -->
    <etm-pop
      :visible="showVideoPop"
      pop="big"
      :title="employeeName"
      confirm-btn="确定"
      cancel-btn="取消"
      class="etmPop"
      @open="showVideoPop = true"
      @close="showVideoPop = false"
      @confirm="showVideoPop = false"
      @cancel="showVideoPop = false"
    >
      <camera-pop ref="camera" type="EMPLOYEE" :cams="authCamsList" />
    </etm-pop>

    <!-- 添加授权的弹窗 -->
    <etm-pop
      :visible="showAuthPop"
      pop="complex"
      title="选择摄像头"
      confirm-btn="选好了"
      cancel-btn="取消"
      @open="showAuthPop = true"
      @close="showAuthPop = false"
      @confirm="handleAuthPopConfirm"
      @cancel="showAuthPop = false"
    >
      <auth-pop ref="auth" :list="authCamsList" />
    </etm-pop>
  </div>
</template>
<script>
import baseMixin from '@/layout/mixin/baseMixin'
import cameraPop from '../components/camera'
import authPop from '../components/authorize'
import VideoTemplate from '../components/videoTemplate'
import {
  queryEmployeeList,
  queryEmployeeAuthCamsList,
  createEmployeeAuthCams,
  cancelEmployeeAuthCam
} from '@/api/guardcare/cloudDeviceManage/monitor.js'
export default {
  components: {
    cameraPop,
    authPop,
    VideoTemplate
  },
  mixins: [baseMixin],
  data() {
    return {
      showVideoPop: false,
      showAuthPop: false,
      employeeList: [],
      rawEmployeeList: [], // 保存第一次请求到的完整的员工列表
      employeeId: undefined,
      employeeName: 'xxx',
      keywords: '',
      authCamsList: []
    }
  },
  watch: {
    employeeId(value) {
      this.getAuthCamsList()
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].id + '' === value) {
          this.employeeName = this.employeeList[i].name + (this.employeeList[i].telephone ? `(${this.employeeList[i].telephone})` : '')
          return
        }
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    getAuthCamsList() {
      queryEmployeeAuthCamsList(this.employeeId).then(res => {
        const data = res.data || []
        data.forEach(v => {
          v.onlineStatus = v.online ? 'UP' : 'DOWN'

          // 员工授权摄像头不受开放时间限制
          v.openStatus = 'OPEN'
          v.open = true
        })
        this.authCamsList = data
      }).catch(err => {
        console.log(err)
      })
    },
    getEmployeeList() {
      queryEmployeeList().then(res => {
        this.employeeList = res.data
        this.rawEmployeeList = res.data

        // 默认选中第一个员工
        if (res.data.length) {
          this.employeeId = res.data[0].id + ''
        }
      }).catch(err => {
        this.employeeList = []
        console.log(err)
      })
    },
    handleSearch() {
      const keywords = this.keywords.trim()
      if (keywords) {
        // 查询员工
        const reg = new RegExp(keywords)
        const queryArr = []
        this.rawEmployeeList.forEach(v => {
          if (reg.test(v.name)) {
            queryArr.push(v)
          }
        })
        this.employeeList = queryArr
      } else {
        // 重置员工列表
        this.employeeList = JSON.parse(JSON.stringify(this.rawEmployeeList)) // 拷贝原员工列表
      }
      this.employeeId = this.employeeList[0].id + ''
    },
    openAuthPop() {
      this.showAuthPop = true
      this.$nextTick(() => {
        this.$refs.auth.getCamsList()
      })
    },
    handleAuthPopConfirm() {
      const deviceIdList = []
      Array.isArray(this.$refs.auth.selection) && this.$refs.auth.selection.forEach(v => {
        deviceIdList.push(v.cameraId)
      })
      createEmployeeAuthCams({ deviceIdList, employeeId: +this.employeeId }).then(res => {
        this.showAuthPop = false
        this.$message.success('操作成功')
        this.getAuthCamsList()
      }).catch(err => {
        this.showAuthPop = false
        this.$message.error('操作失败，请重试')
        console.log(err)
      })
    },
    openVideoPop({ video, index }) { // 打开监控视频弹窗
      this.showVideoPop = true
      this.$nextTick(() => {
        this.$refs.camera.refreshData(index)
      })
    },
    handleDeauthorize(v) { // 取消单个摄像头授权
      this.$etmTip.init({
        type: 'warn',
        title: '取消授权确认',
        content: `取消授权后，该员工将无查看${v.position}云视频权限`,
        confirmBtn: '取消授权',
        cancelBtn: '关闭',
        confirm: () => {
          cancelEmployeeAuthCam({ employeeId: this.employeeId, deviceId: v.cameraId }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.getAuthCamsList()
          }).catch(err => {
            this.$message.error('操作失败，请重试')
            this.$etmTip.close()
            console.log(err)
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style scoped lang="scss">
.staffAuthorize {
  margin-top: 16px;
  height: calc(100vh - 128px);
  & > .EtmLayoutSplit-wrap {
    height: 100%;
  }
}
.collapse {
  & > .EtmTabs-wrap {
    height: calc(100vh - 256px);
    overflow-y: auto;
  }
  // ::v-deep .el-tabs {
  //   height: calc(100vh - 240px);
  // }
  .collapse-title{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .search-input{
    margin-bottom: 16px;
  }

  /deep/ .el-collapse {
    border-top: none;

    .el-collapse-item__header {
      border-bottom: 1px solid #ebeef5;
    }

    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }

  /deep/ .el-tabs__header {
    width: 100%;
  }

  /deep/ .el-tabs__nav-wrap:after{
    height: 0 !important;
  }

  .noTabsList{
    color: #9A9A9A;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.etmPop {
  ::v-deep .el-dialog__body {
    margin-top: 0;
  }
}
</style>

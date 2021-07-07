<template>
  <etm-main-body>
    <etm-layout-split>
      <template slot="left">
        <div class="collapse">
          <div class="collapse-title">
            <h3>班级列表</h3>
            <!-- <i class="iconplus iconfont" @click.stop="addClazz" /> -->
          </div>
          <el-input v-model="keywords" class="search-input" placeholder="请输入搜索内容" @blur="handleSearch">
            <span slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="handleSearch" />
          </el-input>
          <etm-tabs v-if="tabsList.length" v-model="tabsValue" :show-toggle="false" tab-position="left">
            <el-tab-pane v-for="(tab, index) in tabsList" :key="index" :label="tab.caeClazzName" :name="String(tab.caeClazzId)" />
          </etm-tabs>
          <div v-else class="noTabsList">
            <!--<p>请点击右上角“ + ”</p>-->
            <!--<p>添加教室</p>-->
            <p>还没有班级哦，去添加班级吧</p>
          </div>
        </div>
      </template>

      <template slot="right">
        <VideoTemplate
          :video-data="cameraList"
          :title="popTitle"
          @add="popVisibleAdd = true"
          @deauthorize="handleDeauthorize"
          @openVideo="handleOpenVideo"
        />
      </template>
    </etm-layout-split>

    <!--弹框-->
    <etm-pop
      v-if="popVisible"
      :title="popTitle"
      :visible="popVisible"
      cancel-btn="取消"
      confirm-btn="确定"
      pop="big"
      @cancel="handleClose"
      @close="handleClose"
      @confirm="handleClose"
    >
      <div class="popContent">
        <cameraPop :id="tabsValue" ref="popCamera" :type="type" :camera-list="cameraList" :active-index="activeIndex" />
      </div>
    </etm-pop>

    <!--授权弹框-->
    <etm-pop
      v-if="popVisibleAdd"
      title="选择摄像头"
      :visible="popVisibleAdd"
      cancel-btn="取消"
      confirm-btn="确定"
      pop="complex"
      @cancel="popVisibleAdd = false"
      @close="popVisibleAdd = false"
      @confirm="popConfirmAdd"
    >
      <div class="popContent">
        <tableTemplate ref="popTable" />
      </div>
    </etm-pop>

    <!-- 新增班级弹窗 -->
    <etm-pop
      :visible="showPop"
      pop="complex"
      title="添加教室"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="showPop = false"
      @cancel="showPop = false"
    >
      <addClazz />
    </etm-pop>
  </etm-main-body>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import etmMainBody from '@/layout/main/EtmMainBody'
import VideoTemplate from './components/videoTemplate'
import { queryClasses } from '@/api/newDaycare/classes'
import {
  queryCameraAuthorizationList,
  removeCameraAuthorization,
  updateCameraAuthorization
} from '@/api/newDaycare/monitorEquipment'
import cameraPop from './components/camera'
import tableTemplate from './components/tableTemplate'
import addClazz from './components/addClazz'

export default {
  name: 'ClassroomAuthorize',
  components: {
    etmMainBody,
    VideoTemplate,
    cameraPop,
    tableTemplate,
    addClazz
  },
  mixins: [baseMixin],
  data() {
    return {
      tabsList: [],
      tabsValue: '',
      keywords: '',
      cameraList: [],
      popVisible: false,
      popVisibleAdd: false,
      showPop: false,
      popTitle: '',
      type: 'CLAZZ',
      activeIndex: 0
    }
  },
  watch: {
    tabsValue(v) {
      if (v) {
        this.handleQueryCameraList(v)
        const item = this.tabsList.find(j => String(j.caeClazzId) === v) || {}
        this.popTitle = item.caeClazzName
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 搜索
    handleSearch() {
      this.init()
    },

    init() {
      queryClasses({}).then(res => {
        this.tabsList = res.data
        this.tabsValue = String(this.tabsList[0].caeClazzId)
      })
    },

    handleQueryCameraList(id) {
      queryCameraAuthorizationList({ type: this.type, grantId: id }).then(res => {
        // console.log('摄像头授权列表', res.data)
        this.cameraList = res.data
      })
    },

    handleDelete(item) {
      // console.log('删除', item)
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {

        }
      })
      this.$etmTip.open()
    },

    // // 弹窗关闭
    // popClose() {
    //   this.popVisible = false
    // },

    // // 弹窗确定
    // popConfirmEdit() {
    //
    // },

    // 弹窗确定
    popConfirmAdd(v) {
      const target = this.$refs.popTable.selectObject
      const cameraIdList = target.map(v => v.cameraId)
      updateCameraAuthorization({
        cameraIdList: cameraIdList,
        type: this.type,
        grantId: this.tabsValue
      }).then(res => {
        this.$message.success('授权成功')
        queryCameraAuthorizationList({ type: this.type, grantId: this.tabsValue }).then(res => {
          this.cameraList = res.data
        })
      })
      this.popVisibleAdd = false
    },
    handleOpenVideo(v, index) {
      // console.log('handleOpenVideo', index)
      // const index = args[1]
      this.activeIndex = index
      this.popVisible = true
    },
    handleDeauthorize(v) {
      // console.log('handleDeauthorize', v)
      removeCameraAuthorization(v.cameraAuthorizationId).then(() => {
        this.$message.success('取消授权成功')
        this.handleQueryCameraList(this.tabsValue)
        // this.init()
      })
    },
    handleClose() {
      this.$refs.popCamera.video = {}
      this.popVisible = false
    },
    addClazz() {
      this.showPop = true
    }
  }
}
</script>

<style lang="scss" scoped>
.etm-main-body{
  /deep/.content{
    height: 100%;
  }
  .EtmLayoutSplit-wrap{
    height: 100%;
  }
}
.collapse {

  .collapse-title{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 24px;
    i {
      cursor: pointer;
    }
  }

  .search-input{
    margin-bottom: 16px;
  }

  .iconplus{
    color:#9A9A9A;
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

</style>

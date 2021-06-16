<template>
  <div class="clazzAuthorize">
    <etm-layout-split>
      <template slot="left">
        <div class="collapse">
          <div class="collapse-title">
            <h3>班级列表</h3>
            <!-- <i class="iconplus iconfont" /> -->
          </div>
          <el-input
            v-model="keywords"
            class="search-input"
            placeholder="请输入搜索内容"
            @keyup.native.enter="handleSearch"
          >
            <span
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer;"
              @click="handleSearch"
            />
          </el-input>
          <el-collapse
            v-if="clazzTree.length"
            ref="clazzTree"
            v-model="activeGradeId"
            accordion
          >
            <el-collapse-item
              v-for="(g, gindex) in clazzTree"
              :key="gindex"
              :title="g.gradeName"
              :name="g.gradeId"
            >
              <div
                v-for="(c, cindex) in g.clazzList"
                :id="'clazz' + c.clazzId"
                :key="cindex"
                class="clazzItem"
                @click.stop="e => selectClazz(e, c)"
              >
                {{ c.clazzName }}
              </div>
            </el-collapse-item>
          </el-collapse>
          <div
            v-else
            class="noTabsList"
          >
            <p>请点击右上角“+”</p>
            <p>添加班级</p>
          </div>
        </div>
      </template>

      <template slot="right">
        <VideoTemplate
          :title="selectClazzObj.clazzName"
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
      :title="selectClazzObj.clazzName"
      confirm-btn="确定"
      cancel-btn="取消"
      class="etmPop"
      @open="showVideoPop = true"
      @close="showVideoPop = false"
      @confirm="showVideoPop = false"
      @cancel="showVideoPop = false"
    >
      <camera-pop
        ref="camera"
        type="PARENT"
        :cams="authCamsList"
      />
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
      <auth-pop
        ref="auth"
        :list="authCamsList"
      />
    </etm-pop>
  </div>
</template>
<script>
import baseMixin from '@/layout/mixin/baseMixin'
import cameraPop from './components/camera-child'
import authPop from './components/authorize'
import VideoTemplate from './components/videoTemplate-child'
import {
  getGrade,
  getClazz,
  queryClazzAuthCamsList,
  createClazzAuthCams,
  cancelClazzAuthCam
} from '@/api/newDaycare/monitorEquipment.js'
export default {
  components: {
    cameraPop,
    authPop,
    VideoTemplate
  },
  mixins: [baseMixin],
  data () {
    return {
      showVideoPop: false,
      showAuthPop: false,
      keywords: '',
      activeGradeId: 0,
      clazzTree: [],
      selectClazzObj: {},
      authCamsList: []
    }
  },
  watch: {
    activeGradeId (gradeId) { // 展开某年级下的班级列表
      this.showClazzList(gradeId)
    },
    selectClazzObj: {
      handler (value) {
        this.getAuthCamsList()
      }
    }
  },
  created () {
    this.getGradeList()
  },
  methods: {
    getAuthCamsList () {
      if (this.selectClazzObj.clazzId) {
        queryClazzAuthCamsList(this.selectClazzObj.clazzId).then(res => {
          const data = res.data || []
          data.forEach(v => {
            v.onlineStatus = v.online ? 'UP' : 'DOWN'

            // 班级授权摄像头不受开放时间限制
            v.openStatus = 'OPEN'
            v.open = true
          })
          this.authCamsList = data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getGradeList () {
      getGrade({ paged: false }).then(res => {
        if (res.data.length) {
          res.data.forEach(v => {
            this.clazzTree.push({
              gradeName: v.name,
              gradeId: v.id,
              clazzList: []
            })
          })
          this.activeGradeId = res.data[0].id // 默认展开第一个年级的班级列表
        }
      }).catch(err => {
        this.clazzTree = []
        console.log(err)
      })
    },
    showClazzList (gradeId) { // 动态懒加载某个年级下的班级列表
      for (let i = 0; i < this.clazzTree.length; i++) {
        if (this.clazzTree[i].gradeId === gradeId) {
          if (this.clazzTree[i].clazzList._request) {
            // 已经请求过
            this.selectClazzObj = this.clazzTree[i].clazzList[0]
            Array.prototype.forEach.call(this.$refs.clazzTree.$el.querySelectorAll('.clazzItem'), v => {
              v.className = 'clazzItem'
            })
            this.$nextTick(() => {
              this.$refs.clazzTree.$el.querySelector(`#clazz${this.clazzTree[i].clazzList[0].clazzId}`).className = 'clazzItem active'
            })
          } else {
            // 还未请求
            getClazz({ gradeId, paged: false }).then(res => {
              res.data.length && res.data.forEach(v => {
                this.clazzTree[i].clazzList.push({
                  clazzName: v.name,
                  clazzId: v.id
                })
              })
              this.clazzTree[i].clazzList._request = true // 标识这个班级列表已经请求过了，下次不再请求
              this.selectClazzObj = this.clazzTree[i].clazzList[0]
              Array.prototype.forEach.call(this.$refs.clazzTree.$el.querySelectorAll('.clazzItem'), v => {
                v.className = 'clazzItem'
              })
              this.$nextTick(() => {
                this.$refs.clazzTree.$el.querySelector(`#clazz${this.clazzTree[i].clazzList[0].clazzId}`).className = 'clazzItem active'
              })
            }).catch(err => {
              console.log(err)
            })
          }
          return
        }
      }
    },
    selectClazz (e, c) {
      Array.prototype.forEach.call(this.$refs.clazzTree.$el.querySelectorAll('.clazzItem'), v => {
        v.className = 'clazzItem'
      })
      e.target.className = 'clazzItem active'
      this.selectClazzObj = c
    },
    handleSearch () {
      this.$message.warning('业务开发中')
    },
    openAuthPop () {
      this.showAuthPop = true
      this.$nextTick(() => {
        this.$refs.auth.getCamsList()
      })
    },
    openVideoPop ({ video, index }) { // 打开监控视频弹窗
      this.showVideoPop = true
      this.$nextTick(() => {
        this.$refs.camera.refreshData(index)
      })
    },
    handleDeauthorize (v) { // 取消单个摄像头授权
      this.$etmTip.init({
        type: 'warn',
        title: '取消授权确认',
        content: `取消授权后，该班级家长将无查看${v.position}云视频权限`,
        confirmBtn: '取消授权',
        cancelBtn: '关闭',
        confirm: () => {
          cancelClazzAuthCam({ clazzId: this.selectClazzObj.clazzId, deviceId: v.cameraId }).then(res => {
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
    },
    handleAuthPopConfirm () {
      const deviceIdList = []
      Array.isArray(this.$refs.auth.selection) && this.$refs.auth.selection.forEach(v => {
        deviceIdList.push(v.cameraId)
      })
      createClazzAuthCams({ deviceIdList, clazzId: this.selectClazzObj.clazzId }).then(res => {
        this.showAuthPop = false
        this.$message.success('操作成功')
        this.getAuthCamsList()
      }).catch(err => {
        this.showAuthPop = false
        this.$message.error('操作失败，请重试')
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.clazzAuthorize {
  height: calc(100vh - 128px);
  margin-top: 16px;

  > .EtmLayoutSplit-wrap {
    height: 100%;
  }
}

.collapse {
  .el-collapse {
    height: calc(100vh - 256px);
    overflow-y: auto;
    width: 194px;

    ::v-deep .el-collapse-item__content {
      padding-bottom: 0;
    }

    ::v-deep .el-collapse-item__header {
      @include c_text_color();
    }

    .clazzItem {
      @include c_text_color();
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      text-indent: 16px;

      &.active {
        @include etm-bgc-rgba(0.1);
        @include etm-color();
      }
    }
  }

  .collapse-title {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .search-input {
    margin-bottom: 16px;
  }

  ::v-deep .el-tabs__header {
    width: 100%;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    height: 0 !important;
  }

  .noTabsList {
    align-items: center;
    color: #9a9a9a;
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }
}

.etmPop {
  ::v-deep .el-dialog__body {
    margin-top: 0;
  }
}
</style>

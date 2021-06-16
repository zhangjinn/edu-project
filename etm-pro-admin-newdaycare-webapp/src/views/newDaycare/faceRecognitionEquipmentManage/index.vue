<template>
  <div class="index-wrap">
    <etm-layout-split class="layout">
      <div slot="header">
        <etm-tabs
          v-model="activeName"
          class="tab-pane"
        >
          <el-tab-pane
            name="teach"
            label="人脸识别管理"
          >
            <etm-screen-tab
              v-model="distanceType"
              :options="deviceStatusList"
              style="width: 500px;"
              @change="deviceStatusChange"
            />
            <div
              class="file-search-box"
              style="width: 314px;"
            >
              <el-input
                v-model="keywords"
                placeholder="搜索您的设备"
                @input="search"
              />
              <i
                class="iconfont iconsousuo"
                @click="handleSearch"
              />
            </div>
          </el-tab-pane>
        </etm-tabs>

        <div class="system-store">
          <div
            v-for="item in deviceList"
            :key="item.deviceKey"
            class="system-cotent"
          >
            <div
              class="devices"
              @click="getDeviceDetail(item.deviceKey)"
            >
              <div class="image">
                <img
                  v-if="item.model === 'M355C1' "
                  src="@/assets/images/system1.png"
                >
                <img
                  v-if="item.model === 'M35DM1' "
                  src="@/assets/images/system2.png"
                >
                <i
                  class="iconfont iconjietong"
                  :class="{'online':item.online}"
                />
              </div>
              <div class="intro">
                <span class="name">{{ item.deviceName }}</span>
                <span class="desc">{{ item.deviceKey }}</span>
                <el-tag
                  v-if="item.temperatureDetection === 0"
                  class="tag"
                >
                  测体温
                </el-tag>
              </div>
            </div>
          </div>

          <div
            class="add-device"
            @click="showAddPopup"
          >
            <i class="iconfont icontianjiashebei" />
            <span>添加设备</span>
          </div>
        </div>
      </div>
    </etm-layout-split>

    <etm-pop
      title="添加设备"
      pop="complex"
      :visible="isShowAddPopup"
      cancel-btn="取消"
      @cancel="cancelAddPopup"
      @close="cancelAddPopup"
      @confirm="confirmAddPopup"
    >
      <add-device
        v-if="isShowAddPopup"
        ref="add"
        :add-form="addFormData"
      />
    </etm-pop>

    <etm-drawer
      :visible.sync="isShowDetailPopup"
    >
      <etm-layout-split line>
        <etm-title
          :title="drawerTitle"
          border
          size="big"
        >
          <template
            v-if="isShowDetailPopup && drawerType === 'edit'"
            slot="tool"
          >
            <el-button
              size="mini"
              plain
              @click="cancelEdit"
            >
              取消
            </el-button>
            <el-button
              size="mini"
              plain
              @click="saveEdit"
            >
              保存
            </el-button>
          </template>
          <template
            v-if="isShowDetailPopup && drawerType === 'detail'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="removeDevice(currentDeviceKey)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              plain
              @click="showEditDrawer"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail
            v-if="isShowDetailPopup && drawerType === 'detail'"
            :detail-device-info="detailDeviceInfo"
          />
          <edit
            v-if="isShowDetailPopup && drawerType === 'edit'"
            ref="edit"
            :edit-form="editDeviceInfo"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>

// import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import detail from './components/detail.vue'
import addDevice from './components/addDevice'
import edit from './components/edit'
import { createDevice, queryDeviceDetail, queryDeviceList, updateDevice, removeDevice } from '@/api/newDaycare/deviceManage'
export default {
  name: 'TeachContract',
  components: {
    // EtmPop,
    addDevice,
    detail,
    edit
  },
  data () {
    return {
      activeName: 'teach',
      distanceType: undefined,
      deviceList: [],
      cacheDeviceList: [],
      keyWord: undefined,
      addFormData: {
        brand: undefined,
        deviceKey: undefined,
        deviceName: undefined,
        model: 'M355C1',
        temperatureDetection: 0,
        position: undefined
      },
      currentDeviceKey: undefined,
      detailDeviceInfo: {},
      editDeviceInfo: {},
      deviceStatusList: [
        {
          name: '所有设备',
          value: undefined
        }, {
          name: '已开启',
          value: true
        }, {
          name: '已关闭',
          value: false
        }
      ],
      keywords: undefined,
      isShowAddPopup: false,
      isShowDetailPopup: false,
      drawerTitle: undefined,
      drawerType: undefined,
      name: undefined,
      position: undefined,
      deviceStatus: undefined
    }
  },
  computed: {
    allDeviceLen () {
      return this.cacheDeviceList.length
    },
    openDeviceLen () {
      return this.cacheDeviceList.filter(device => device.online).length
    },
    closeDeviceLen () {
      return this.cacheDeviceList.filter(device => !device.online).length
    }
  },
  watch: {},
  created () {
    this.init()
    this.cacheDevice()
  },
  mounted () {
  },
  methods: {
    cacheDevice () {
      queryDeviceList({}).then(res => {
        this.cacheDeviceList = res.data
        this.deviceStatusList[0].name = `所有设备 ${this.allDeviceLen}`
        this.deviceStatusList[1].name = `已开启 ${this.openDeviceLen}`
        this.deviceStatusList[2].name = `已关闭 ${this.closeDeviceLen}`
      })
    },
    init (isSearch) {
      const params = {}
      params.name = this.name
      params.position = this.position
      params.state = this.deviceStatus
      queryDeviceList(params).then(res => {
        console.log(res, '我是设备')
        this.deviceList = res.data
        if (isSearch) {
          this.deviceStatusList[0].name = `所有设备 ${this.deviceList.length}`
          this.deviceStatusList[1].name = `已开启 ${this.deviceList.filter(device => device.online).length}`
          this.deviceStatusList[2].name = `已关闭 ${this.deviceList.filter(device => !device.online).length}`
        }
      })
    },
    deviceStatusChange (e) {
      console.log(e, 'e')
      this.deviceStatus = e
      this.init()
    },
    showAddPopup () {
      this.isShowAddPopup = true
    },
    cancelAddPopup () {
      this.addFormData = {
        brand: undefined,
        deviceKey: undefined,
        deviceName: undefined,
        model: 'M355C1',
        temperatureDetection: 0,
        position: undefined
      }
      this.isShowAddPopup = false
    },
    handleSearch () {
      if (!this.name) {
        this.deviceStatus = undefined
      }
      this.init(true)
    },
    async confirmAddPopup () {
      // console.log(this.$options)
      this.$refs.add.$children[0].$children[0].validate(async v => {
        if (v) {
          this.addFormData = this.$refs.add.addForm
          console.log(this.addFormData, 'form')
          await createDevice(this.addFormData).then(res => {
            console.log(res, '添加')
            if (res.code === 0) {
              this.$message.success('添加成功')
            } else {
              this.$message.error(res.msg)
            }
          })
          this.isShowAddPopup = false
          this.addFormData = {
            brand: undefined,
            deviceKey: undefined,
            deviceName: undefined,
            model: 'M355C1',
            temperatureDetection: 0,
            position: undefined
          }
          this.init()
          this.cacheDevice()
        }
      })
    },
    // 获取设备详情
    getDeviceDetail (deviceKey) {
      this.isShowDetailPopup = true
      this.drawerTitle = '设备详情'
      this.drawerType = 'detail'
      this.currentDeviceKey = deviceKey
      const params = {}
      params.deviceKey = deviceKey
      queryDeviceDetail(params).then(res => {
        console.log(res, '我是详情')
        this.detailDeviceInfo = res.data
      })
    },

    // 显示编辑抽屉
    showEditDrawer () {
      this.drawerTitle = '设备编辑'
      this.drawerType = 'edit'
      this.editDeviceInfo = this.detailDeviceInfo
    },
    async saveEdit () {
      this.$refs.edit.$children[1].$children[0].validate(async valid => {
        if (valid) {
          this.editDeviceInfo = this.$refs.edit.editForm
          console.log(this.editDeviceInfo, 'info')
          await updateDevice(this.editDeviceInfo).then(res => {
            console.log(res, '更新設備信息')
            if (res.code === 0) {
              this.$message.success('更新成功')
            } else {
              this.$message.error(res.msg)
            }
          })
          this.isShowDetailPopup = false
          // this.drawerType = 'detail'
          // this.drawerTitle = '设备详情'
          this.init()
        }
      })
    },
    cancelEdit () {
      this.drawerType = 'detail'
      this.drawerTitle = '设备详情'
    },

    // 删除设备
    removeDevice (currentDeviceKey) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该设备？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: async () => {
          const params = {}
          params.deviceKey = currentDeviceKey
          await removeDevice(params).then((res) => {
            this.$etmTip.close()
            if (res.code === 0) {
              this.$message.success('删除成功')
            } else {
              this.$message.error(res.msg)
            }
            this.init()
            this.cacheDevice()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
      this.isShowDetailPopup = false
    },

    search (keyWord) {
      console.log(keyWord)
      this.name = keyWord
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    height: 96vh;
    margin-top: 16px;

    .layout {
      height: 100%;

      ::v-deep .layout-header {
        height: 90%;
      }
    }
  }

  .tab-pane {
    ::v-deep .el-tab-pane {
      display: flex;
      justify-content: space-between;
    }
  }

  /*搜索框样式*/
  .file-search-box {
    height: 34px;
    overflow: hidden;
    position: relative;
    width: 314px;

    ::v-deep {
      .el-input {
        background: transparent;
        height: 100%;
        width: 100%;

        input {
          background: #fff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          display: block;
          height: 100%;
          line-height: 32px;
          padding: 0 16px;
          width: 100%;

          &:hover {
            @include etm-bdc;
          }
        }
      }
    }

    i {
      color: #697277;
      font-size: 14px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translate(0, -50%);

      &:hover {
        @include etm-color;
      }
    }
  }

  /*每个设备的样式*/
  .devices {
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: flex;
    height: 138px;
    margin-right: 26px;
    width: 312px;

    .image {
      margin-left: 17px;
      position: relative;
    }

    .iconjietong {
      position: absolute;
      right: 10px;
    }

    .online {
      @include etm-color; }

    .intro {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      height: 100%;
      justify-content: center;
      margin-left: 16px;

      .name {
        @include c_text_color; }

      .desc {
        color: #999;
        margin-bottom: 7px;
      }

      .tag {
        @include etm-color
      ;
        height: 22px;
        margin-top: 10px;
        padding-left: 5px;
        width: 48px;}
    }

    &:hover {
      @include etm-bdc;
      cursor: pointer;
    }
  }

  /*添加设备的btn*/
  .add-device {
    align-items: center;
    background: #f6f6f6;
    border: 1px dashed #ddd;
    border-radius: 4px;
    color: #999;
    display: flex;
    flex-direction: column;
    height: 138px;
    justify-content: center;
    width: 312px;

    span {
      font-size: 14px;
      font-weight: 400;
      /*color: #999999;*/
    }

    &:hover {
      @include etm-bdc;
      @include etm-color
    ;
      cursor: pointer;}

    .icontianjiashebei {
      /*color:#bbb;*/
      background-size: cover;
      bottom: 16px;
      font-size: 68px;
      height: 68px;
      position: relative;
      width: 60px;
    }

  }
  /*渲染列表页样式*/
  .system-store {
    display: flex;
    margin-top: 20px;
  }
</style>

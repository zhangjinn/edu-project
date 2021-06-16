<template>
  <div class="content-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activeName"
            @tab-click="handleReset"
          >
            <!--            <etm-tabs v-model="activeName" setting-text="会员有效期" setting @tab-click="handleReset" @setting="handleViewValidity">-->
            <template #tool>
              <span>会员有效期： {{ expireTime }}</span>
            </template>
            <el-tab-pane
              label="H5"
              name="h5"
            >
              <etm-tool-bar
                v-show="true"
                v-model="formData"
                @reset="handleReset"
                @search="handleSearch"
              />
            </el-tab-pane>
            <el-tab-pane
              label="海报"
              name="h2"
            >
              <etm-tool-bar
                v-show="true"
                v-model="formData"
                @reset="handleReset"
                @search="handleSearch"
              />
            </el-tab-pane>
            <!--            <el-tab-pane label="长页" name="lsc">-->
            <!--              <etm-tool-bar v-show="true" v-model="formData" @reset="handleReset" @search="handleSearch" />-->
            <!--            </el-tab-pane>-->
            <!--            <el-tab-pane label="表单" name="h5e">-->
            <!--              <etm-tool-bar v-show="true" v-model="formData" @reset="handleReset" @search="handleSearch" />-->
            <!--            </el-tab-pane>-->
            <el-tab-pane
              label="互动"
              name="hd"
            >
              <etm-tool-bar
                v-show="true"
                v-model="formData"
                @reset="handleReset"
                @search="handleSearch"
              />
            </el-tab-pane>
            <!--            <el-tab-pane label="视频" name="video">-->
            <!--              <etm-tool-bar v-show="true" v-model="formData" @reset="handleReset" @search="handleSearch" />-->
            <!--            </el-tab-pane>-->
          </etm-tabs>
        </div>
        <div slot="body">
          <CardTemplate
            v-model="pageInfo"
            @change="init"
          >
            <template #after>
              <div
                v-for="(item, index) in cardData"
                :key="index"
                class="flex-item"
              >
                <CardItem
                  :type="activeName"
                  :item="item"
                  class="card"
                  @preview="handleCardPreview"
                  @share="handleCardPreview"
                  @edit="handleEdit"
                  @dowload="handleCardPreview"
                  @manage="handleGotoH2Manage"
                  @analysis="handleGotoH5DataAnalysis"
                  @deauthorize="handleDelete"
                />
              </div>
              <!--                            <CardItem-->
              <!--                              v-for="(item, index) in cardData"-->
              <!--                              :key="index"-->
              <!--                              :type="activeName"-->
              <!--                              :item="item"-->
              <!--                              class="card"-->
              <!--                              @preview="handleCardPreview"-->
              <!--                              @share="handleCardPreview"-->
              <!--                              @edit="handleEdit"-->
              <!--                              @dowload="handleCardPreview"-->
              <!--                              @manage="$message.info('在玩命开发中，敬请期待！')"-->
              <!--                              @analysis="$message.info('在玩命开发中，敬请期待！')"-->
              <!--                              @deauthorize="handleDelete"-->
              <!--                            />-->
            </template>
            <template #btn>
              <div class="flex-item">
                <div class="card btns">
                  <el-button
                    class="card-btn store-btn"
                    @click.stop="handleOpenStore"
                  >
                    <div><i class="iconadd iconfont" /></div>
                    <div class="store-btn-title">
                      模版创建
                    </div>
                    <div class="store-btn-des">
                      海量精美模板，快速创建
                    </div>
                  </el-button>
                </div>
              </div>
              <!--                            <div class="card btns">-->
              <!--                              <el-button class="card-btn store-btn" @click.stop="handleOpenStore">-->
              <!--                                <div><i class="iconadd iconfont" /></div>-->
              <!--                                <div class="store-btn-title">模版创建</div>-->
              <!--                                <div class="store-btn-des">海量精美模板，快速创建</div>-->
              <!--                              </el-button>-->
              <!--                            </div>-->
            </template>
          </CardTemplate>
        </div>
      </etm-layout-split>
    </etm-main-body>

    <el-dialog
      class="iframe-dialog"
      :visible="popVisible"
      :lock-scroll="true"
      width="90%"
      top="2vh"
      :center="true"
      :modal-append-to-body="false"
      @close="handleDialogClose"
    >
      <iframe
        id="eqxIframe"
        ref="iframe"
        class="eqx-iframe"
        frameborder="0"
        scorlling="auto"
        :src="iframeSrc"
      />
    </el-dialog>
    <etm-pop
      v-if="popExpireTimeVisible"
      title="会员有效期"
      :visible="popExpireTimeVisible"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      pop="simple"
      @close="popExpireTimeVisible = false"
    >
      <div class="pop-content">
        <etm-field-label
          label="有效期"
          type="left"
        >
          {{ expireTime }}
        </etm-field-label>
      </div>
    </etm-pop>
  </div>
</template>

<script>
/**
 * EnrollMiniSite create by shangLu
 * createTime 2020/11/20 13:44
 */
import CardTemplate from './components/cardTemplate'
import CardItem from '@/views/newDaycare/enrollMinisite/components/cardItem'
import {
  queryEqxEdit,
  queryEqxH2ResourceDownload,
  queryEqxResourceList,
  queryEqxResourcePreview,
  queryEqxStore,
  removeEqxResource
} from '@/api/newDaycare/eqx'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'EnrollMiniSiteContent',
  components: {
    CardTemplate,
    CardItem
  },
  mixins: [baseMixin],
  props: {
    expireTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeName: 'h5',
      tabs: {
        h5: 'H5',
        h2: '海报',
        h5e: '表单',
        hd: '互动',
        video: '视频',
        lsc: '长页'
      },
      popVisible: false,
      popExpireTimeVisible: false,
      popCardPreviewVisible: false,
      formData: [{
        label: '活动名称',
        type: 'input',
        prop: 'name',
        value: null,
        props: {
          placeholder: '请输入活动名称'
        }
      }],
      cardData: [],
      pageInfo: {
        count: 1,
        pageSize: 10,
        pageNo: 1
      },
      iframeSrc: '',
      previewIframeSrc: ''
      // loading: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const name = this.getValueByProp('name', this.formData)
      queryEqxResourceList({ editType: this.activeName, name, ...this.pageInfo }).then(res => {
        if (this.activeName === 'hd') {
          this.cardData = res.data.content.reverse()
        } else {
          this.cardData = res.data.content
        }
        this.pageInfo = res.data.page
      })
    },
    handleSearch () {
      this.pageInfo.pageNo = 1
      this.init()
    },
    handleReset () {
      this.formData[0].value = null
      this.pageInfo.pageNo = 1
      this.pageInfo.pageSize = 10
      this.init()
    },
    handleEdit (e) {
      queryEqxEdit({ resourceId: e.id, editType: this.activeName }).then(res => {
        this.iframeSrc = res.data
        this.$nextTick(() => {
          this.popVisible = true
        })
      })
    },
    handleDelete (e) {
      removeEqxResource({ resourceId: e.id }).then(res => {
        this.$message.success('删除成功')
        this.init()
      })
    },
    handleOpenStore () {
      queryEqxStore({ editType: this.activeName }).then(res => {
        this.popVisible = true
        this.iframeSrc = res.data
      })
    },
    handleCardPreview (e) {
      if (this.activeName === 'h2') {
        queryEqxH2ResourceDownload({ resourceId: e.id, code: e.code }).then(res => {
          this.popVisible = true
          this.iframeSrc = res.data
        })
      } else {
        queryEqxResourcePreview({ resourceId: e.id, editType: this.activeName }).then(res => {
          // this.previewIframeSrc = res.data
          this.popVisible = true
          this.iframeSrc = res.data
        })
      }
    },
    handleDialogClose () {
      this.popVisible = false
      this.iframeSrc = ''
      this.handleSearch()
    },
    handleViewValidity () {
      this.popExpireTimeVisible = true
    },
    handleGotoH5DataAnalysis (item) {
      if (item.status === 0) {
        this.$message.info('发布后才能看到数据哦')
        return
      }
      this.$router.push({
        path: '/newdaycare_enrollMiniSiteManagement_h5Data',
        query: {
          id: item.id,
          editType: this.activeName
        }
      })
    },
    handleGotoH2Manage (item) {
      if (item.status === 0) {
        this.$message.info('发布后才能看到数据哦')
        return
      }
      this.$router.push({
        path: '/newdaycare_enrollMiniSiteManagement_h2Manage',
        query: {
          editType: this.activeName,
          id: item.id,
          activeName: '活动管理'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content-wrap {
  .flex-item {
    align-items: center;
    display: flex;
    flex: 0 0 20%;
    justify-content: center;
  }

  .card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 6px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 324px;
    //margin-right: 94px;
    margin-bottom: 39px;
    overflow: hidden;
    transition: all 0.2s linear;
    width: 224px;

    &:hover {
      //box-shadow: 0 4px 12px 0 rgba(0,0,0,.08);
      box-shadow: 0 8px 20px 0 rgba(85, 85, 85, 0.1);
      transform: translate3d(0, -4px, 0);
    }
  }

  //& .card:nth-child(4n + 4){
  //  margin-right: 0;
  //}

  .btns {
    flex-direction: column;
    padding: 17px;
  }

  .card-btn {
    align-items: center;
    background-color: #f9f9f9;
    color: #bcbcbc;
    //border-style: dashed;
    display: flex;
    height: 100%;
    justify-content: center;
    margin: 0;
    // margin-left: 56px;
    width: 100%;

    div {
      margin-bottom: 16px;
    }

    .iconadd {
      @include etm-color;
      font-size: 40px;
      height: auto;
      width: auto;
    }

    .store-btn-title {
      color: #222;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 8px;
    }

    .store-btn-des {
      color: #999;
      font-size: 12px;
      font-weight: 400;
    }
  }

  //.store-btn {
  //  height: 200px;
  //}

  .iframe-dialog {
    ::v-deep .el-dialog {
      .el-dialog__close {
        color: $color-title;
        font-size: 20px;
        font-weight: bold;
      }
    }

  }
}

//
//.el-dialog {
//  .el-dialog__body {
//    //position: relative;
//    //box-sizing: border-box;
//
//  }
//}

.eqx-iframe {
  height: calc(100vh - 120px);
  width: 100%;
  //height: 320px;
  //position: absolute;
}
</style>

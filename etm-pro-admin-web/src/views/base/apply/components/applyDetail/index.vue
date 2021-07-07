<template>
  <div class="applyDetail">
    <div class="terminalTabBar">
      <el-tabs v-model="activeName">
        <el-tab-pane label="应用详情" name="first" />
        <el-tab-pane label="分享记录" name="second" />
      </el-tabs>
    </div>
    <div v-if="activeName == 'first'" class="appDetail">
      <apply-list :apply-list="currentList" :btn-text="'卸载'" :terminal-flag="true" :bottom-line="'long'" />
      <etm-title>关联应用</etm-title>
      <ul class="relevance">
        <li
          v-for="(tab,index) in tabs"
          :key="index"
          :class="{relevanceActive:relevanceActive==index}"
          @click="toggle(index,tab.view)"
        >
          {{ tab.type }}
        </li>
      </ul>
      <div v-if="relevanceApps.length>0" class="relevanceContent">
        <applyList v-for="(item,index) in relevanceApps" :key="index" :apply-list="item" :bottom-line="'long'" :terminal-flag="true" />
      </div>
      <no-content v-else />
      <etm-title>应用介绍</etm-title>

      <div class="applyIntro">
        介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容
      </div>
    </div>
    <div v-else class="appShare">
      <div class="shareIdentify">
        <etm-title>分享记录</etm-title>
        <el-button icon="el-icon-share" @click.stop="shareApplyOpen">分享应用</el-button>
      </div>
      <div class="shareRecord">
        <el-table
          :data="shareRecordData"
          style="width: 100%"
        >
          <el-table-column
            label="应用组织"
          >
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.org }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="分享时间"
          >
            <template slot-scope="scope">
              {{ scope.row.time }}
            </template>
          </el-table-column>
          <el-table-column
            label="应用有效期"
          >
            <template slot-scope="scope">
              {{ scope.row.date }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="cancelControl(scope.$index, scope.row)"
              >撤销
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <etm-pop
      :visible="shareApplyPop"
      pop="complex"
      title="选择分享企业"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="shareApplyOpen"
      @close="shareApplyClose"
      @confirm="shareApplyConfirm"
      @cancel="shareApplyCancel"
    >
      <share-app v-if="shareApplyPop" />
    </etm-pop>
  </div>
</template>

<script>
import etmTitle from '@/layout/main/EtmTitle'
import applyList from '../mainContent/applyList'
import etmPop from '@/layout/main/EtmPop'
import shareApp from './shareApp'
import noContent from '@/components/NoContent/index'
import { shareApply, applyDetail } from '../../../../../api/apply'

export default {
  name: 'Index',
  components: {
    etmTitle,
    applyList,
    etmPop,
    shareApp,
    noContent
  },
  data() {
    return {
      activeName: 'first',
      relevanceActive: 0,
      currentView: 'tab1',
      tabs: [
        {
          type: '流程类关联',
          view: 'tab1'
        },
        {
          type: '平台和功能类关联',
          view: 'tab2'
        }
      ],

      currentList: {},

      // 流程关联的app组
      dependApps: [
        {
          appName: 'app1',
          appDescription: 'app111',
          type: 'PC端'
        }
      ],

      // 平台关联的app组
      platformApps: [
        {
          appName: 'app1',
          appDescription: 'app111',
          type: 'PC端'
        },
        {
          appName: 'app2',
          appDescription: 'app222',
          type: '移动端'
        }
      ],

      // 当前显示的app组
      relevanceApps: [],

      shareRecordData: [{
        date: '2016-05-02~2018-05-02',
        org: '王小虎',
        time: '2016-05-02'
      }, {
        date: '2016-05-02~2018-05-02',
        org: '王小虎',
        time: '2016-05-02'
      }, {
        date: '2016-05-02~2018-05-02',
        org: '王小虎',
        time: '2016-05-02'
      }, {
        date: '2016-05-02~2018-05-02',
        org: '王小虎',
        time: '2016-05-02'
      }],
      shareApplyPop: false

    }
  },
  created() {
    this.applyDetail()
  },
  methods: {
    toggle(i, v) {
      this.relevanceActive = i
      this.currentView = v
      if (this.relevanceActive === 0) {
        this.relevanceApps = this.dependApps
      } else {
        this.relevanceApps = this.platformApps
      }
    },
    cancelControl(i, r) {
      console.log(i)
    },
    // 弹框
    shareApplyOpen() {
      this.shareApplyPop = true
    },
    shareApplyClose() {
      this.shareApplyPop = false
    },
    shareApplyConfirm() {
      const enterprise = this.$store.state.app.enterprise
      if (enterprise.length > 0) {
        const arr = []
        enterprise.forEach(item => {
          arr.push(item.organizationId)
        })
        const params = {
          sharedIds: arr,
          appId: ''
        }
        shareApply(params).then(response => {
          this.shareApplyPop = false
        })
      }
    },
    shareApplyCancel() {
      this.shareApplyPop = false
    },
    applyDetail() {
      const appId = '4'
      applyDetail(appId).then(res => {
        console.log(res.data)
        this.currentList = res.data
        // this.dependApps = res.data.dependApps
        // this.platformApps = res.data.platformApps
        this.relevanceApps = this.dependApps
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .applyDetail {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding-bottom: 20px;

    & /deep/ .text {
      border: 0;
    }

    .terminalTabBar{

      & /deep/ .el-tabs{
        .el-tabs__header{
          padding: 0 24px;
          margin: 0;
        }
        .el-tabs__nav-wrap::after {
          background-color: $divide-color;
        }

        .el-tabs__item.is-active {
          @include c_main_color();
        }
        .el-tabs__item.is-hover {
          @include c_main_color();
        }
        .el-tabs__active-bar {
          @include bgc_main_color();
        }
        .el-tabs__item{
          font-weight: 400;
          color: #303133;
          @include c_text_color();
        }
      }

    }

    .appDetail {
      flex: 1;
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .relevance {
        display: flex;
        font-size: 14px;
        margin: 0;
        padding: 0 24px;

        li {
          padding: 0 0 8px 0;
          @include c_text_color();
          list-style-type: none;
          cursor: pointer;

          &:not(:first-child) {
            margin-left: 40px
          }
        }

        li.relevanceActive {
          @include c_title_color();
          border-bottom: 2px solid $title-color;
        }
      }

      .applyIntro {
        font-size:14px;
        @include c_text_color();
        padding: 0 24px;
      }
    }

    .appShare {
      .shareIdentify {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 24px;
      }

      .shareRecord {
        padding: 0 24px;
      }
    }

  }
</style>

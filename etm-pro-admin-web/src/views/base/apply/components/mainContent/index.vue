<template>

  <div class="myApply">
    <div class="applyTabBar">
      <etm-title>应用中心</etm-title>
      <el-tabs v-model="applyActiveName" @tab-click="applyClick">
        <el-tab-pane label="我的应用" name="first" />
        <el-tab-pane label="应用市场" name="second" />
      </el-tabs>
    </div>

    <div class="terminalTabBar">
      <el-tabs v-model="terminalActiveName" @tab-click="terminalClick">
        <el-tab-pane label="电脑端应用" name="PC" />
        <el-tab-pane label="移动端应用" name="MOBILE" />
      </el-tabs>
    </div>
    <div class="sortTabContent">
      <div class="sortTabBar">
        <span v-for="(item, index) in categoryList" :key="index">
          <span class="sortTabName" :class="{activeColor: index === isActive}" @click="sortTabClick(index)">{{ item.name }}</span>
          <el-divider direction="vertical" />
        </span>
      </div>
      <div v-if="terminalActiveName === 'PC'">
        <el-button icon="el-icon-setting" @click.stop="toDisposeApply">配置应用</el-button>
      </div>
    </div>

    <div v-if="applyLists.length>0" class="applyList">
      <applyList v-for="(item,index) in applyLists" :key="index" :apply-list="item" :bottom-line="'short'" :btn-text="'安装'" :ellipsis-intro="true" @applyControl="fixApplyOpen" @applyDetailControl="toApplyDetail" />
    </div>

    <no-content v-else />

    <!--安装应用弹框-->
    <etm-pop
      :visible="fixApplyPop"
      pop="complex"
      title="安装确认"
      confirm-btn="确定"
      cancel-btn="取消"
      :content="fixApply"
      @open="fixApplyOpen"
      @close="fixApplyClose"
      @confirm="fixApplyConfirm"
      @cancel="fixApplyCancel"
    />

  </div>

</template>
<script>
import etmTitle from '@/layout/main/EtmTitle'
import applyList from './applyList'
import etmPop from '@/layout/main/EtmPop'
import fixApply from './fixApply'
import { getCategory, getMyApply } from '@/api/apply.js'
import noContent from '@/components/NoContent/index'

export default {
  name: 'Index',
  components: {
    etmPop,
    applyList,
    etmTitle,
    noContent
  },
  data() {
    return {
      terminalActiveName: 'PC',
      applyActiveName: 'first',
      isActive: 0,
      categoryList: [{
        category: 'ALL',
        name: '全部'
      }],
      applyLists: [],
      fixApplyPop: false,
      fixApply: fixApply
    }
  },
  computed: {

  },

  created() {
    this.terminalActiveName = this.$store.state.applyCenter.disposeType
    this.getFileName()
  },
  methods: {
    terminalClick(tab, event) {
      console.log(this.terminalActiveName)
      this.isActive = 0
      this.$store.dispatch('applyCenter/setDisposeType', this.terminalActiveName)
    },
    applyClick() {
      console.log(this.applyActiveName)
    },
    sortTabClick(index) {
      this.isActive = index
      const params = {}
      if (index > 0) {
        params.category	 = this.categoryList[index].category
      }
      this.getApply(params)
    },

    toDisposeApply() {
      this.$emit('switch', { target: 'disposeApply', index: 0 })
    },
    toApplyDetail() {
      this.$emit('switch', { target: 'applyDetail', index: 1 })
    },

    getFileName() { // 菜单文件接口
      this.getCategory()
      this.getApply()
    },
    getCategory() { // 应用类型接口
      getCategory().then(res => {
        res.data.forEach(newRes => {
          this.categoryList.push(newRes)
        })
      })
    },
    getApply(params) { // 我的应用接口
      getMyApply(params).then(res => {
        this.applyLists = res.data
        console.log(this.applyLists)
      })
    },

    // 弹框
    fixApplyOpen() {
      this.fixApplyPop = true
    },
    fixApplyClose() {
      this.fixApplyPop = false
    },
    fixApplyConfirm() {
      this.fixApplyPop = false
    },
    fixApplyCancel() {
      this.fixApplyPop = false
    }
  }
}
</script>
<style lang="scss" scoped>

  .myApply {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    & /deep/ .el-tabs {
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
    .applyTabBar {
      display: flex;
      justify-content: space-between;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 24px;
        bottom: 0;
        right: 24px;
        height: 1px;
        background-color: $divide-color;
        z-index: 1;
      }

      & /deep/ .text {
        border: 0;
      }

      & /deep/ .el-tabs {
        .el-tabs__header {
          padding: 0 24px;
          margin: 0;
        }

        .el-tabs__item {
          height: 50px;
          line-height: 50px;
        }

        .el-tabs__nav-wrap::after {
          height: 0;
          background-color: $divide-color;
        }

      }
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
      }

    }
      .sortTabContent{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 64px;
        padding: 0 24px;
        .sortTabBar{
          font-size:14px;
          @include c_text_color();
          .sortTabName{
            cursor: pointer;
          }
          .activeColor {
            @include c_main_color();
          }
        }
        & /deep/ .el-button{
          @include bgc_white();
          border: 1px solid;
          @include bc_control_color();
          @include c_title_color();
        }
      }

      .applyList{
        flex: 1;
        overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
      }
      .noContent{
        padding: 0 24px;
      }

  }

</style>
